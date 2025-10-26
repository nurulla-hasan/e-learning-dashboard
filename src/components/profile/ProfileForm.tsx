"use client";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { updateAdminSchema } from "@/schema/admin.schema";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useUpdateProfileImageMutation, useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

type TProps = {
  file: File | null;
}

const ProfileForm = ({ file }: TProps) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();

  const user = useSelector((state: RootState) => state.user.user);

  const form = useForm({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: (user as any)?.phoneNumber || "",
    }
  });
  const { handleSubmit, control } = form as any;


  const onSubmit: SubmitHandler<z.infer<typeof updateAdminSchema>> = async (data) => {
    // Update basic profile fields as JSON
    await updateProfile({ fullName: data.fullName, phoneNumber: data.phone } as any);

    // If a file is selected, upload profile image separately with field name 'profileImage'
    if (file) {
      const fd = new FormData();
      fd.append("profileImage", file);
      await updateProfileImage(fd as any);
    }
  };

  useEffect(() => {
    if (user) {
      (form as any).reset({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: (user as any)?.phoneNumber || "",
      });
    }
  }, [user, form]);


  return (
    <>
      <Form {...(form as any)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-5">
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
                      disabled
                      className="h-11 border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
