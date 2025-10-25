export interface Certificate {
  id: string;
  certificateId: string;
  issueDate: string;
  createdAt: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  userImage: string;
  courseId: string;
  courseTitle: string;
  courseShortDescription: string;
  courseLevel: string;
  instructorName: string;
  courseThumbnail: string;
  categoryName: string;
  certificateTitle: string;
  placeholders: string[];
  mainContents: {
    fullName: string;
    dob: string;
    startDate: string;
    endDate: string;
    certificateNumber: string;
  };
}
