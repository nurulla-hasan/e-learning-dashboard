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

  const [createCourseMutation] = useCreateCourseMutation();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [instructorImage, setInstructorImage] = useState<File | null>(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState<
    string | null
  >(null);

  const [lessonFiles, setLessonFiles] = useState<{ [tempKey: string]: File }>(
    {}
  );
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
              setValue={form.setValue}
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
            setSections={setSections}
            lessonFiles={lessonFiles}
            setLessonFiles={setLessonFiles}
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
