"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CurriculumForm from "./CurriculumForm";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

// Local types aligned with CurriculumForm
interface Lesson {
  id: string;
  title: string;
  description: string;
  tempKey?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

const UpdateCourseForm = () => {
  const navigate = useNavigate();
  const [lessonFiles, setLessonFiles] = useState<{ [lessonId: string]: File }>({});
  const [lessonKeyCounter, setLessonKeyCounter] = useState(1);
  const [formData, setFormData] = useState({
    courseTitle: "Figma UI/UX Design: Web and App Design",
    shortDescription: "",
    courseDescription: "",
    courseLevel: "Select Level",
    courseCategory: "Select Category",
    certificate: "Yes",
    fullLifetimeAccess: "Yes",
    courseFee: "47",
    discountPrice: "62",
    instructorName: "Sophia Reynolds",
    role: "Senior UI/UX Designer & Design Mentor",
    instructorDescription: "",
    sections: [] as Section[],
  });

  const handleSectionsChange = (sections: Section[]) => {
    setFormData((prev) => ({ ...prev, sections }));
  };

  const handleLessonFileChange = (lessonId: string, file: File) => {
    const tempKey = `lesson${lessonKeyCounter}`;
    setLessonKeyCounter((prev) => prev + 1);

    setLessonFiles((prev) => ({ ...prev, [tempKey]: file }));

    const updatedSections = formData.sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, tempKey } : lesson
      ),
    }));

    setFormData((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleDeleteLesson = (lessonId: string) => {
    let tempKeyToDelete: string | undefined;

    const updatedSections = formData.sections.map((section) => ({
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

    setFormData((prev) => ({ ...prev, sections: updatedSections }));
  };

  return (
    <>
      <form className="space-y-8">
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
                value={formData.courseTitle}
                onChange={(e) =>
                  setFormData({ ...formData, courseTitle: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="shortDescription"
                className="text-sm font-medium text-gray-700"
              >
                Short Description*
              </Label>
              <Input
                id="shortDescription"
                placeholder="Description"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
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
                value={formData.courseDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseDescription: e.target.value,
                  })
                }
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
                value={formData.courseLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseLevel: value })
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
                value={formData.courseCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Category">
                    Select Category
                  </SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Certificate*
              </Label>
              <Select
                value={formData.certificate}
                onValueChange={(value) =>
                  setFormData({ ...formData, certificate: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Full Lifetime Access*
              </Label>
              <Select
                value={formData.fullLifetimeAccess}
                onValueChange={(value) =>
                  setFormData({ ...formData, fullLifetimeAccess: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="courseFee"
                className="text-sm font-medium text-gray-700"
              >
                Course Fee*
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="courseFee"
                  value={formData.courseFee}
                  onChange={(e) =>
                    setFormData({ ...formData, courseFee: e.target.value })
                  }
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
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPrice: e.target.value })
                  }
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

          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-blue-100">
                <User className="h-8 w-8 text-blue-600" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Instructor Name*
              </Label>
              <Input
                id="courseTitle"
                value={formData.instructorName}
                onChange={(e) =>
                  setFormData({ ...formData, instructorName: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Role*</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Senior UI/UX Designer & Design Mentor">
                    Senior UI/UX Designer & Design Mentor
                  </SelectItem>
                  <SelectItem value="Lead Designer">Lead Designer</SelectItem>
                  <SelectItem value="Design Director">
                    Design Director
                  </SelectItem>
                </SelectContent>
              </Select>
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
              value={formData.instructorDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructorDescription: e.target.value,
                })
              }
              className="w-full min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <CurriculumForm
          sections={formData.sections}
          onSectionsChange={handleSectionsChange}
          onLessonFileChange={handleLessonFileChange}
          onDeleteLesson={handleDeleteLesson}
          lessonFiles={lessonFiles}
        />
        <div className="flex gap-3 w-full lg:w-1/2">
          <Button className="bg-cyan-500 hover:bg-cyan-600 duration-200 text-white flex-1">
            Save Changes
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
  );
};

export default UpdateCourseForm;
