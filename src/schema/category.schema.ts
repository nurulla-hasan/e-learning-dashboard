/* eslint-disable no-useless-escape */
import { z } from "zod";


export const categorySchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be string",
      required_error: "Name is required",
    })
    .min(1, "Name is required")
    .trim()
    .regex(/^[^0-9]*$/, {
      message: "Name cannot contain numbers",
    })
    .regex(/^[^~!@#$%\^*\+\?><=;:"]*$/, {
      message: 'Name cannot contain special characters: ~ ! @ # $ % ^ * + ? > < = ; : "',
    }),
});



