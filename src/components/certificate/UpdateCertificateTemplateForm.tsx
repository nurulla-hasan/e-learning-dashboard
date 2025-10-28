import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import CustomQuilEditor from "../form/CustomQuilEditor";
import { certificateTemplateSchema } from "@/schema/certificate.template.schema";
import { useUpdateCertificateContentMutation, useGetSingleCertificateQuery } from "@/redux/features/certificate/certificateApi";
import FormButton from "../form/FormButton";
import { useEffect } from "react";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";

const FIXED_PLACEHOLDERS = [
  "{{fullName}}",
  "{{dob}}",
  "{{startDate}}",
  "{{endDate}}",
  "{{certificateNumber}}",
] as const;

type TFormValues = z.infer<typeof certificateTemplateSchema>;
type TProps = {
  id: string;
  content?: string;
  title?: string;
}

const UpdateCertificateTemplateForm = ({ id, content = "", title = "" }: TProps) => {
  const [updateCertificate, { isLoading: updateLoading }] = useUpdateCertificateContentMutation();
  const { data: certificateData } = useGetSingleCertificateQuery(id, { skip: !id });

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    resolver: zodResolver(certificateTemplateSchema),
    defaultValues: {
      htmlContent: content,
      title,
      placeholders: [],
    }
  });

  // Extract placeholders from HTML content
  const extractPlaceholders = (html: string): string[] => {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = html.match(placeholderRegex);
    return matches ? [...new Set(matches)] : [];
  };

  useEffect(() => {
    if (certificateData?.data) {
      reset({
        htmlContent: certificateData.data.htmlContent || "",
        title: certificateData.data.title || "",
        placeholders: certificateData.data.placeholders || [],
      });
    }
  }, [certificateData, reset]);

  const watchedContent = watch("htmlContent");
  const placeholders = watchedContent ? extractPlaceholders(watchedContent) : [];

  const onSubmit: SubmitHandler<TFormValues> = async (data) => {
    const submitData = {
      title: data.title,
      htmlContent: data.htmlContent,
      placeholders: placeholders,
    };

    try{
      await updateCertificate({
      id,
      data: submitData
    }).unwrap();
    SuccessToast("Certificate template updated successfully");
    }catch(error){
      ErrorToast("Failed to update certificate template");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Title
          </label>
          <input
            type="text"
            id="title"
            {...control.register("title")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Enter certificate title"
          />
        </div>

        {/* Display extracted placeholders */}
        {/* {placeholders.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extracted Placeholders
            </label>
            <div className="flex flex-wrap gap-2">
              {placeholders.map((placeholder, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                >
                  {placeholder}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              These placeholders will be automatically replaced when generating certificates
            </p>
          </div>
        )} */}

        {/* Drag-and-drop placeholders into the editor or click to insert */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placeholders (drag into editor or click to insert)
          </label>
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
                  const current = (watch('htmlContent') as string) || '';
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

        <CustomQuilEditor
          label="Certificate Template Content"
          name="htmlContent"
          control={control}
          height={550}
          placeholder="Design your certificate template here... Use {{placeholderName}} for dynamic content"
        />

        <FormButton isLoading={updateLoading}>
          Update Certificate
        </FormButton>
      </form>
    </>
  );
};

export default UpdateCertificateTemplateForm;
