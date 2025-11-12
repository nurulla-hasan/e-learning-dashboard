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
import { useFormContext } from "react-hook-form";
import type { TCourseFormValues } from "@/schema/course.schema";
import { useParams } from "react-router-dom";
import { useUpdateCourseMutation } from "@/redux/features/course/courseApi";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";

const CurriculumForm: React.FC<ICurriculumFormProps> = ({
  sections,
  setSections,
  lessonFiles,
  setLessonFiles,
  testsData,
}) => {
  const form = useFormContext<TCourseFormValues>();
  const { id } = useParams();
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

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
  const [lessonKeyCounter, setLessonKeyCounter] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  useEffect(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const getResourceKind = (url?: string, contentType?: string | null) => {
    if (!url && !contentType) return "other" as const;
    const u = url || "";
    const ct = (contentType || "").toLowerCase();
    if (ct.startsWith("image") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(u))
      return "image" as const;
    if (ct.startsWith("video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(u))
      return "video" as const;
    if (ct.includes("pdf") || /\.pdf$/i.test(u)) return "pdf" as const;
    if (/\.(docx?|pptx?|xlsx?)$/i.test(u)) return "doc" as const;
    return "other" as const;
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      const newSection: ISection = {
        id: Date.now().toString(),
        title: newSectionTitle.trim(),
        lessons: [],
        order: sections.length + 1,
        tests: [],
      };
      setSections((prev) => {
        const next = [...prev, newSection];
        return next;
      });
      setNewSectionTitle("");
      setIsAddingSectionOpen(false);
      setSelectedSectionId(newSection.id);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    let tempKeyToDelete: string | undefined;
    const updatedSections = sections.map((section) => ({
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
      setLessonFiles((prev) => {
        const next = { ...prev } as { [k: string]: File };
        delete next[tempKeyToDelete as string];
        return next;
      });
    }
    setSections(updatedSections);
  };

  const handleAddLesson = () => {
    if (newLessonTitle.trim() && selectedSection) {
      const newLesson: ILesson = {
        id: Date.now().toString(),
        title: newLessonTitle.trim(),
        description: "",
        order: selectedSection.lessons.length + 1,
        isNew: true,
      };
      const newSections = sections.map((section) =>
        section.id === selectedSectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      );
      setSections(newSections);
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
    setSections(newSections);
  };

  const handleUploadClick = (lessonId: string) => {
    setUploadingLessonId(lessonId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && uploadingLessonId) {
      const file = e.target.files[0];
      const tempKey = `lesson${lessonKeyCounter}`;
      setLessonKeyCounter((prev) => prev + 1);
      setLessonFiles((prev) => ({ ...prev, [tempKey]: file }));
      const newSections = sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === uploadingLessonId ? { ...lesson, tempKey } : lesson
        ),
      }));
      setSections(newSections);
      setUploadingLessonId(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddTestClick = () => {
    if (selectedSectionId && selectedTestId) {
      const updatedSections = sections.map((section) => {
        if (section.id === selectedSectionId) {
          if (section.tests.some((t) => t.testId === selectedTestId))
            return section;
          return {
            ...section,
            tests: [...section.tests, { testId: selectedTestId }],
          };
        }
        return section;
      });
      setSections(updatedSections);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleSaveSection = async (sectionId: string) => {
    if (!id) return;
    const apiFormData = new FormData();
    const targetSection = sections.find((s) => s.id === sectionId);
    if (targetSection) {
      targetSection.lessons.forEach((lesson) => {
        if (lesson.tempKey) {
          const file = lessonFiles[lesson.tempKey];
          if (file) apiFormData.append(lesson.tempKey, file);
        }
      });
    }
    const cleanedSections = sections.map((section) => ({
      title: section.title,
      order: section.order,
      tests: section.tests,
      lessons: section.lessons.map((lesson) => ({
        title: lesson.title,
        order: lesson.order,
        tempKey: lesson.tempKey,
      })),
    }));
    const currentValues = form.getValues();
    const finalBodyData = {
      ...currentValues,
      sections: cleanedSections,
      price: Number(currentValues.price) || 0,
      discountPrice: Number(currentValues.discountPrice) || 0,
    };
    apiFormData.append("bodyData", JSON.stringify(finalBodyData));
    try {
      await updateCourse({ id, bodyData: apiFormData }).unwrap();
      SuccessToast("Section updated successfully");
    } catch (e: unknown) {
      type ApiError = { data?: { message?: string } };
      const err = e as ApiError;
      const msg =
        err?.data?.message ||
        (e instanceof Error ? e.message : "Failed to save section");
      ErrorToast(msg);
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
                      <Card key={lesson.id} className="shadow-none">
                        <CardHeader className="flex-row items-center justify-between gap-3">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-lg font-semibold">
                              Lesson {index + 1}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="rounded-full text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            {!lesson.isNew &&
                              lesson.content &&
                              (() => {
                                const kind = getResourceKind(
                                  lesson.content,
                                  lesson.contentType
                                );
                                if (kind === "image") {
                                  return (
                                    <a
                                      href={lesson.content}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <img
                                        src={lesson.content}
                                        alt={lesson.title}
                                        className="w-16 h-10 object-cover rounded border"
                                      />
                                    </a>
                                  );
                                }
                                if (kind === "video") {
                                  return (
                                    <a
                                      href={lesson.content}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <video
                                        src={lesson.content}
                                        className="w-16 h-10 rounded border object-cover"
                                        muted
                                        playsInline
                                        preload="metadata"
                                      />
                                    </a>
                                  );
                                }
                                return (
                                  <a
                                    href={lesson.content}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 underline"
                                  >
                                    View
                                  </a>
                                );
                              })()}
                          </div>
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
                              disabled={!lesson.isNew}
                            />
                          </div>

                          {lesson.isNew && (
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
                          )}
                          {!lesson.isNew && lesson.content && null}
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
                <CardHeader className="p-0 md:p-6 shadow-none md:shadow-sm rounded-lg">
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
                          onClick={() => {
                            const updatedSections = sections.map((section) => {
                              if (section.id === selectedSection.id) {
                                return {
                                  ...section,
                                  tests: section.tests.filter(
                                    (t) => t.testId !== test.testId
                                  ),
                                };
                              }
                              return section;
                            });
                            setSections(updatedSections);
                          }}
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
                        {testsData.length > 0 ? (
                          testsData.map((test) => (
                            <SelectItem key={test.id} value={test.id}>
                              {test.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="no test data available">
                            No tests available
                          </SelectItem>
                        )}
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
            {selectedSection && (
              <div className="px-0 md:px-6">
                <Button
                  className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-white"
                  onClick={() => handleSaveSection(selectedSection.id)}
                  type="button"
                  disabled={isLoading}
                >
                  Save This Section
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CurriculumForm;
