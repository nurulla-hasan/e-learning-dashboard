/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import ImageUpload from "@/components/form/ImageUpload"
import type React from "react"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"
import type { TCourseFormValues } from "@/schema/course.schema"
import { useParams } from "react-router-dom"
import { useUpdateCourseMutation } from "@/redux/features/course/courseApi"
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper"

interface CourseBasicInfoProps {
  control: any
  thumbnail: File | null
  setThumbnail: React.Dispatch<React.SetStateAction<File | null>>
  thumbnailPreview: string | null
  setThumbnailPreview: React.Dispatch<React.SetStateAction<string | null>>
}

const CourseBasicInfo = ({ control, thumbnail, setThumbnail, thumbnailPreview, setThumbnailPreview }: CourseBasicInfoProps) => {
  const form = useFormContext<TCourseFormValues>()
  const { id } = useParams()
  const [updateCourse, { isLoading }] = useUpdateCourseMutation()

  const handleSaveBasicInfo = async () => {
    if (!id) return
    const apiFormData = new FormData()
    if (thumbnail) apiFormData.append("courseThumbnail", thumbnail)
    const currentValues = form.getValues()
    const finalBodyData = {
      ...currentValues,
      price: Number(currentValues.price) || 0,
      discountPrice: Number(currentValues.discountPrice) || 0,
    }
    apiFormData.append("bodyData", JSON.stringify(finalBodyData))
    try {
      await updateCourse({ id, bodyData: apiFormData }).unwrap()
      SuccessToast("Basic info updated successfully")
    } catch (e: any) {
      ErrorToast(e?.data?.message || "Failed to save basic info")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Thumbnail</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            title="Course Thumbnail"
            image={thumbnail}
            setImage={setThumbnail}
            preview={thumbnailPreview}
            setPreview={setThumbnailPreview}
            setIconError={() => {}}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="courseTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. UI/UX Design Fundamentals" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="courseShortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="A short summary about the course" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="courseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description*</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Detail about what this course covers" className="min-h-[120px] resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <div className="px-6 pb-6">
          <Button disabled={isLoading} type="button" onClick={handleSaveBasicInfo} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            Save Basic Information
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default CourseBasicInfo
