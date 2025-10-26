import { z } from "zod";

export const courseSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required"),
  courseShortDescription: z.string().min(1, "Short description is required"),
  courseDescription: z.string().min(1, "Course description is required"),
  courseLevel: z
    .string()
    .refine((v) => v && v !== "Select Level", { message: "Select a level" }),
  categoryId: z
    .string()
    .refine((v) => v && v !== "Select Category", { message: "Select a category" }),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  discountPrice: z.coerce
    .number()
    .min(0, "Discount cannot be negative"),
  vatPercentage: z.coerce.number().min(0, "VAT cannot be negative").max(100, "VAT cannot exceed 100%").optional(),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Select a skill level",
  }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Select a difficulty",
  }),
  instructorName: z.string().min(1, "Instructor name is required"),
  instructorDesignation: z.string().min(1, "Designation is required"),
  instructorDescription: z.string().min(1, "Instructor description is required"),
}).superRefine((data, ctx) => {
  // Validate that discount price is not greater than course fee (numeric compare)
  const price = Number(data.price ?? 0);
  const discount = Number(data.discountPrice ?? 0);
  if (discount > price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Discount price ($${discount}) cannot be greater than course fee ($${price})`,
      path: ["discountPrice"],
    });
  }
});

export type TCourseFormValues = z.infer<typeof courseSchema>;
