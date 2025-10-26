import { z } from "zod";

export const certificateTemplateSchema = z.object({
  htmlContent: z.string().min(1, "Certificate content is required"),
  title: z.string().min(1, "Certificate title is required"),
  placeholders: z.array(z.string()).optional(),
});

export type TCertificateTemplateFormValues = z.infer<typeof certificateTemplateSchema>;
