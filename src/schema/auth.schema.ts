import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long")
    .trim(),
});

export const forgotPasswordSendOtpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "New Password is required" })
      .min(1, "New Password is required")
      .min(6, "New Password must be at least 6 characters long")
      .max(100, "New Password is too long")
      .trim(),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(1, "Confirm Password is required")
      .min(6, "Confirm Password must be at least 6 characters long")
      .max(100, "Confirm Password is too long")
      .trim(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: "Current Password is required" })
      .trim()
      .min(1, "Current Password is required")
      .min(6, "Current Password must be at least 6 characters long")
      .max(100, "Current Password is too long"),
    newPassword: z
      .string({ required_error: "New Password is required" })
      .trim()
      .min(1, "New Password is required")
      .min(6, "New Password must be at least 6 characters long")
      .max(100, "New Password is too long"),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .trim()
      .min(1, "Confirm Password is required")
      .min(6, "Confirm Password must be at least 6 characters long")
      .max(100, "Confirm Password is too long"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.newPassword === data.oldPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "New password must be different from the current password.",
        code: z.ZodIssueCode.custom,
      });
    }
  });