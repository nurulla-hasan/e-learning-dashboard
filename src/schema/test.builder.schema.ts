import { z } from "zod";

export const optionSchema = z.object({
  text: z.string().min(1, "Required"),
  isCorrect: z.boolean().default(false),
  order: z.coerce.number().int().nonnegative().default(1),
});

export const answerSchema = z.object({
  text: z.string().min(1, "Required"),
  isCorrect: z.boolean().default(true),
});

const baseQuestionSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  marks: z.coerce.number().int().positive("Must be > 0"),
  explanation: z.string().optional(),
  order: z.coerce.number().int().nonnegative().default(1),
});

const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("MCQ"),
  options: z.array(optionSchema).min(2, "At least two options"),
});

const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("TRUE_FALSE"),
  options: z.array(optionSchema).length(2, "Must have exactly two options"),
});

const shortAnswerSchema = baseQuestionSchema.extend({
  type: z.literal("SHORT_ANSWER"),
  answers: z.array(answerSchema).min(1, "At least one answer"),
});

export const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  trueFalseSchema,
  shortAnswerSchema,
]);

const baseTestSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  passingScore: z.coerce.number().int().min(1).max(100),
  totalMarks: z.coerce.number().int().positive().optional(),
  timeLimit: z.coerce.number().int().positive().optional(),
});

export const testCreateSchema = baseTestSchema.extend({
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

export const testUpdateSchema = baseTestSchema.extend({
  questions: z.array(questionSchema).optional(),
});

// Preserve existing export name for create forms
export const testSchema = testCreateSchema;

export type TTestFormValues = z.infer<typeof testCreateSchema>;
export type TTestUpdateValues = z.infer<typeof testUpdateSchema>;
