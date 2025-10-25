export interface TTestAttempt {
  id?: string;
  userId?: string;
  testId?: string;
  score?: number;
  percentage?: number;
  isPassed?: boolean;
  totalMarks?: number;
  timeSpent?: number;
  status?: string; // e.g., "GRADED"
  completedAt?: string;
  createdAt?: string;

  userFullName?: string;
  userEmail?: string;
  userImage?: string;

  testTitle?: string;
  testTotalMarks?: number;
  testPassingScore?: number;

  sectionId?: string | null;
  sectionTitle?: string;

  courseId?: string;
  courseTitle?: string;
  courseLevel?: string; // e.g., "Beginner"

  categoryName?: string;

  totalResponses?: number;
  correctResponses?: number;
  incorrectResponses?: number;
  pendingResponses?: number;
}
