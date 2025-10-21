import { z } from "zod";
export const fullNameRegex = /^[A-Za-z\s'.-]+$/; //only contain letters, spaces, apostrophes, hyphens, and dots
export const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:1\d{8,9}|2\d{9}|3\d{9}|7\d{9}|8\d{9}|9\d{8}))$/

export const adminSchema = z
  .object({
    fullName: z
      .string({
        invalid_type_error: "Name must be string",
        required_error: "Name is required",
      })
      .min(1, "Name is required")
      .trim()
      .regex(fullNameRegex, {
        message:
          "Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
      }),
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z
      .string({
        invalid_type_error: "Phone Number must be string",
        required_error: "Phone number is required",
      })
      .min(1, "Phone number is required")
      .trim(),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password is too long")
      .optional()
  })




export const updateAdminSchema = z
  .object({
    fullName: z
      .string({
        invalid_type_error: "Name must be string",
        required_error: "Name is required",
      })
      .min(1, "Name is required")
      .trim()
      .regex(fullNameRegex, {
        message:
          "Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
      }),
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z
      .string({
        invalid_type_error: "Phone Number must be string",
        required_error: "Phone number is required",
      })
      .min(1, "Phone number is required")
  })
