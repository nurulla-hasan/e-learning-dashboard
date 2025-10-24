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
import type { TCourseFormValues } from "@/schema/course.schema";
import ImageUpload from "@/components/form/ImageUpload";
import type React from "react";

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
    </Card>
  );
};

export default CourseInstructorInfo;
