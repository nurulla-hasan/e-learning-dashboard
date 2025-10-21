import VerifyOtpForm from "@/components/auth/VerifyOtpForm"
import { Card, CardContent } from "@/components/ui/card"
import { getEmail } from "@/helper/SessionHelper"

const VerifyotpPage = () => {
  const handleResend = () => {
    console.log("Resending verification code...")
    // Handle resend logic here
  }

  return (
    <>
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Check your email</h1>

          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            We sent a code to your email address <span className="font-semibold">{getEmail()}</span> Please check your email for the 6 digit code.
          </p>
          <VerifyOtpForm />
          <p className="text-sm text-gray-600 mt-4">
            You have not received the email?{" "}
            <button
              onClick={handleResend}
              className="text-sky-500 cursor-pointer hover:text-sky-600 underline font-medium transition-colors"
            >
              Resend
            </button>
          </p>
        </CardContent>
      </Card>
    </>
  )
}

export default VerifyotpPage;