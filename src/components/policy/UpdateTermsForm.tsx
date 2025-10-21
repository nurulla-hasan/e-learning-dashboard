import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import CustomQuilEditor from "../form/CustomQuilEditor";
import { policySchema } from "@/schema/policy.schema";
import { useUpdateTermsConditionMutation } from "@/redux/features/policy/policyApi";
import FormButton from "../form/FormButton";

type TFormValues = z.infer<typeof policySchema>;
type TProps = {
  id: string;
  content: string;
}

const UpdateTermsForm = ( {id, content } : TProps ) => {
  const [updateTermsCondition, { isLoading }] = useUpdateTermsConditionMutation();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      content
    }
  });


  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    updateTermsCondition({
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
          placeholder="Write here..."
        />
        <FormButton isLoading={isLoading}>Save Change</FormButton>
      </form>
    </>
  );
};

export default UpdateTermsForm;
