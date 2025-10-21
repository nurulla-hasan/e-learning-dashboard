import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import CustomQuilEditor from "../form/CustomQuilEditor";
import { policySchema } from "@/schema/policy.schema";
import FormButton from "../form/FormButton";
import { useUpdatePrivacyPolicyMutation } from "@/redux/features/policy/policyApi";

type TFormValues = z.infer<typeof policySchema>;

type TProps = {
  id: string;
  content: string;
}

const UpdatePrivacyForm = ({id, content }: TProps) => {
   const [updatePrivacyPolicy, { isLoading }] = useUpdatePrivacyPolicyMutation();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      content
    }
  });


  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    updatePrivacyPolicy({
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
          height={500}
          placeholder="Write here..."
        />
        <FormButton isLoading={isLoading}>Save Change</FormButton>
      </form>
    </>
  );
};

export default UpdatePrivacyForm;
