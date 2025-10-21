import { Lock } from "lucide-react"
import CustomIconInput from "../form/CustomIconInput"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema } from "@/schema/auth.schema"
import type { TResetFormValues } from "@/types/auth.type"
import FormButton from "../form/FormButton"
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks"
import { useForgotPasswordResetMutation } from "@/redux/features/auth/authApi"
import { SetResetPasswordError } from "@/redux/features/auth/authSlice"
import { getEmail } from "@/helper/SessionHelper"
import ErrorAlert from "../validation/ErrorAlert"

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { ResetPasswordError } = useAppSelector((state) => state.auth)
  const [forgotPassReset, { isLoading }] = useForgotPasswordResetMutation()
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });


  const onSubmit: SubmitHandler<TResetFormValues> = (data) => {
    dispatch(SetResetPasswordError(""))
    forgotPassReset({
      email: getEmail(),
      password: data.newPassword
    })
  }

  return (
    <> 
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        {ResetPasswordError && <ErrorAlert message={ResetPasswordError} />}
        <CustomIconInput control={control} name="newPassword" type="password" label="New Password" placeholder="Enter new password" icon={Lock} />
        <CustomIconInput control={control} name="confirmPassword" type="password" label="Confirm New Password" placeholder="Enter confirm password" icon={Lock} />
        <FormButton isLoading={isLoading}>Reset Password</FormButton>
      </form>
    </>
  )
}

export default ResetPasswordForm;