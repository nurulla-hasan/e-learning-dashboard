"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { TProfile } from "../../types/user.type";
import { updateAdminSchema } from "@/schema/admin.schema";
import CustomIconInput from "../form/CustomIconInput";
import { Mail, PhoneCall, User } from "lucide-react";
import FormButton from "../form/FormButton";


type TProps = {
  file: File | null;
  user: TProfile | null;
}

const ProfileForm = ({ user, file }: TProps) => {
  const isLoading = false;
  //const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || ""
    }
  });


  const onSubmit: SubmitHandler<z.infer<typeof updateAdminSchema>> = (data) => {
    //changePassword(data);
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);

    if (file !== null) {
      formData.append("file", file);
    }
    //updateProfile(formData)
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomIconInput
          label="Name"
          name="fullName"
          type="text"
          control={control}
          placeholder="Enter full name"
          icon={User}
        />
        <CustomIconInput control={control} name="email" label="Email Address" placeholder="Enter your email" icon={Mail} disabled/>
        <CustomIconInput
          label="Phone Number"
          name="phone"
          type="text"
          control={control}
          placeholder="e.g., +44 20 1234 5678 or 020 1234 5678"
          icon={PhoneCall}
        />
       <FormButton isLoading={isLoading}>Save Changes</FormButton>
      </form>
    </>
  );
};

export default ProfileForm;
