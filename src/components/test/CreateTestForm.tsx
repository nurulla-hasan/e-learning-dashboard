"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface Question {
  id: string
  type: "mcq" | "true-false" | "short-answer"
  question: string
  options?: string[]
  correctAnswer?: string | number
}

const CreateTestForm = () => {
  const navigate = useNavigate();
  const [testTitle, setTestTitle] = useState("Final Test")
  const [selectedCourse, setSelectedCourse] = useState("figma-ui-ux")
  const [passingScore, setPassingScore] = useState("70")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "mcq",
      question: "Which of the following is NOT a UX design principle?",
      options: ["Usability", "Accessibility", "Aesthetics", "Tax Accounting"],
      correctAnswer: 3,
    },
    {
      id: "2",
      type: "true-false",
      question: "A wireframe is used to represent the final colors, images, and branding of a product.",
      correctAnswer: "False",
    },
    {
      id: "3",
      type: "short-answer",
      question: "In your own words, explain the difference between UI (User Interface) and UX (User Experience).",
    },
  ])

  const addQuestion = (type: "mcq" | "true-false" | "short-answer") => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: `New ${type.replace("-", " ")} question`,
      ...(type === "mcq" && { options: ["Option 1", "Option 2", "Option 3", "Option 4"] }),
    }
    setQuestions([...questions, newQuestion])
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const renderQuestion = (question: Question, index:number) => {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-foreground flex-1 pr-4">{question.question}</p>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 border-orange-500"
              >
                <Edit className="h-4 w-4 text-white" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 border-red-500"
                onClick={() => deleteQuestion(question.id)}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {question.type === "mcq" && question.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="text-sm text-muted-foreground">
                  {optionIndex + 1}. {option}
                </div>
              ))}
            </div>
          )}

          {question.type === "true-false" && (
            <div className="flex gap-4">
              <div className="text-sm text-muted-foreground">1. True</div>
              <div className="text-sm text-muted-foreground">2. False</div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button onClick={()=>navigate("/test-builder")} variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">New Test</h1>
        </div>

        {/* Fill in details section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-medium text-foreground mb-6">Fills in details</h2>

          <div className="space-y-6">
            {/* Test Title */}
            <div className="space-y-2">
              <Label htmlFor="test-title" className="text-sm font-medium text-foreground">
                Test Title
              </Label>
              <Input
                id="test-title"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Course and Passing Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course-select" className="text-sm font-medium text-foreground">
                  Select Course
                </Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="figma-ui-ux">Figma UI/UX Design: Web and App Design</SelectItem>
                    <SelectItem value="react-development">React Development Fundamentals</SelectItem>
                    <SelectItem value="javascript-basics">JavaScript Basics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passing-score" className="text-sm font-medium text-foreground">
                  Passing Score
                </Label>
                <Select value={passingScore} onValueChange={setPassingScore}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select passing score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60%</SelectItem>
                    <SelectItem value="70">70%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Add questions section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-medium text-foreground mb-6">Adds questions</h2>

          {/* Question type buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={() => addQuestion("mcq")} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              MCQ
            </Button>
            <Button onClick={() => addQuestion("true-false")} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              True/False
            </Button>
            <Button onClick={() => addQuestion("short-answer")} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Short Answer
            </Button>
          </div>

          {/* Questions list */}
          <div className="space-y-4">{questions.map((question, index) => renderQuestion(question, index))}</div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2 min-w-[120px]">Publish</Button>
          <Button onClick={()=>navigate("/test-builder")} variant="outline" className="px-8 py-2 min-w-[120px] bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}


export default CreateTestForm;