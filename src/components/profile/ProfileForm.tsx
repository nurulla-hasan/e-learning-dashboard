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
import { useTranslation } from "react-i18next";

type TProps = {
  file: File | null;
}

type ProfileUser = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  vatId?: string;
};

const ProfileForm = ({ file }: TProps) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const { t } = useTranslation("common");

  const user = useSelector((state: RootState) => state.user.user);
  const profileUser: ProfileUser = (user ?? {}) as ProfileUser;

  const form = useForm<z.infer<typeof updateAdminSchema>>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      fullName: profileUser.fullName ?? "",
      email: profileUser.email ?? "",
      phone: profileUser.phoneNumber ?? "",
      address: profileUser.address ?? "",
      vatId: profileUser.vatId ?? "",
    },
  });
  const { handleSubmit, control, reset } = form;


  const onSubmit: SubmitHandler<z.infer<typeof updateAdminSchema>> = async (data) => {
    // Update basic profile fields as JSON
    await updateProfile({
      fullName: data.fullName,
      phoneNumber: data.phone ?? "",
      address: data.address ?? "",
      vatId: data.vatId ?? "",
    });

    // If a file is selected, upload profile image separately with field name 'profileImage'
    if (file) {
      const fd = new FormData();
      fd.append("profileImage", file);
      await updateProfileImage(fd);
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        fullName: profileUser.fullName ?? "",
        email: profileUser.email ?? "",
        phone: profileUser.phoneNumber ?? "",
        address: profileUser.address ?? "",
        vatId: profileUser.vatId ?? "",
      });
    }
  }, [user, reset, profileUser.address, profileUser.email, profileUser.fullName, profileUser.phoneNumber, profileUser.vatId]);


  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-5">
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("common:profile.form.fullName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("common:profile.form.fullName.placeholder")}
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
                    {t("common:profile.form.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("common:profile.form.email.placeholder")}
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
                    {t("common:profile.form.phone.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("common:profile.form.phone.placeholder")}
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("common:profile.form.address.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("common:profile.form.address.placeholder")}
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
              name="vatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("common:profile.form.vat.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("common:profile.form.vat.placeholder")}
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
                  <span>{t("common:profile.form.saving")}</span>
                </>
              ) : (
                t("common:profile.form.submit")
              )}
            </button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
