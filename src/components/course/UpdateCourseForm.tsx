"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";
import { Form } from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, type TCourseFormValues } from "@/schema/course.schema";
import CourseBasicInfo from "./CourseBasicInfo";
import CourseMetaDetails from "./CourseMetaDetails";
import CoursePricing from "./CoursePricing";
import CourseInstructorInfo from "./CourseInstructorInfo";
import CurriculumForm from "./CurriculumForm";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetTestsQuery } from "@/redux/features/test/testApi";
import { useGetSingleCourseQuery, useUpdateCourseMutation } from "@/redux/features/course/courseApi";
import type { ISection } from "../../types/create.course.type";

const UpdateCourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updateCourse, { isLoading: updateLoading }] = useUpdateCourseMutation();
  const { data: categories } = useGetCategoriesQuery({});
  const categoryOptions =
    categories?.data?.map((category: any) => ({ id: category.id, title: category.name })) || [];

  const { data: tests } = useGetTestsQuery({});
  const requiredTestInfo = useMemo(
    () =>
      (tests?.data
        ?.filter((t: any) => t.sectionId === null)
        .map((t: any) => ({ id: t.id, title: t.title })) || []),
    [tests]
  );

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [instructorImage, setInstructorImage] = useState<File | null>(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState<string | null>(null);
  const [lessonFiles, setLessonFiles] = useState<{ [lessonId: string]: File }>({});
  const [lessonKeyCounter, setLessonKeyCounter] = useState(1);
  const [sections, setSections] = useState<ISection[]>([]);
  const [testsData, setTestsData] = useState<{ id: string; title: string }[]>([]);

  const form = useForm<TCourseFormValues>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      courseTitle: "",
      courseShortDescription: "",
      courseDescription: "",
      courseLevel: "Select Level",
      categoryId: "Select Category",
      price: 0,
      discountPrice: 0,
      skillLevel: "BEGINNER",
      difficulty: "EASY",
      instructorName: "",
      instructorDesignation: "",
      instructorDescription: "",
    },
  });

  const { data: courseRes } = useGetSingleCourseQuery(id as string, { skip: !id });

  useEffect(() => {
    const c: any = courseRes?.data;
    if (!c) return;
    form.reset({
      courseTitle: c.courseTitle ?? "",
      courseShortDescription: c.courseShortDescription ?? "",
      courseDescription: c.courseDescription ?? "",
      courseLevel: c.courseLevel ?? "Select Level",
      categoryId: c.categoryId ?? "Select Category",
      price: c.price ?? 0,
      discountPrice: c.discountPrice ?? 0,
      skillLevel: c.skillLevel ?? "BEGINNER",
      difficulty: c.difficulty ?? "EASY",
      instructorName: c.instructorName ?? "",
      instructorDesignation: c.instructorDesignation ?? "",
      instructorDescription: c.instructorDescription ?? "",
    });

    const mappedSections: ISection[] = (c.Section ?? []).map((s: any, si: number) => ({
      id: s.id ?? String(si + 1),
      title: s.title ?? "",
      order: s.order ?? si + 1,
      lessons: (s.Lesson ?? []).map((l: any, li: number) => ({
        id: l.id ?? String(li + 1),
        title: l.title ?? "",
        order: l.order ?? li + 1,
        description: l.description ?? "",
        tempKey: undefined,
      })),
      tests: (s.Test ?? []).map((t: any) => ({ testId: t.id ?? t.testId ?? t })),
    }));
    setSections(mappedSections);
    setThumbnailPreview(c.courseThumbnailUrl ?? c.courseThumbnail ?? null);
    setInstructorImagePreview(c.instructorImageUrl ?? c.instructorImage ?? null);
  }, [courseRes, form]);

  // Build tests options including already attached tests so titles render
  useEffect(() => {
    const c: any = courseRes?.data;
    const attachedTests: { id: string; title: string }[] = ((c?.Section ?? [])
      .flatMap((s: any) => s.Test ?? [])
      .map((t: any) => ({ id: t.id, title: t.title }))) as { id: string; title: string }[];

    const combined = [
      ...((requiredTestInfo as { id: string; title: string }[]) || []),
      ...(attachedTests || []),
    ];
    const seen = new Set<string>();
    const deduped = combined.filter((t) => {
      if (!t?.id) return false;
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
    setTestsData(deduped);
  }, [requiredTestInfo, courseRes]);

  const handleSectionsChange = (updated: ISection[]) => setSections(updated);

  const handleLessonFileChange = (lessonId: string, file: File) => {
    const tempKey = `lesson${lessonKeyCounter}`;
    setLessonKeyCounter((prev) => prev + 1);
    setLessonFiles((prev) => ({ ...prev, [tempKey]: file }));
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, tempKey } : lesson
        ),
      })),
    );
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
        if (section.tests.some((t) => t.testId === testId)) return section;
        return { ...section, tests: [...section.tests, { testId }] };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleRemoveTest = (sectionId: string, testId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, tests: section.tests.filter((t) => t.testId !== testId) };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const onSubmit: SubmitHandler<TCourseFormValues> = async (values) => {
    if (!id) return;
    const apiFormData = new FormData();
    if (thumbnail) apiFormData.append("courseThumbnail", thumbnail);
    if (instructorImage) apiFormData.append("instructorImage", instructorImage);
    Object.entries(lessonFiles).forEach(([key, file]) => apiFormData.append(key, file));
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
    const finalBodyData = {
      ...values,
      sections: cleanedSections,
      price: Number(values.price) || 0,
      discountPrice: Number(values.discountPrice) || 0,
    };
    apiFormData.append("bodyData", JSON.stringify(finalBodyData));
    try {
      await updateCourse({ id, bodyData: apiFormData }).unwrap();
      SuccessToast("Course updated successfully");
      navigate("/courses");
    } catch (e: any) {
      ErrorToast(e?.data?.message || "Failed to update course");
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
            <CourseMetaDetails control={form.control} categoryOptions={categoryOptions} />
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
            testsData={testsData}
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
              disabled={updateLoading}
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 duration-200 text-white flex-1"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UpdateCourseForm;
