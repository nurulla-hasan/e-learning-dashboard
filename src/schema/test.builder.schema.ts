import { z } from "zod";

export const optionSchema = z.object({
  text: z.string().min(1, "Option text is required and cannot be empty"),
  isCorrect: z.boolean().default(false),
  order: z.coerce.number().int().nonnegative().default(1),
});

export const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required and cannot be empty"),
  isCorrect: z.boolean().default(true),
});

const baseQuestionSchema = z.object({
  title: z.string().min(1, "Question title is required and cannot be empty"),
  description: z.string().optional(),
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  marks: z.coerce.number().int().positive("Marks must be a positive number greater than 0"),
  explanation: z.string().optional(),
  order: z.coerce.number().int().nonnegative().default(1),
});

const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("MCQ"),
  options: z.array(optionSchema).min(2, "MCQ questions must have at least 2 options"),
});

const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("TRUE_FALSE"),
  options: z.array(optionSchema).length(2, "True/False questions must have exactly 2 options (True and False)"),
});

const shortAnswerSchema = baseQuestionSchema.extend({
  type: z.literal("SHORT_ANSWER"),
  answers: z.array(answerSchema).min(1, "Short answer questions must have at least one acceptable answer"),
});

export const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  trueFalseSchema,
  shortAnswerSchema,
]);

const baseTestSchema = z.object({
  title: z.string().min(1, "Test title is required and cannot be empty"),
  description: z.string().optional(),
  passingScore: z.coerce.number().int().min(1, "Passing score must be between 1 and 100").max(100, "Passing score must be between 1 and 100"),
  totalMarks: z.coerce.number().int().positive("Total marks must be a positive number").optional(),
  timeLimit: z.coerce.number().int().positive("Time limit must be a positive number in minutes").optional(),
});

export const testCreateSchema = baseTestSchema.extend({
  questions: z.array(questionSchema).min(1, "Test must have at least one question"),
});

export const testUpdateSchema = baseTestSchema.extend({
  questions: z
    .array(
      // Update-time relaxed rules for SHORT_ANSWER
      z.discriminatedUnion("type", [
        mcqSchema,
        trueFalseSchema,
        baseQuestionSchema.extend({
          type: z.literal("SHORT_ANSWER"),
          // answers optional during update so UI can hide Acceptable Answers
          answers: z.array(answerSchema).optional(),
        }),
      ])
    )
    .optional(),
});

// Preserve existing export name for create forms
export const testSchema = testCreateSchema;

export type TTestFormValues = z.infer<typeof testCreateSchema>;
export type TTestUpdateValues = z.infer<typeof testUpdateSchema>;
