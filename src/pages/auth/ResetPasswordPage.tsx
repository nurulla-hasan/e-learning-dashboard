import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ResetPasswordPage = () => {

  return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center space-y-2 pb-3">
          <CardTitle className="text-2xl font-semibold text-foreground">Set a new password</CardTitle>
          <CardDescription className="text-muted-foreground text-sm leading-relaxed">
            Create a new password. Ensure it differs from previous ones for security
          </CardDescription>
        </CardHeader>
        <ResetPasswordForm />
      </Card>
  )
}

export default ResetPasswordPage;