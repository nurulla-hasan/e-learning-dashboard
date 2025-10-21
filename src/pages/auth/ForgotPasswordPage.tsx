import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ForgotPasswordPage = () =>{
  return (
    <>
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full shadow-lg border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your email address and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          {/* Forgot Password Form */}
          <ForgotPasswordForm />
        </Card>
      </div>
    </>
  )
}

export default ForgotPasswordPage;
