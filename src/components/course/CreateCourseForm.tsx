/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";
import {
  useCreateCourseMutation
} from "@/redux/features/course/courseApi";
import type { ISection } from "../../types/create.course.type";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Form } from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, type TCourseFormValues } from "@/schema/course.schema";
import CourseBasicInfo from "./CourseBasicInfo";
import CourseMetaDetails from "./CourseMetaDetails";
import CoursePricing from "./CoursePricing";
import CourseInstructorInfo from "./CourseInstructorInfo";
import CurriculumForm from "./CurriculumForm";
import { useGetTestsQuery } from "@/redux/features/test/testApi";

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const { data } = useGetTestsQuery({});
  const testsWithNullSection = data?.data?.filter(
    (test: any) => test.sectionId === null
  );
  const requiredTestInfo =
    testsWithNullSection?.map((test: any) => ({
      id: test.id,
      title: test.title,
    })) || [];

  const { data: categories } = useGetCategoriesQuery({});
  const categoryOptions =
    categories?.data?.map((category: any) => ({
      id: category.id,
      title: category.name,
    })) || [];

  const [createCourseMutation] = useCreateCourseMutation();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [instructorImage, setInstructorImage] = useState<File | null>(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState<
    string | null
  >(null);

  const [lessonFiles, setLessonFiles] = useState<{ [lessonId: string]: File }>(
    {}
  );
  const [lessonKeyCounter, setLessonKeyCounter] = useState(1);
  const [sections, setSections] = useState<ISection[]>([]);

  const form = useForm<TCourseFormValues>({
    resolver: zodResolver(courseSchema) as any,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      courseTitle: "",
      courseShortDescription: "",
      courseDescription: "",
      courseLevel: "Select Level",
      categoryId: "Select Category",
      price: 0,
      discountPrice: 0,
      vatPercentage: 0,
      skillLevel: "BEGINNER",
      difficulty: "EASY",
      instructorName: "",
      instructorDesignation: "",
      instructorDescription: "",
    },
  });

  const watchedPrice = form.watch("price");
  const watchedDiscount = form.watch("discountPrice");
  useEffect(() => {
    form.trigger("discountPrice");
  }, [watchedPrice, watchedDiscount, form]);

  const handleSectionsChange = (updated: ISection[]) => {
    setSections(updated);
  };

  const handleLessonFileChange = (lessonId: string, file: File) => {
    const tempKey = `lesson${lessonKeyCounter}`;
    setLessonKeyCounter((prev) => prev + 1);

    setLessonFiles((prev) => ({ ...prev, [tempKey]: file }));

    const updatedSections = sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, tempKey } : lesson
      ),
    }));

    setSections(updatedSections);
  };

  const handleDeleteLesson = (lessonId: string) => {
    let tempKeyToDelete: string | undefined;

    const updatedSections = sections.map((section) => ({
      ...section,
      lessons: section.lessons.filter((lesson) => {
        if (lesson.id === lessonId) {
          tempKeyToDelete = lesson.tempKey;
          return false;
        }
        return true;
      }),
    }));

    if (tempKeyToDelete) {
      const newLessonFiles = { ...lessonFiles };
      delete newLessonFiles[tempKeyToDelete];
      setLessonFiles(newLessonFiles);
    }

    setSections(updatedSections);
  };

  const handleAddTest = (sectionId: string, testId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        if (section.tests.some((test) => test.testId === testId)) {
          return section;
        }
        return { ...section, tests: [...section.tests, { testId }] };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleRemoveTest = (sectionId: string, testId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          tests: section.tests.filter((test) => test.testId !== testId),
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const onSubmit: SubmitHandler<TCourseFormValues> = async (values) => {
    const apiFormData = new FormData();

    if (thumbnail) {
      apiFormData.append("courseThumbnail", thumbnail);
    }
    if (instructorImage) {
      apiFormData.append("instructorImage", instructorImage);
    }

    Object.entries(lessonFiles).forEach(([key, file]) => {
      apiFormData.append(key, file);
    });

    const cleanedSections = sections.map((section) => ({
      title: section.title,
      order: section.order,
      tests: section.tests,
      lessons: section.lessons.map((lesson) => ({
        title: lesson.title,
        order: lesson.order,
        tempKey: lesson.tempKey,
      })),
    }));

    // Build body: send price including VAT, discountPrice as entered, and vatPercentage
    const basePrice = Number(values.price) || 0;
    const vatPercent = Number(values.vatPercentage) || 0;
    const priceWithVat = basePrice + (basePrice * vatPercent / 100);

    const finalBodyData = {
      ...values,
      sections: cleanedSections,
      price: priceWithVat,
      discountPrice: Number(values.discountPrice) || 0,
      vatPercentage: vatPercent,
    };

    apiFormData.append("bodyData", JSON.stringify(finalBodyData));

    console.log("Final Body Data:", finalBodyData);

    try {
      const res = await createCourseMutation(apiFormData).unwrap();
      console.log(res);
      SuccessToast("Course created successfully");
      form.reset();
      setSections([]);
      setThumbnail(null);
      setThumbnailPreview(null);
      setInstructorImage(null);
      setInstructorImagePreview(null);
      setLessonFiles({});
      setLessonKeyCounter(1);
    } catch (error) {
      console.log(error);
      ErrorToast("Failed to create course");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6">
          <CourseBasicInfo
            control={form.control}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            thumbnailPreview={thumbnailPreview}
            setThumbnailPreview={setThumbnailPreview}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseMetaDetails
              control={form.control}
              categoryOptions={categoryOptions}
            />

            <CoursePricing control={form.control} />
          </div>

          <CourseInstructorInfo
            control={form.control}
            instructorImage={instructorImage}
            setInstructorImage={setInstructorImage}
            instructorImagePreview={instructorImagePreview}
            setInstructorImagePreview={setInstructorImagePreview}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <CurriculumForm
            sections={sections}
            onSectionsChange={handleSectionsChange}
            lessonFiles={lessonFiles}
            onLessonFileChange={handleLessonFileChange}
            onDeleteLesson={handleDeleteLesson}
            onAddTest={handleAddTest}
            onRemoveTest={handleRemoveTest}
            testsData={requiredTestInfo}
          />

          <div className="flex gap-3 w-full">
          <Button
            onClick={() => navigate("/courses")}
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 duration-200 text-white flex-1"
          >
            Publish Course
          </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseForm;
