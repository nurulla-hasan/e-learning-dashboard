import LoginForm from "@/components/auth/LoginForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const LoginPage = () =>{
  return (
    <>
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full shadow-lg border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Login to account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          {/* Login Form */}
          <LoginForm/>
        </Card>
      </div>
    </>
  )
}

export default LoginPage;
