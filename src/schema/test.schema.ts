import { z } from "zod";

export const OptionCreateSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
  order: z.coerce.number().int().min(1),
});

export const AnswerCreateSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean().default(true),
});

const QuestionBaseSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  description: z.string().optional(),
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  marks: z.coerce.number().int().min(1, "Marks must be at least 1"),
  explanation: z.string().optional(),
  order: z.coerce.number().int().min(1),
});

const QuestionMCQSchema = QuestionBaseSchema.extend({
  type: z.literal("MCQ"),
  options: z.array(OptionCreateSchema).min(2, "At least two options required"),
}).refine(
  (q) => q.options.some((o) => o.isCorrect),
  { message: "At least one correct option required", path: ["options"] }
);

const QuestionTrueFalseSchema = QuestionBaseSchema.extend({
  type: z.literal("TRUE_FALSE"),
  options: z
    .array(OptionCreateSchema)
    .length(2, "True/False must have exactly two options")
}).refine(
  (q) => q.options.filter((o) => o.isCorrect).length === 1,
  { message: "Exactly one option must be correct", path: ["options"] }
);

const QuestionShortAnswerSchema = QuestionBaseSchema.extend({
  type: z.literal("SHORT_ANSWER"),
  answers: z.array(AnswerCreateSchema).min(1, "At least one accepted answer required"),
}).refine(
  (q) => q.answers.some((a) => a.isCorrect),
  { message: "At least one accepted answer must be correct", path: ["answers"] }
);

export const QuestionCreateSchema = z.union([
  QuestionMCQSchema,
  QuestionTrueFalseSchema,
  QuestionShortAnswerSchema,
]);

export const TestCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  passingScore: z.coerce
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be 100 or less"),
  totalMarks: z.coerce.number().int().positive().optional(),
  timeLimit: z.coerce.number().int().positive().optional(),
  questions: z.array(QuestionCreateSchema).min(1, "Add at least one question"),
});

export type TTestCreateForm = z.infer<typeof TestCreateSchema>;
