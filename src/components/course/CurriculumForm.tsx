"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, X, Check, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ICurriculumFormProps,
  ISection,
  ILesson,
} from "../../types/create.course.type";
import { ScrollArea } from "../ui/scroll-area";

const CurriculumForm: React.FC<ICurriculumFormProps> = ({
  sections,
  onSectionsChange,
  onLessonFileChange,
  onDeleteLesson,
  onAddTest,
  onRemoveTest,
  lessonFiles,
  testsData,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(
    null
  );
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  useEffect(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      const newSection: ISection = {
        id: Date.now().toString(),
        title: newSectionTitle.trim(),
        lessons: [],
        order: sections.length + 1,
        tests: [],
      };
      const newSections = [...sections, newSection];
      onSectionsChange(newSections);
      setNewSectionTitle("");
      setIsAddingSectionOpen(false);
      setSelectedSectionId(newSection.id);
    }
  };

  const handleAddLesson = () => {
    if (newLessonTitle.trim() && selectedSection) {
      const newLesson: ILesson = {
        id: Date.now().toString(),
        title: newLessonTitle.trim(),
        description: "",
        order: selectedSection.lessons.length + 1,
      };
      const newSections = sections.map((section) =>
        section.id === selectedSectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      );
      onSectionsChange(newSections);
      setNewLessonTitle("");
      setIsAddingLesson(false);
    }
  };

  const handleLessonTitleChange = (lessonId: string, newTitle: string) => {
    const newSections = sections.map((section) => {
      if (section.id === selectedSectionId) {
        return {
          ...section,
          lessons: section.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson
          ),
        };
      }
      return section;
    });
    onSectionsChange(newSections);
  };

  const handleUploadClick = (lessonId: string) => {
    setUploadingLessonId(lessonId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && uploadingLessonId) {
      onLessonFileChange(uploadingLessonId, e.target.files[0]);
      setUploadingLessonId(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddTestClick = () => {
    if (selectedSectionId && selectedTestId) {
      onAddTest(selectedSectionId, selectedTestId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Curriculum Section */}
      <div className="border p-0 md:p-6 rounded-lg col-span-1">
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
                <Button
                  size="sm"
                  onClick={handleAddSection}
                  disabled={!newSectionTitle.trim()}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingSectionOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => setIsAddingSectionOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lesson and Test Details Section */}
      <div className="mt-4 md:mt-0 p-0 md:p-4 border-0 md:border rounded-lg col-span-2">
        <ScrollArea className="h-96">
          <div className="space-y-6 ">
            <Card className="border-0 md:border p-0 md:p-6 shadow-none md:shadow-sm">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="video/*,image/*,.pdf,.doc,.docx"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0 md:p-6">
                {selectedSection &&
                  selectedSection.lessons.map((lesson, index) => {
                    const lessonTempKey = lesson.tempKey;
                    const selectedFile = lessonTempKey
                      ? lessonFiles[lessonTempKey]
                      : null;
                    return (
                      <Card
                        key={lesson.id}
                        className="shadow-none"
                      >
                        <CardHeader className="flex-row items-center justify-between">
                          <CardTitle className="text-lg font-semibold">
                            Lesson {index + 1}
                          </CardTitle>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Title*
                            </label>
                            <Input
                              value={lesson.title}
                              onChange={(e) =>
                                handleLessonTitleChange(
                                  lesson.id,
                                  e.target.value
                                )
                              }
                              placeholder="Enter lesson title"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Upload Resources
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Button
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => handleUploadClick(lesson.id)}
                                type="button"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                              <p className="text-xs text-gray-500 mt-2">
                                *Upload video file/pdf/docs
                              </p>
                              {selectedFile && (
                                <p className="text-sm text-green-600 mt-2">
                                  File selected: {selectedFile.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {selectedSection &&
                (isAddingLesson ? (
                  <div className="flex items-center gap-2 px-6">
                    <Input
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="Enter lesson title..."
                      className="flex-1"
                      autoFocus
                      onKeyDown={(e) => handleKeyPress(e, handleAddLesson)}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddLesson}
                      disabled={!newLessonTitle.trim()}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsAddingLesson(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="px-0 md:px-6">
                    <Button
                      variant="outline"
                      className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setIsAddingLesson(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>
                ))}
            </Card>

            {selectedSection && (
              <Card className="border-0 md:border p-0 md:p-6">
                <CardHeader className="p-0 md:p-6 shadow-none md:shadow-sm">
                  <CardTitle>Tests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-0 md:p-6">
                  {selectedSection.tests.map((test) => {
                    const testTitle = testsData.find(
                      (t) => t.id === test.testId
                    )?.title;
                    return (
                      <div
                        key={test.testId}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                      >
                        <span>{testTitle || test.testId}</span>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            onRemoveTest(selectedSection.id, test.testId)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <Select
                      onValueChange={setSelectedTestId}
                      value={selectedTestId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a test" />
                      </SelectTrigger>
                      <SelectContent>
                        {testsData.length > 0 ? testsData.map((test) => (
                          <SelectItem key={test.id} value={test.id}>
                            {test.title}
                          </SelectItem>
                        )) : <SelectItem disabled value="no test data available">No tests available</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Button
                      className="w-full md:w-auto"
                      onClick={handleAddTestClick}
                      disabled={!selectedTestId}
                      type="button"
                    >
                      Add Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CurriculumForm;
