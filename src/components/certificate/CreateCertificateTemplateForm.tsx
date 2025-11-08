/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomQuilEditor from "../form/CustomQuilEditor";
import { certificateTemplateSchema } from "@/schema/certificate.template.schema";
import { useCreateCertificateContentMutation, useGetCourseForCreateCertificateQuery } from "@/redux/features/certificate/certificateApi";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SuccessToast } from "@/helper/ValidationHelper";

const FIXED_PLACEHOLDERS = [
  "{{fullName}}",
  "{{dob}}",
  "{{startDate}}",
  "{{endDate}}",
  "{{certificateNumber}}",
] as const;

// Extend create form with courseId
const createSchema = certificateTemplateSchema.extend({
  courseId: z.string().min(1, "Course is required"),
  placeholders: z.array(z.enum(FIXED_PLACEHOLDERS)).default([...FIXED_PLACEHOLDERS]),
});

type TFormValues = z.input<typeof createSchema>;

const CreateCertificateTemplateForm = () => {
  const [createCertificate, { isLoading }] = useCreateCertificateContentMutation();
  const { data: coursesRes } = useGetCourseForCreateCertificateQuery({} as any);

  const courses: Array<{ id: string; title: string }> = useMemo(() => {
    const items = (coursesRes as any)?.data || [];
    return Array.isArray(items)
      ? items.map((c: any) => ({ id: c.id, title: c.courseTitle || "Untitled" }))
      : [];
  }, [coursesRes]);

  const { handleSubmit, control, watch, setError, setValue } = useForm<TFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      courseId: "",
      title: "",
      htmlContent: "",
      placeholders: [...FIXED_PLACEHOLDERS],
    },
  });

  const extractPlaceholders = (html: string): string[] => {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = html.match(placeholderRegex);
    return matches ? [...new Set(matches)] : [];
  };

  const watchedContent = watch("htmlContent");
  const extracted = watchedContent ? extractPlaceholders(watchedContent) : [];

  const onSubmit: SubmitHandler<TFormValues> = async (data) => {
    const invalidFromHtml = extracted.filter((ph) => !(FIXED_PLACEHOLDERS as readonly string[]).includes(ph));
    if (invalidFromHtml.length > 0) {
      setError("htmlContent" as any, {
        type: "validate",
        message: `Only these placeholders are allowed: ${(
          FIXED_PLACEHOLDERS as readonly string[]
        ).join(", ")}. Found invalid: ${invalidFromHtml.join(", ")}`,
      });
      return;
    }
    const payload = {
      courseId: data.courseId,
      title: data.title,
      htmlContent: data.htmlContent,
      placeholders: data.placeholders,
    } as any;

    await createCertificate(payload as any).unwrap();
    SuccessToast("Certificate template created successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Course */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
        <Controller
          name="courseId"
          control={control as any}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
        <Controller
          name="title"
          control={control as any}
          render={({ field }) => (
            <Input placeholder="Enter title" {...field} />
          )}
        />
      </div>

      {/* Drag-and-drop placeholders into the editor or click to insert */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Placeholders (drag into editor or click to insert)</label>
        <div className="flex flex-wrap gap-2">
          {FIXED_PLACEHOLDERS.map((ph) => (
            <button
              key={ph}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', ph);
              }}
              onClick={() => {
                const current = watch('htmlContent') || '';
                const next = current + (current.endsWith(' ') ? '' : ' ') + ph + ' ';
                setValue('htmlContent' as any, next);
              }}
              className="px-3 py-1 text-sm rounded-full border bg-gray-50 hover:bg-gray-100"
              title="Drag into the editor or click to insert"
            >
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <CustomQuilEditor
        label="Certificate Template Content"
        name="htmlContent"
        control={control as any}
        height={550}
        placeholder="Design here... Use {{placeholderName}} for dynamic content"
      />

      {/* Extracted placeholders from HTML (read-only, informative) */}
      {extracted.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detected in HTML</label>
          <div className="flex flex-wrap gap-2">
            {extracted.map((ph, i) => (
              <span key={i} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full border">{ph}</span>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
        {isLoading ? "Creating..." : "Create Template"}
      </Button>
    </form>
  );
};

export default CreateCertificateTemplateForm;
