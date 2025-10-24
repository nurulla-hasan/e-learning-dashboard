'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CurriculumForm from "./CurriculumForm"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import ImageUpload from "../form/ImageUpload"
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper"
import {
  useCreateCourseMutation,
  useGetTestsQuery,
} from "@/redux/features/course/courseApi"
import type { ISection } from "../../types/create.course.type"
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi"

const CreateCourseForm = () => {
  const navigate = useNavigate()
  const { data } = useGetTestsQuery({})
  const testsWithNullSection = data?.data?.filter((test: any) => test.sectionId === null)
  const requiredTestInfo = testsWithNullSection?.map((test: any) => ({
    id: test.id,
    title: test.title,
  })) || []

  const { data: categories} = useGetCategoriesQuery({})
  const categoryOptions = categories?.data?.map((category: any) => ({
    id: category.id,
    title: category.name,
  })) || []
  
  const [createCourseMutation] = useCreateCourseMutation()
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [instructorImage, setInstructorImage] = useState<File | null>(null)
  const [instructorImagePreview, setInstructorImagePreview] = useState<
    string | null
  >(null)

  const [lessonFiles, setLessonFiles] = useState<{ [lessonId: string]: File }>(
    {},
  )
  const [lessonKeyCounter, setLessonKeyCounter] = useState(1)

  const [bodyData, setBodyData] = useState<{
    courseTitle: string
    courseShortDescription: string
    courseDescription: string
    courseLevel: string
    categoryId: string
    price: number
    discountPrice: number
    skillLevel: string
    difficulty: string
    instructorName: string
    instructorDesignation: string
    instructorDescription: string
    sections: ISection[]
  }>({
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
    sections: [],
  })

  const handleBodyDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target
    setBodyData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setBodyData(prev => ({ ...prev, [id]: value }))
  }

  const handleSectionsChange = (sections: ISection[]) => {
    setBodyData(prev => ({ ...prev, sections }))
  }

  const handleLessonFileChange = (lessonId: string, file: File) => {
    const tempKey = `lesson${lessonKeyCounter}`
    setLessonKeyCounter(prev => prev + 1)

    setLessonFiles(prev => ({ ...prev, [tempKey]: file }))

    const updatedSections = bodyData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, tempKey } : lesson,
      ),
    }))

    setBodyData(prev => ({ ...prev, sections: updatedSections }))
  }

  const handleDeleteLesson = (lessonId: string) => {
    let tempKeyToDelete: string | undefined

    const updatedSections = bodyData.sections.map(section => ({
      ...section,
      lessons: section.lessons.filter(lesson => {
        if (lesson.id === lessonId) {
          tempKeyToDelete = lesson.tempKey
          return false
        }
        return true
      }),
    }))

    if (tempKeyToDelete) {
      const newLessonFiles = { ...lessonFiles }
      delete newLessonFiles[tempKeyToDelete]
      setLessonFiles(newLessonFiles)
    }

    setBodyData(prev => ({ ...prev, sections: updatedSections }))
  }

  const handleAddTest = (sectionId: string, testId: string) => {
    const updatedSections = bodyData.sections.map(section => {
      if (section.id === sectionId) {
        if (section.tests.some(test => test.testId === testId)) {
          return section
        }
        return { ...section, tests: [...section.tests, { testId }] }
      }
      return section
    })
    setBodyData(prev => ({ ...prev, sections: updatedSections }))
  }

  const handleRemoveTest = (sectionId: string, testId: string) => {
    const updatedSections = bodyData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tests: section.tests.filter(test => test.testId !== testId),
        }
      }
      return section
    })
    setBodyData(prev => ({ ...prev, sections: updatedSections }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const apiFormData = new FormData()

    if (thumbnail) {
      apiFormData.append("courseThumbnail", thumbnail);
    }
    if (instructorImage) {
      apiFormData.append("instructorImage", instructorImage)
    }

    Object.entries(lessonFiles).forEach(([key, file]) => {
      apiFormData.append(key, file)
    })

    const cleanedSections = bodyData.sections.map(section => ({
      title: section.title,
      order: section.order,
      tests: section.tests,
      lessons: section.lessons.map(lesson => ({
        title: lesson.title,
        order: lesson.order,
        tempKey: lesson.tempKey,
      })),
    }))

    const finalBodyData = {
      ...bodyData,
      sections: cleanedSections,
      price: Number(bodyData.price) || 0,
      discountPrice: Number(bodyData.discountPrice) || 0,
    }

    apiFormData.append("bodyData", JSON.stringify(finalBodyData));

    console.log("Final Body Data:", finalBodyData);

    try {
      const res = await createCourseMutation(apiFormData).unwrap()
      console.log(res)
      SuccessToast("Course created successfully")
      setBodyData({
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
        sections: [],
      })
      setThumbnail(null)
      setThumbnailPreview(null)
      setInstructorImage(null)
      setInstructorImagePreview(null)
      setLessonFiles({})
      setLessonKeyCounter(1)

    } catch (error) {
      console.log(error)
      ErrorToast("Failed to create course")
    }
  }

  return (
    <>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="border border-gray-300 px-6 py-6 rounded-md">
          <ImageUpload
            title="Course Thumbnail"
            image={thumbnail}
            setImage={setThumbnail}
            preview={thumbnailPreview}
            setPreview={setThumbnailPreview}
            setIconError={() => {}}
          />
        </div>

        {/* Basic Information */}
        <div className="border border-gray-300 px-6 py-6 rounded-md">
          <div className="space-y-6">
            <h2 className="text-base font-medium text-gray-900">
              Basic Information
            </h2>

            <div className="space-y-2">
              <Label
                htmlFor="courseTitle"
                className="text-sm font-medium text-gray-700"
              >
                Course Title*
              </Label>
              <Input
                id="courseTitle"
                value={bodyData.courseTitle}
                onChange={handleBodyDataChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="courseShortDescription"
                className="text-sm font-medium text-gray-700"
              >
                Short Description*
              </Label>
              <Input
                id="courseShortDescription"
                placeholder="Description"
                value={bodyData.courseShortDescription}
                onChange={handleBodyDataChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="courseDescription"
                className="text-sm font-medium text-gray-700"
              >
                Course Description*
              </Label>
              <Textarea
                id="courseDescription"
                placeholder="Description"
                value={bodyData.courseDescription}
                onChange={handleBodyDataChange}
                className="w-full min-h-[120px] resize-none"
              />
            </div>
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Course Level*
              </Label>
              <Select
                value={bodyData.courseLevel}
                onValueChange={value =>
                  handleSelectChange("courseLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Level">Select Level</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Course Category*
              </Label>
              <Select
                value={bodyData.categoryId}
                onValueChange={value =>
                  handleSelectChange("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Category">
                      Select Category
                    </SelectItem>
                    {categoryOptions.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Skill Level*
              </Label>
              <Select
                value={bodyData.skillLevel}
                onValueChange={value =>
                  handleSelectChange("skillLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                  <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                  <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Difficulty*
              </Label>
              <Select
                value={bodyData.difficulty}
                onValueChange={value =>
                  handleSelectChange("difficulty", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">EASY</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HARD">HARD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Course Fee*
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  value={bodyData.price}
                  onChange={handleBodyDataChange}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="discountPrice"
                className="text-sm font-medium text-gray-700"
              >
                Discount Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="discountPrice"
                  type="number"
                  value={bodyData.discountPrice}
                  onChange={handleBodyDataChange}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Information */}
        <div className="space-y-6 border border-gray-300 px-6 py-6 rounded-md">
          <h2 className="text-base font-medium text-gray-900">
            Instructor Information
          </h2>

          <div className="px-6 py-6 rounded-md">
            <ImageUpload
              title="Instructor Image"
              image={instructorImage}
              setImage={setInstructorImage}
              preview={instructorImagePreview}
              setPreview={setInstructorImagePreview}
              setIconError={() => {}}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="instructorName"
                className="text-sm font-medium text-gray-700"
              >
                Instructor Name*
              </Label>
              <Input
                id="instructorName"
                value={bodyData.instructorName}
                onChange={handleBodyDataChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="instructorDesignation"
                className="text-sm font-medium text-gray-700"
              >
                Designation*
              </Label>
              <Input
                id="instructorDesignation"
                value={bodyData.instructorDesignation}
                onChange={handleBodyDataChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="instructorDescription"
              className="text-sm font-medium text-gray-700"
            >
              Short Description*
            </Label>
            <Textarea
              id="instructorDescription"
              placeholder="Description"
              value={bodyData.instructorDescription}
              onChange={handleBodyDataChange}
              className="w-full min-h-[100px] resize-none"
            />
          </div>
        </div>

        <CurriculumForm
          sections={bodyData.sections}
          onSectionsChange={handleSectionsChange}
          lessonFiles={lessonFiles}
          onLessonFileChange={handleLessonFileChange}
          onDeleteLesson={handleDeleteLesson}
          onAddTest={handleAddTest}
          onRemoveTest={handleRemoveTest}
          testsData={requiredTestInfo}
        />

        <div className="flex gap-3 w-full lg:w-1/2">
          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 duration-200 text-white flex-1"
          >
            Publish Course
          </Button>
          <Button
            onClick={() => navigate("/courses")}
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  )
}

export default CreateCourseForm