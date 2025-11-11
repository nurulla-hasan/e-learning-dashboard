"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Control } from "react-hook-form";
import ImageUpload from "@/components/form/ImageUpload";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { TCourseFormValues } from "@/schema/course.schema";
import { useParams } from "react-router-dom";
import { useUpdateCourseMutation } from "@/redux/features/course/courseApi";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";

interface CourseInstructorInfoProps {
  control: Control<TCourseFormValues>;
  instructorImage: File | null;
  setInstructorImage: React.Dispatch<React.SetStateAction<File | null>>;
  instructorImagePreview: string | null;
  setInstructorImagePreview: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

const CourseInstructorInfo = ({
  control,
  instructorImage,
  setInstructorImage,
  instructorImagePreview,
  setInstructorImagePreview,
}: CourseInstructorInfoProps) => {
  const form = useFormContext<TCourseFormValues>();
  const { id } = useParams();
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

  const handleSaveInstructorInfo = async () => {
    if (!id) return;
    const apiFormData = new FormData();
    if (instructorImage) apiFormData.append("instructorImage", instructorImage);
    const currentValues = form.getValues();
    const finalBodyData = {
      ...currentValues,
      price: Number(currentValues.price) || 0,
      discountPrice: Number(currentValues.discountPrice) || 0,
    };
    apiFormData.append("bodyData", JSON.stringify(finalBodyData));
    try {
      await updateCourse({ id, bodyData: apiFormData }).unwrap();
      SuccessToast("Instructor info updated successfully");
    } catch (e: unknown) {
      type ApiError = { data?: { message?: string } }
      const err = e as ApiError
      const msg = err?.data?.message || (e instanceof Error ? e.message : "Failed to save instructor info")
      ErrorToast(msg)
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-md">
          <ImageUpload
            title="Instructor Image"
            image={instructorImage}
            setImage={setInstructorImage}
            preview={instructorImagePreview}
            setPreview={setInstructorImagePreview}
            setIconError={() => {}}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="instructorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="instructorDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="instructorDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description*</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px] resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <Button disabled={isLoading} type="button" onClick={handleSaveInstructorInfo} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Save Instructor Information
        </Button>
      </div>
    </Card>
  );
};

export default CourseInstructorInfo;
