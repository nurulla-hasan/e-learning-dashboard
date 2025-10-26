import { z } from "zod";

export const OptionCreateSchema = z.object({
  text: z.string().min(1, "Option text is required and cannot be empty"),
  isCorrect: z.boolean().default(false),
  order: z.coerce.number().int().min(1),
});

export const AnswerCreateSchema = z.object({
  text: z.string().min(1, "Answer text is required and cannot be empty"),
  isCorrect: z.boolean().default(true),
});

const QuestionBaseSchema = z.object({
  title: z.string().min(1, "Question title is required and cannot be empty"),
  description: z.string().optional(),
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  marks: z.coerce.number().int().min(1, "Marks must be a positive number greater than 0"),
  explanation: z.string().optional(),
  order: z.coerce.number().int().min(1),
});

const QuestionMCQSchema = QuestionBaseSchema.extend({
  type: z.literal("MCQ"),
  options: z.array(OptionCreateSchema).min(2, "MCQ questions must have at least 2 options"),
}).refine(
  (q) => q.options.some((o) => o.isCorrect),
  { message: "At least one option must be marked as correct", path: ["options"] }
);

const QuestionTrueFalseSchema = QuestionBaseSchema.extend({
  type: z.literal("TRUE_FALSE"),
  options: z
    .array(OptionCreateSchema)
    .length(2, "True/False questions must have exactly 2 options (True and False)"),
}).refine(
  (q) => q.options.filter((o) => o.isCorrect).length === 1,
  { message: "Exactly one option must be marked as correct", path: ["options"] }
);

const QuestionShortAnswerSchema = QuestionBaseSchema.extend({
  type: z.literal("SHORT_ANSWER"),
  answers: z.array(AnswerCreateSchema).min(1, "Short answer questions must have at least one acceptable answer"),
}).refine(
  (q) => q.answers.some((a) => a.isCorrect),
  { message: "At least one answer must be marked as correct", path: ["answers"] }
);

export const QuestionCreateSchema = z.union([
  QuestionMCQSchema,
  QuestionTrueFalseSchema,
  QuestionShortAnswerSchema,
]);

export const TestCreateSchema = z.object({
  title: z.string().min(1, "Test title is required and cannot be empty"),
  description: z.string().optional(),
  passingScore: z.coerce
    .number()
    .min(0, "Passing score must be between 0 and 100")
    .max(100, "Passing score must be between 0 and 100"),
  totalMarks: z.coerce.number().int().positive("Total marks must be a positive number").optional(),
  timeLimit: z.coerce.number().int().positive("Time limit must be a positive number in minutes").optional(),
  questions: z.array(QuestionCreateSchema).min(1, "Test must have at least one question"),
});

export type TTestCreateForm = z.infer<typeof TestCreateSchema>;
