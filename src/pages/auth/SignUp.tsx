import { SignUp as ClerkSignUp } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ios-blue to-blue-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Guitaty</h1>
          <p className="text-white/80">Comienza a gestionar tus finanzas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-2">
          <ClerkSignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none',
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>
      </motion.div>
    </div>
  )
}
