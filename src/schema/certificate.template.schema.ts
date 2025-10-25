import { z } from "zod";

export const certificateTemplateSchema = z.object({
  content: z.string().min(1, "Certificate content is required"),
  title: z.string().min(1, "Certificate title is required"),
  description: z.string().optional(),
});

export type TCertificateTemplateFormValues = z.infer<typeof certificateTemplateSchema>;
