
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { z } from "zod";
import PasswordStrength from "../validation/PasswordStrength";
import { changePasswordSchema } from "@/schema/auth.schema";
import CustomIconInput from "../form/CustomIconInput";
import { Lock } from "lucide-react";
import FormButton from "../form/FormButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { SetChangePasswordError } from "@/redux/features/auth/authSlice";
import ErrorAlert from "../validation/ErrorAlert";
import { useTranslation } from "react-i18next";

type TFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const { ChangePasswordError } = useAppSelector((state) => state.auth)
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { t } = useTranslation("common");
  const { handleSubmit, control, watch, trigger } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch("newPassword");
  const currentPassword = watch("oldPassword");

  useEffect(() => {
    const confirmPassword = watch("confirmPassword");
    if (newPassword?.length >=6 && confirmPassword?.length >=6) {
      trigger("confirmPassword");
    }
    if (currentPassword?.length >= 6 && newPassword?.length >= 6) {
      trigger("newPassword");
    }
  }, [newPassword, currentPassword, trigger, watch]);

 
  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    dispatch(SetChangePasswordError(""));
    changePassword({
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword
    })
  }


  return (
    <>
      {ChangePasswordError && <ErrorAlert message={ChangePasswordError} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <CustomIconInput
          label={t("common:changePassword.form.current.label")}
          name="oldPassword"
          type="password"
          control={control}
          placeholder={t("common:changePassword.form.current.placeholder")}
          icon={Lock}
        />
        <CustomIconInput
          label={t("common:changePassword.form.new.label")}
          name="newPassword"
          type="password"
          control={control}
          placeholder={t("common:changePassword.form.new.placeholder")}
          icon={Lock}
        />
        {newPassword && <PasswordStrength password={newPassword} />}
        <CustomIconInput
          label={t("common:changePassword.form.confirm.label")}
          name="confirmPassword"
          type="password"
          control={control}
          placeholder={t("common:changePassword.form.confirm.placeholder")}
          icon={Lock}
        />
        <FormButton isLoading={isLoading} loadingTitle={t("common:changePassword.form.loading")}>
          {t("common:changePassword.form.submit")}
        </FormButton>
      </form>
    </>
  );
};

export default ChangePasswordForm;
