/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, type TCourseFormValues } from "@/schema/course.schema";
import CourseBasicInfo from "./CourseBasicInfo";
import CourseMetaDetails from "./CourseMetaDetails";
import CoursePricing from "./CoursePricing";
import CourseInstructorInfo from "./CourseInstructorInfo";
import CurriculumForm from "./CurriculumForm";
import { useGetTestsQuery } from "@/redux/features/test/testApi";
import { useGetSingleCourseQuery } from "@/redux/features/course/courseApi";
import type { ISection } from "../../types/create.course.type";
import { Loader } from "lucide-react";

// Normalize API courseLevel to Select option values
const normalizeCourseLevel = (lvl: string | null | undefined) => {
  const map: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  if (!lvl) return "Select Level";
  const key = String(lvl).trim().toLowerCase();
  return map[key] ?? "Select Level";
};

const UpdateCourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  

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

  const { data: courseRes, isLoading: courseLoading } = useGetSingleCourseQuery(id as string, { skip: !id });

  useEffect(() => {
    const c: any = courseRes?.data;
    if (!c) return;
    form.reset({
      courseTitle: c.courseTitle ?? "",
      courseShortDescription: c.courseShortDescription ?? "",
      courseDescription: c.courseDescription ?? "",
      courseLevel: normalizeCourseLevel(c.courseLevel),
      categoryId: (c?.categoryId ?? c?.category?.id) ? String(c?.categoryId ?? c?.category?.id) : "Select Category",
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

  // Child components perform their own save operations now.

  if(courseLoading) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <Loader size={30} className="animate-spin"/>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6">
          <CourseBasicInfo
            control={form.control}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            thumbnailPreview={thumbnailPreview}
            setThumbnailPreview={setThumbnailPreview}
          />
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseMetaDetails control={form.control} setValue={form.setValue} initialCourse={courseRes?.data} />
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
            testsData={testsData}
          />

          <div className="flex gap-3 w-full">
            <Button
              onClick={() => navigate("/courses")}
              type="button"
              variant="outline"
              className="w-full bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UpdateCourseForm;
