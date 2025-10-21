import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import CustomButton from "../form/CustomButton";
import { useForgotPasswordVerifyOtpMutation } from "@/redux/features/auth/authApi";
import { getEmail, getOtpToken } from "@/helper/SessionHelper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { SetVerifyOtpError } from "@/redux/features/auth/authSlice";
import ErrorAlert from "../validation/ErrorAlert";

const VerifyOtpForm = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isDisabled = code.find((cv) => cv == "") == "";
    const { VerifyOtpError } = useAppSelector((state)=>state.auth)
    const [forgotPassVerifyOtp, {isLoading, isSuccess}] = useForgotPasswordVerifyOtpMutation()


    useEffect(() => {
        if (!isLoading && isSuccess) {
            navigate("/auth/reset-password")
        }
    }, [isLoading, isSuccess, navigate])


    const handleInputChange = (index: number, value: string) => {
        const digit = value.replace(/[^0-9]/g, "")

        if (digit.length > 1) return

        const newCode = [...code]
        newCode[index] = digit
        setCode(newCode)

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = () => {
        dispatch(SetVerifyOtpError(""))
        const otpCode = code.join("")
        if (otpCode.length === 6) {
            forgotPassVerifyOtp({
                email: getEmail(),
                otp: Number(otpCode),
                otpToken: getOtpToken(),
            })
        }
    }

   

    return (
        <>
            {VerifyOtpError && <ErrorAlert message={VerifyOtpError} />}
            <div className="flex justify-center gap-3 mb-8 mt-3">
                {code?.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder=""
                    />
                ))}
            </div>
            <CustomButton isLoading={isLoading} onClick={handleVerify} loadingTitle="Verifying..." disabled={isLoading || isDisabled }>Verify</CustomButton>
        </>
    )
}

export default VerifyOtpForm