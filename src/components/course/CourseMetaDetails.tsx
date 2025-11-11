/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"
import type { TCourseFormValues } from "@/schema/course.schema"
import { useParams } from "react-router-dom"
import { useUpdateCourseMutation } from "@/redux/features/course/courseApi"
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper"

interface CourseMetaDetailsProps {
  control: any
  setValue: any
  initialCourse?: any
}

const CourseMetaDetails = ({ control, setValue, initialCourse }: CourseMetaDetailsProps) => {
  type Option = { id: string; title: string }
  const form = useFormContext<TCourseFormValues>()
  const { id } = useParams()
  const [updateCourse, { isLoading }] = useUpdateCourseMutation()
  // Normalize API courseLevel to Select option values
  const normalizeCourseLevel = (lvl: string | null | undefined) => {
    const map: Record<string, string> = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    }
    if (!lvl) return "Select Level"
    const key = String(lvl).trim().toLowerCase()
    return map[key] ?? "Select Level"
  }

  // Fetch categories here and merge current course category if missing
  const { data: categories } = useGetCategoriesQuery({})
  const baseOptions: Option[] = useMemo(
    () => (categories?.data?.map((c: any) => ({ id: String(c.id), title: c.name })) as Option[]) || [],
    [categories]
  )
  const categoryOptions: Option[] = useMemo(() => {
    const c: any = initialCourse
    const effectiveCategoryId = c?.categoryId ?? c?.category?.id
    if (!effectiveCategoryId) return baseOptions
    const exists = baseOptions.some((opt: Option) => String(opt.id) === String(effectiveCategoryId))
    if (exists) return baseOptions
    const fallbackTitle = c?.category?.name ?? c?.categoryName ?? "Current Category"
    return [{ id: String(effectiveCategoryId), title: fallbackTitle }, ...baseOptions]
  }, [baseOptions, initialCourse])

  // Set defaults into the form when course data arrives
  useEffect(() => {
    const c: any = initialCourse
    if (!c) return
    const lvl = normalizeCourseLevel(c.courseLevel)
    setValue("courseLevel", lvl, { shouldDirty: false, shouldTouch: false })
    const effectiveCategoryId = c?.categoryId ?? c?.category?.id
    if (effectiveCategoryId) {
      setValue("categoryId", String(effectiveCategoryId), { shouldDirty: false, shouldTouch: false })
    }
  }, [initialCourse, setValue])

  const handleSaveCourseDetails = async () => {
    if (!id) return
    const apiFormData = new FormData()
    const currentValues = form.getValues()
    const finalBodyData = {
      ...currentValues,
      price: Number(currentValues.price) || 0,
      discountPrice: Number(currentValues.discountPrice) || 0,
    }
    apiFormData.append("bodyData", JSON.stringify(finalBodyData))
    try {
      await updateCourse({ id, bodyData: apiFormData }).unwrap()
      SuccessToast("Course details updated successfully")
    } catch (e: any) {
      ErrorToast(e?.data?.message || "Failed to save course details")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="courseLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Level*</FormLabel>
              <FormControl>
                <Select
                  key={`level-${String(field.value)}`}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Level">Select Level</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Category*</FormLabel>
              <FormControl>
                <Select
                  key={`category-${String(field.value)}-${categoryOptions.length}`}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Category">Select Category</SelectItem>
                    {categoryOptions.map((category: Option) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="skillLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Level*</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                    <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                    <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty*</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">EASY</SelectItem>
                    <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                    <SelectItem value="HARD">HARD</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <Button disabled={isLoading} type="button" onClick={handleSaveCourseDetails} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            Save Course Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseMetaDetails
