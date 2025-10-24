export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";

export type OptionCreate = {
  text: string;
  isCorrect: boolean;
  order: number;
};

export type AnswerCreate = {
  text: string;
  isCorrect: boolean;
};

export type QuestionCreateBase = {
  title: string;
  description?: string;
  type: QuestionType;
  marks: number;
  explanation?: string;
  order: number;
};

export type QuestionCreateMCQ = QuestionCreateBase & {
  type: "MCQ";
  options: OptionCreate[];
};

export type QuestionCreateTrueFalse = QuestionCreateBase & {
  type: "TRUE_FALSE";
  options: OptionCreate[];
};

export type QuestionCreateShortAnswer = QuestionCreateBase & {
  type: "SHORT_ANSWER";
  answers: AnswerCreate[];
};

export type QuestionCreate =
  | QuestionCreateMCQ
  | QuestionCreateTrueFalse
  | QuestionCreateShortAnswer;

export type TestCreatePayload = {
  title: string;
  description?: string;
  passingScore: number; // percentage 0-100
  totalMarks?: number;
  timeLimit?: number; // minutes
  questions: QuestionCreate[];
};
