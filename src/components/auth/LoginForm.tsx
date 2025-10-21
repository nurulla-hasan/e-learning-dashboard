import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/schema/auth.schema"
import FormButton from "../form/FormButton"
import CustomIconInput from "../form/CustomIconInput"
import type { TLoginFormValues } from "@/types/auth.type"
import { useLoginMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks"
import { SetLoginError } from "@/redux/features/auth/authSlice"
import ErrorAlert from "../validation/ErrorAlert"



const LoginForm = () => {
    const dispatch = useAppDispatch();
    const { LoginError } = useAppSelector((state)=>state.auth)
    const [login, { isLoading }] = useLoginMutation();
    const { handleSubmit, control } = useForm({
        resolver: zodResolver(loginSchema)
    });


    const onSubmit: SubmitHandler<TLoginFormValues> = (data) => {
        dispatch(SetLoginError(""))
        login(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                <CardContent className="space-y-4 py-4">
                    {LoginError && <ErrorAlert message={LoginError} />}
                    <CustomIconInput control={control} name="email" label="Email Address" placeholder="Enter your email" icon={Mail}/>
                    <CustomIconInput control={control} name="password" type="password" label="Password" placeholder="Enter your password" icon={Lock}/>
                    <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center space-x-2">
                            <input
                                id="remember"
                                type="checkbox"
                                className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                            />
                            <Label htmlFor="remember" className="text-sm text-muted-foreground">
                                Remember me
                            </Label>
                        </div>
                        <Link
                            to="/auth/forgot-password"
                            className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer transition-colors font-medium duration-200"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                   <FormButton isLoading={isLoading}>Sign In</FormButton>
                </CardFooter>
            </form>
        </>
    )
}


export default LoginForm;