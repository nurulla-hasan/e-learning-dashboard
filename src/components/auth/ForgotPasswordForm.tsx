import { Button } from "@/components/ui/button"
import { CardContent, CardFooter} from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { TForgotFormValues } from "@/types/auth.type"
import { forgotPasswordSendOtpSchema } from "@/schema/auth.schema"
import CustomIconInput from "../form/CustomIconInput"
import FormButton from "../form/FormButton"
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks"
import { useForgotPasswordSendOtpMutation } from "@/redux/features/auth/authApi"
import { useEffect } from "react"
import { SetForgotError } from "@/redux/features/auth/authSlice"
import ErrorAlert from "../validation/ErrorAlert"

const ForgotPasswordForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { ForgotError } = useAppSelector((state)=>state.auth);
    const [forgotPasswordSendOtp, { isLoading, isSuccess }] = useForgotPasswordSendOtpMutation();
    const { handleSubmit, control } = useForm({
        resolver: zodResolver(forgotPasswordSendOtpSchema)
    });
    
    useEffect(() => {
        if (!isLoading && isSuccess) {
            navigate("/auth/verify-otp")
        }
    }, [isLoading, isSuccess, navigate])

   
    const onSubmit: SubmitHandler<TForgotFormValues> = (data) => {
        dispatch(SetForgotError(""))
        forgotPasswordSendOtp(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {ForgotError && <ErrorAlert message={ForgotError} />}
                    <CustomIconInput control={control} name="email" label="Email Address" placeholder="Enter your email" icon={Mail} />
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 mt-4">
                    <FormButton isLoading={isLoading} loadingTitle="Sending...">Continue</FormButton>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={()=>navigate("/auth/signin")}
                        className="w-full text-muted-foreground bg-transparent hover:bg-transparent hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to login
                    </Button>
                </CardFooter>
            </form>
        </>
    )
}

export default ForgotPasswordForm;