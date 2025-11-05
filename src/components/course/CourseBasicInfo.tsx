/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import ImageUpload from "@/components/form/ImageUpload"
import type React from "react"

interface CourseBasicInfoProps {
  control: any
  thumbnail: File | null
  setThumbnail: React.Dispatch<React.SetStateAction<File | null>>
  thumbnailPreview: string | null
  setThumbnailPreview: React.Dispatch<React.SetStateAction<string | null>>
}

const CourseBasicInfo = ({ control, thumbnail, setThumbnail, thumbnailPreview, setThumbnailPreview }: CourseBasicInfoProps) => {
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
      </Card>
    </div>
  )
}

export default CourseBasicInfo
