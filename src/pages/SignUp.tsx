import { SignUp as ClerkSignUp } from '@clerk/clerk-react'

export function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ClerkSignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  )
}
