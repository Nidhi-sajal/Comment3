import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Auth() {
  const { isSignedIn } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isSignedIn) {
      setLocation('/dashboard');
    }
  }, [isSignedIn, setLocation]);

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome to SocialAI</h1>
          <p className="text-text-secondary">Sign in to manage your social media automation</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <SignIn 
            routing="path" 
            path="/auth"
            signUpUrl="/auth/sign-up"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                card: 'shadow-none',
              }
            }}
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <a href="/auth/sign-up" className="text-primary hover:text-primary/90 font-medium">
              Sign up here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
