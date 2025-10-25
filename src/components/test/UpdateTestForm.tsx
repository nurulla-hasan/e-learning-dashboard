"use client"

import { useEffect } from "react"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate, useParams } from "react-router-dom"
import { useGetSingleTestQuery, useUpdateTestMutation } from "@/redux/features/test/testApi"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm, useFieldArray, type SubmitErrorHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { testUpdateSchema, type TTestUpdateValues } from "@/schema/test.builder.schema"
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper"

const UpdateTestForm = ({ testId }: { testId?: string }) => {
  const navigate = useNavigate();
  const params = useParams();
  const id = testId ?? (params as any)?.id ?? (params as any)?.testId;

  const { data, isLoading, isError } = useGetSingleTestQuery(id);
  const [updateTest, { isLoading: updateLoading }] = useUpdateTestMutation();

  const form = useForm<TTestUpdateValues>({
    resolver: zodResolver(testUpdateSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      passingScore: 70,
      totalMarks: undefined,
      timeLimit: undefined,
      questions: [],
    },
  });

  const { control, handleSubmit, reset, setValue, watch } = form;
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
  const onInvalid: SubmitErrorHandler<TTestUpdateValues> = (errors) => {
    const { path, message } = firstError(errors);
    if (path) {
      // react-hook-form expects dot-paths
      // @ts-ignore
      form.setFocus(path as any, { shouldSelect: true });
    }
    ErrorToast(message || "Please fix the validation errors and try again");
  };

  const {
    fields: qFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  useEffect(() => {
    const d: any = data?.data;
    if (d) {
      const mapped: TTestUpdateValues = {
        title: d.title ?? "",
        description: d.description ?? "",
        passingScore: d?.passingScore != null ? Number(d.passingScore) : 70,
        totalMarks: d.totalMarks ?? undefined,
        timeLimit: d.timeLimit ?? undefined,
        questions: (d.questions ?? []).map((q: any, qi: number) => ({
          title: q.title ?? "",
          description: q.description ?? "",
          type: q.type,
          marks: Number(q.marks ?? 1),
          explanation: q.explanation ?? "",
          order: Number(q.order ?? qi + 1),
          ...(q.type === "MCQ" || q.type === "TRUE_FALSE"
            ? {
                options: (() => {
                  const base = (q.options ?? []).map((op: any, idx: number) => ({
                    text: op.text ?? "",
                    isCorrect: !!op.isCorrect,
                    order: Number(op.order ?? idx + 1),
                  }));
                  if (q.type === "TRUE_FALSE") {
                    return base.length === 2
                      ? base
                      : [
                          { text: "True", isCorrect: true, order: 1 },
                          { text: "False", isCorrect: false, order: 2 },
                        ];
                  }
                  if (base.length < 2) {
                    const add = 2 - base.length;
                    const extras = Array.from({ length: add }).map((_, i) => ({
                      text: `Option ${base.length + i + 1}`,
                      isCorrect: false,
                      order: base.length + i + 1,
                    }));
                    return [...base, ...extras];
                  }
                  return base;
                })(),
              }
            : {}),
          ...(q.type === "SHORT_ANSWER"
            ? {
                answers: (() => {
                  const arr = (q.answers ?? []).map((ans: any) => ({
                    text: ans.text ?? "",
                    isCorrect: ans.isCorrect ?? true,
                  }));
                  return arr.length ? arr : [{ text: "", isCorrect: true }];
                })(),
              }
            : {}),
        })),
      };
      reset(mapped);
    }
  }, [data, reset]);

  const addMCQ = () =>
    appendQuestion({
      title: "",
      description: "",
      type: "MCQ",
      marks: 1,
      explanation: "",
      order: qFields.length + 1,
      // @ts-ignore
      options: [
        { text: "Option 1", isCorrect: false, order: 1 },
        { text: "Option 2", isCorrect: true, order: 2 },
        { text: "Option 3", isCorrect: false, order: 3 },
        { text: "Option 4", isCorrect: false, order: 4 },
      ],
    } as any);

  const addTrueFalse = () =>
    appendQuestion({
      title: "",
      description: "",
      type: "TRUE_FALSE",
      marks: 1,
      explanation: "",
      order: qFields.length + 1,
      // @ts-ignore
      options: [
        { text: "True", isCorrect: true, order: 1 },
        { text: "False", isCorrect: false, order: 2 },
      ],
    } as any);

  const addShortAnswer = () =>
    appendQuestion({
      title: "",
      description: "",
      type: "SHORT_ANSWER",
      marks: 1,
      explanation: "",
      order: qFields.length + 1,
      // @ts-ignore
      answers: [{ text: "", isCorrect: true }],
    } as any);

  const onSubmit = async (values: TTestUpdateValues) => {
    if (!id) {
      ErrorToast("Missing test id in route");
      return;
    }
    try {
      await updateTest({ id, data: values }).unwrap();
      SuccessToast("Test updated successfully");
      navigate("/test-builder");
    } catch (error) {
      console.log(error);
      ErrorToast("Failed to update test");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to load test.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button onClick={() => navigate("/test-builder")} variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Update Test</h1>
        </div>

        <Form {...form}>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <Card>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter test title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Optional description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={control}
                    name="passingScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing Score (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            placeholder="70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="totalMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            placeholder="15"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            placeholder="60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button type="button" onClick={addMCQ} className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> MCQ
                  </Button>
                  <Button type="button" onClick={addTrueFalse} className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> True/False
                  </Button>
                  <Button type="button" onClick={addShortAnswer} className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Short Answer
                  </Button>
                </div>

                <div className="space-y-6">
                  {qFields.map((q, qi) => {
                    return (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium">Question {qi + 1}</p>
                          <Button type="button" variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-red-500" onClick={() => removeQuestion(qi)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name={`questions.${qi}.title` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Question title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`questions.${qi}.type` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                  <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MCQ">MCQ</SelectItem>
                                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <FormField
                            control={control}
                            name={`questions.${qi}.marks` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Marks</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`questions.${qi}.order` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`questions.${qi}.explanation` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Explanation</FormLabel>
                                <FormControl>
                                  <Input placeholder="Optional" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={control}
                          name={`questions.${qi}.description` as const}
                          render={({ field }) => (
                            <FormItem className="mt-3">
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Optional" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Conditional content based on type */}
                        {(() => {
                          const type = watch(`questions.${qi}.type` as const);
                          if (type === "MCQ" || type === "TRUE_FALSE") {
                            // options list
                            return (
                              <OptionsEditor control={control} qIndex={qi} type={type} setValue={setValue} />
                            );
                          }
                          if (type === "SHORT_ANSWER") {
                            return <AnswersEditor control={control} qIndex={qi} />;
                          }
                          return null;
                        })()}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button disabled={updateLoading} type="submit" className="bg-sky-500 hover:bg-sky-600 text-white px-8">
                {updateLoading ? "Updating..." : "Update"}
              </Button>
              <Button onClick={() => navigate("/test-builder")} type="button" variant="outline" className="px-8 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

function OptionsEditor({ control, qIndex, type, setValue }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: `questions.${qIndex}.options` as const });

  const ensureSingleCorrect = (selectedIndex: number) => {
    if (type === "TRUE_FALSE") {
      fields.forEach((_, idx) => {
        setValue(`questions.${qIndex}.options.${idx}.isCorrect` as const, idx === selectedIndex);
      });
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium">Options</p>
        {type === "MCQ" && (
          <Button type="button" size="sm" onClick={() => append({ text: "", isCorrect: false, order: fields.length + 1 })}>
            <Plus className="h-3 w-3 mr-1" /> Add Option
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {fields.map((f, oi) => (
          <div key={f.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-6">
              <FormField
                control={control}
                name={`questions.${qIndex}.options.${oi}.text` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Input placeholder={type === "TRUE_FALSE" ? (oi === 0 ? "True" : "False") : "Option text"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={control}
                name={`questions.${qIndex}.options.${oi}.order` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={control}
                name={`questions.${qIndex}.options.${oi}.isCorrect` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct</FormLabel>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          ensureSingleCorrect(oi);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              {type === "MCQ" && (
                <Button type="button" variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-red-500" onClick={() => remove(oi)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswersEditor({ control, qIndex }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: `questions.${qIndex}.answers` as const });
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium">Acceptable Answers</p>
        <Button type="button" size="sm" onClick={() => append({ text: "", isCorrect: true })}>
          <Plus className="h-3 w-3 mr-1" /> Add Answer
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((f, ai) => (
          <div key={f.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-9">
              <FormField
                control={control}
                name={`questions.${qIndex}.answers.${ai}.text` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Answer text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button type="button" variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-red-500" onClick={() => remove(ai)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpdateTestForm;