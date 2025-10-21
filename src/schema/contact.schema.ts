import { z } from "zod";


export const replySchema = z.object({
  replyText: z
    .string({
      invalid_type_error: "message must be string",
      required_error: "Write a reply message",
    })
    .min(1, "Write a reply message"),
});
