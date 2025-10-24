export interface Test {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  totalMarks: number;
  timeLimit: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  sectionId: string | null;
  sectionTitle: string | null;
  courseId: string;
  courseTitle: string;
  courseLevel: string;
  categoryName: string;
  totalQuestions: number;
  totalAttempts: number;
  questionTypes: string[];
}

export interface TestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Test[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}