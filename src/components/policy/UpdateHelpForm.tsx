import { useForm, type SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import CustomQuilEditor from "../form/CustomQuilEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { policySchema } from "@/schema/policy.schema";
import { useUpdateHelpCenterMutation } from "@/redux/features/policy/policyApi";
import FormButton from "../form/FormButton";

type TFormValues = z.infer<typeof policySchema>;

type TProps = {
  id: string;
  content: string;
}

const UpdateHelpForm = ( {id, content } : TProps) => {
  const [updateHelpCenter, { isLoading }] = useUpdateHelpCenterMutation();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      content
    }
  });


  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    updateHelpCenter({
      id,
      data
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomQuilEditor
          label="Description"
          name="content"
          control={control}
          height={550}
          placeholder="Write a description..."
        />
        <FormButton isLoading={isLoading}>Save Change</FormButton>
      </form>   
    </>
  );
};

export default UpdateHelpForm;
