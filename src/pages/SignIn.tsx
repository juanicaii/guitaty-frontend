import { SignIn as ClerkSignIn } from '@clerk/clerk-react'

export function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ClerkSignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  )
}
