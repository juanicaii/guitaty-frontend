import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export default function SignIn() {
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
          <p className="text-white/80">Tu gestor de finanzas personales</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-2">
          <ClerkSignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none',
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </motion.div>
    </div>
  )
}
