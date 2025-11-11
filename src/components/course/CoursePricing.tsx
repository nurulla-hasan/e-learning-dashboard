"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useFormContext, type Control } from "react-hook-form"
import type { TCourseFormValues } from "@/schema/course.schema"
import { useParams } from "react-router-dom"
import { useUpdateCourseMutation } from "@/redux/features/course/courseApi"
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper"

interface CoursePricingProps {
  control: Control<TCourseFormValues>
}

const CoursePricing = ({ control }: CoursePricingProps) => {
  const form = useFormContext<TCourseFormValues>()
  const { id } = useParams()
  const [updateCourse, { isLoading }] = useUpdateCourseMutation()

  const handleSavePricing = async () => {
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
      SuccessToast("Pricing updated successfully")
    } catch (e: unknown) {
      type ApiError = { data?: { message?: string } }
      const err = e as ApiError
      ErrorToast(err?.data?.message || (e instanceof Error ? e.message : "Failed to save pricing"))
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Fee*</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input type="number" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Price (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input type="number" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="vatPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT Percentage (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    className="pr-8"
                    placeholder="0"
                    {...field}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                If VAT is added, VAT will be added to the main price.
              </p>
            </FormItem>
          )}
        />
      </CardContent>
      <div className="px-6 pb-6">
        <Button disabled={isLoading} type="button" onClick={handleSavePricing} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Save Pricing
        </Button>
      </div>
    </Card>
  )
}

export default CoursePricing
