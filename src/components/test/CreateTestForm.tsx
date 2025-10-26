"use client"

import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm, useFieldArray, type SubmitErrorHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TestCreateSchema, type TTestCreateForm } from "@/schema/test.schema"
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper"
import { useCreateTestMutation } from "@/redux/features/test/testApi"

const CreateTestForm = () => {
  const navigate = useNavigate();
  const [createTest, { isLoading }] = useCreateTestMutation();

  const form = useForm<TTestCreateForm>({
    resolver: zodResolver(TestCreateSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      passingScore: 70,
      totalMarks: undefined,
      timeLimit: undefined,
      questions: [],
    },
  })

  const { fields: questionFields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  const firstError = (errors: any, path: string[] = []): { path?: string; message?: string } => {
    for (const key in errors) {
      const e = errors[key];
      if (!e) continue;
      const currentPath = [...path, key];
      if (typeof e.message === "string" && e.message) {
        return { path: currentPath.join("."), message: e.message };
      }
      if (typeof e === "object") {
        const nested = firstError(e, currentPath);
        if (nested.path || nested.message) return nested;
      }
    }
    return {};
  };

  const prettyFieldLabel = (p: string) => {
    const parts = p.split(".");
    const cap = (s: string) => s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    if (parts[0] === "questions") {
      const qi = Number(parts[1] ?? 0) + 1;
      if (parts[2] === "options") {
        const oi = Number(parts[3] ?? 0) + 1;
        const field = parts[4] ?? "";
        return `Question ${qi} Option ${oi} ${cap(field)}`;
      }
      if (parts[2] === "answers") {
        const ai = Number(parts[3] ?? 0) + 1;
        const field = parts[4] ?? "";
        return `Question ${qi} Answer ${ai} ${cap(field)}`;
      }
      const field = parts[2] ?? "";
      return `Question ${qi} ${cap(field)}`;
    }
    const topMap: Record<string, string> = {
      title: "Test Title",
      description: "Description",
      passingScore: "Passing Score",
      totalMarks: "Total Marks",
      timeLimit: "Time Limit",
    };
    return topMap[parts[0]] || cap(parts[0]);
  };

  const onInvalid: SubmitErrorHandler<TTestCreateForm> = (errors) => {
    const { path, message } = firstError(errors);
    let finalMessage = message || "Please fix the validation errors and try again";
    if (path) {
      // @ts-ignore
      form.setFocus(path as any, { shouldSelect: true });
      finalMessage = `${prettyFieldLabel(path)}: ${finalMessage}`;
    }
    ErrorToast(finalMessage);
  };

  const addQuestion = (type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER") => {
    const base = {
      title: "",
      description: "",
      type,
      marks: 1,
      explanation: "",
      order: questionFields.length + 1,
    } as any

    if (type === "MCQ") {
      base.options = [
        { text: "", isCorrect: true, order: 1 },
        { text: "", isCorrect: false, order: 2 },
        { text: "", isCorrect: false, order: 3 },
        { text: "", isCorrect: false, order: 4 },
      ]
    } else if (type === "TRUE_FALSE") {
      base.options = [
        { text: "True", isCorrect: true, order: 1 },
        { text: "False", isCorrect: false, order: 2 },
      ]
    } else if (type === "SHORT_ANSWER") {
      base.answers = [
        { text: "", isCorrect: true },
      ]
    }
    append(base)
  }

  const addOption = (qIdx: number) => {
    const opts = form.getValues(`questions.${qIdx}.options`) || []
    const nextOrder = opts.length + 1
    form.setValue(`questions.${qIdx}.options`, [...opts, { text: "", isCorrect: false, order: nextOrder }])
  }

  const removeOption = (qIdx: number, optIdx: number) => {
    const opts = (form.getValues(`questions.${qIdx}.options`) || []) as any[]
    if (opts.length <= 2) return
    const next = opts.filter((_, i) => i !== optIdx).map((o, i) => ({ ...o, order: i + 1 }))
    form.setValue(`questions.${qIdx}.options`, next)
  }

  const addAnswer = (qIdx: number) => {
    const answers = form.getValues(`questions.${qIdx}.answers`) || []
    form.setValue(`questions.${qIdx}.answers`, [...answers, { text: "", isCorrect: true }])
  }

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const answers = (form.getValues(`questions.${qIdx}.answers`) || []) as any[]
    const next = answers.filter((_, i) => i !== aIdx)
    form.setValue(`questions.${qIdx}.answers`, next)
  }

  const setTrueFalseCorrect = (qIdx: number, correctIndex: number) => {
    const opts = (form.getValues(`questions.${qIdx}.options`) || []) as any[]
    const next = opts.map((o, i) => ({ ...o, isCorrect: i === correctIndex }))
    form.setValue(`questions.${qIdx}.options`, next)
  }

  const onSubmit = async (values: TTestCreateForm) => {
    try {
      const normalized: TTestCreateForm = {
        ...values,
        questions: values.questions.map((q, qi) => ({
          ...q,
          order: qi + 1,
          ...(q as any).options
            ? { options: (q as any).options.map((o: any, oi: number) => ({ ...o, order: oi + 1 })) }
            : {},
        })),
      }
      await createTest(normalized).unwrap()
      SuccessToast("Test created successfully")
      form.reset()
      navigate("/test-builder")
    } catch (e) {
      // console.log(e as any)
      ErrorToast((e as any).data.message)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button onClick={() => navigate("/test-builder")} variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">New Test</h1>
        </div>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            <Card>
              <CardHeader>
                <CardTitle>Fill in details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter test title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Score (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks</FormLabel>
                      <FormControl>
                        <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional description" {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={() => addQuestion("MCQ")} className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> MCQ
                  </Button>
                  <Button type="button" onClick={() => addQuestion("TRUE_FALSE")} className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> True/False
                  </Button>
                  <Button type="button" onClick={() => addQuestion("SHORT_ANSWER")} className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Short Answer
                  </Button>
                </div>

                <div className="space-y-6">
                  {questionFields.map((q, qIdx) => {
                    const type = form.watch(`questions.${qIdx}.type`)
                    const tfOptions = form.watch(`questions.${qIdx}.options`) as any[] | undefined
                    const selectedTF = tfOptions?.findIndex(o => o.isCorrect) ?? 0
                    return (
                      <Card key={q.id}>
                        <CardHeader className="flex-row items-center justify-between">
                          <CardTitle>Question {qIdx + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(qIdx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`questions.${qIdx}.title` as const}
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Title*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter question title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`questions.${qIdx}.marks` as const}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Marks*</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`questions.${qIdx}.explanation` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Explanation (optional)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="min-h-[80px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {type === "MCQ" && (
                            <div className="space-y-3">
                              {(form.watch(`questions.${qIdx}.options`) as any[] | undefined)?.map((_, optIdx) => (
                                <div key={optIdx} className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={!!form.watch(`questions.${qIdx}.options.${optIdx}.isCorrect`)}
                                    onChange={(e) => form.setValue(`questions.${qIdx}.options.${optIdx}.isCorrect`, e.target.checked)}
                                  />
                                  <Input
                                    placeholder={`Option ${optIdx + 1}`}
                                    {...form.register(`questions.${qIdx}.options.${optIdx}.text` as const)}
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeOption(qIdx, optIdx)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <input type="hidden" {...form.register(`questions.${qIdx}.options.${optIdx}.order` as const)} />
                                </div>
                              ))}
                              <Button type="button" variant="outline" onClick={() => addOption(qIdx)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Option
                              </Button>
                            </div>
                          )}

                          {type === "TRUE_FALSE" && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                {[0,1].map((idx) => (
                                  <label key={idx} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`tf-${qIdx}`}
                                      checked={selectedTF === idx}
                                      onChange={() => setTrueFalseCorrect(qIdx, idx)}
                                    />
                                    <Input
                                      className="w-40"
                                      {...form.register(`questions.${qIdx}.options.${idx}.text` as const)}
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {type === "SHORT_ANSWER" && (
                            <div className="space-y-3">
                              {(form.watch(`questions.${qIdx}.answers`) as any[] | undefined)?.map((_, aIdx) => (
                                <div key={aIdx} className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={!!form.watch(`questions.${qIdx}.answers.${aIdx}.isCorrect`)}
                                    onChange={(e) => form.setValue(`questions.${qIdx}.answers.${aIdx}.isCorrect`, e.target.checked)}
                                  />
                                  <Input
                                    placeholder={`Accepted answer ${aIdx + 1}`}
                                    {...form.register(`questions.${qIdx}.answers.${aIdx}.text` as const)}
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeAnswer(qIdx, aIdx)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button type="button" variant="outline" onClick={() => addAnswer(qIdx)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Answer
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button disabled={isLoading} type="submit" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2 min-w-[120px]">
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
              <Button onClick={() => navigate("/test-builder")} type="button" variant="outline" className="px-8 py-2 min-w-[120px] bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateTestForm;