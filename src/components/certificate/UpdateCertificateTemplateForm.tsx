import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import CustomQuilEditor from "../form/CustomQuilEditor";
import { certificateTemplateSchema } from "@/schema/certificate.template.schema";
import { useUpdateCertificateMutation, useCreateCertificateMutation, useGetSingleCertificateQuery } from "@/redux/features/certificate/certificateApi";
import FormButton from "../form/FormButton";
import { useEffect } from "react";

type TFormValues = z.infer<typeof certificateTemplateSchema>;
type TProps = {
  id?: string;
  content?: string;
  title?: string;
  description?: string;
}

const UpdateCertificateTemplateForm = ({ id, content = "", title = "", description = "" }: TProps) => {
  const [updateCertificate, { isLoading: updateLoading }] = useUpdateCertificateMutation();
  const [createCertificate, { isLoading: createLoading }] = useCreateCertificateMutation();
  const { data: certificateData } = useGetSingleCertificateQuery(id || "", { skip: !id });

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(certificateTemplateSchema),
    defaultValues: {
      content,
      title,
      description,
    }
  });

  useEffect(() => {
    if (certificateData?.data) {
      reset({
        content: certificateData.data.content || "",
        title: certificateData.data.title || "",
        description: certificateData.data.description || "",
      });
    }
  }, [certificateData, reset]);

  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    if (id) {
      updateCertificate({
        id,
        data
      });
    } else {
      createCertificate(data);
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            {...control.register("description")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Enter certificate description"
          />
        </div>

        <CustomQuilEditor
          label="Certificate Template Content"
          name="content"
          control={control}
          height={550}
          placeholder="Design your certificate template here..."
        />

        <FormButton isLoading={updateLoading || createLoading}>
          {id ? "Update Certificate" : "Create Certificate"}
        </FormButton>
      </form>
    </>
  );
};

export default UpdateCertificateTemplateForm;
