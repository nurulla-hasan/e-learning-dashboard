"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Upload, X, Check } from "lucide-react"
import curriculum_img from "../../assets/images/course/course-thumbnail-laptop-coding.jpg";

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  description: string
}

const CurriculumForm = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      title: "Introduction",
      lessons: [{ id: "1-1", title: "Understanding the web structure", description: "" }],
    },
    {
      id: "2",
      title: "HTML5 – Building the Structure",
      lessons: [],
    },
    {
      id: "3",
      title: "CSS3 – Styling Websites",
      lessons: [],
    },
    {
      id: "4",
      title: "JavaScript Basics",
      lessons: [],
    },
    {
      id: "5",
      title: "Final Project",
      lessons: [],
    },
  ])

  const [selectedSectionId, setSelectedSectionId] = useState<string>("1")
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [isAddingLesson, setIsAddingLesson] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState("")
  const [editingLessonTitle, setEditingLessonTitle] = useState("")
  //const [courseThumbnail, setCourseThumbnail] = useState<string>(curriculum_img)
  const courseThumbnail = curriculum_img;

  const selectedSection = sections.find((s) => s.id === selectedSectionId)

  useEffect(() => {
    if (selectedSection && selectedSection.lessons.length > 0) {
      setEditingLessonTitle(selectedSection.lessons[0].title)
    } else {
      setEditingLessonTitle("")
    }
  }, [selectedSection])

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      const newSection: Section = {
        id: Date.now().toString(),
        title: newSectionTitle.trim(),
        lessons: [],
      }
      setSections([...sections, newSection])
      setNewSectionTitle("")
      setIsAddingSectionOpen(false)
      setSelectedSectionId(newSection.id)
    }
  }

  const handleAddLesson = () => {
    if (newLessonTitle.trim() && selectedSection) {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        title: newLessonTitle.trim(),
        description: "",
      }

      setSections(
        sections.map((section) =>
          section.id === selectedSectionId ? { ...section, lessons: [...section.lessons, newLesson] } : section,
        ),
      )
      setNewLessonTitle("")
      setIsAddingLesson(false)
    }
  }

  const handleLessonTitleChange = (newTitle: string) => {
    setEditingLessonTitle(newTitle)

    if (selectedSection && selectedSection.lessons.length > 0) {
      setSections(
        sections.map((section) =>
          section.id === selectedSectionId
            ? {
                ...section,
                lessons: section.lessons.map((lesson, index) =>
                  index === 0 ? { ...lesson, title: newTitle } : lesson,
                ),
              }
            : section,
        ),
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action()
    } else if (e.key === "Escape") {
      setIsAddingSectionOpen(false)
      setIsAddingLesson(false)
      setNewSectionTitle("")
      setNewLessonTitle("")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Curriculum Section */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Curriculum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedSectionId === section.id
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedSectionId(section.id)}
            >
              <div className="text-sm font-medium">
                Section {index + 1}: {section.title}
              </div>
            </div>
          ))}

          {/* Add Section Input */}
          {isAddingSectionOpen ? (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Enter section title..."
                className="flex-1 h-8"
                autoFocus
                onKeyDown={(e) => handleKeyPress(e, handleAddSection)}
              />
              <Button size="sm" onClick={handleAddSection} disabled={!newSectionTitle.trim()} className="h-8 w-8 p-0">
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingSectionOpen(false)
                  setNewSectionTitle("")
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => setIsAddingSectionOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Lesson Details Section */}
      <div className="space-y-6">
        {selectedSection && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Lesson {sections.findIndex((s) => s.id === selectedSectionId) + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title*</label>
                <Input
                  value={editingLessonTitle}
                  onChange={(e) => handleLessonTitleChange(e.target.value)}
                  placeholder="Understanding the web structure"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Resources</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">*Upload video file/pdf/docs</p>
                </div>
              </div>

              {/* Add Lesson Button */}
              {isAddingLesson ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Enter lesson title..."
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => handleKeyPress(e, handleAddLesson)}
                  />
                  <Button size="sm" onClick={handleAddLesson} disabled={!newLessonTitle.trim()}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingLesson(false)
                      setNewLessonTitle("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsAddingLesson(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              )}
            </CardContent>
          </Card>
        )}

          {/* Media Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-2">Course Thumbnail*</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={courseThumbnail || "/placeholder.svg"}
                    alt="Course thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Input value="CoverPhoto.png" readOnly className="mb-2" />
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">Upload</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default CurriculumForm;