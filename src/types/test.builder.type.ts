export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface TOption {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface TAnswer {
  text: string;
  isCorrect: boolean;
}

export interface TQuestionBase {
  title: string;
  description?: string;
  type: QuestionType;
  marks: number;
  explanation?: string;
  order: number;
}

export interface TQuestionMCQ extends TQuestionBase {
  type: "MCQ";
  options: TOption[];
}

export interface TQuestionTrueFalse extends TQuestionBase {
  type: "TRUE_FALSE";
  options: TOption[]; // exactly two
}

export interface TQuestionShortAnswer extends TQuestionBase {
  type: "SHORT_ANSWER";
  answers: TAnswer[];
}

export type TQuestion = TQuestionMCQ | TQuestionTrueFalse | TQuestionShortAnswer;

export interface TTestFormValues {
  title: string;
  description?: string;
  passingScore: number; // percentage 1-100
  totalMarks?: number;
  timeLimit?: number; // minutes
  questions: TQuestion[];
}
