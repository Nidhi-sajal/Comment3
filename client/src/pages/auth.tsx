import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Auth() {
  const { isSignedIn, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLocation('/dashboard');
    }
  }, [isSignedIn, isLoaded, setLocation]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome to SocialAI</h1>
          <p className="text-text-secondary">
            {isSignUpMode ? 'Create your account to get started' : 'Sign in to manage your social media automation'}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {!isSignUpMode ? (
            <SignIn 
              afterSignInUrl="/dashboard"
              signUpUrl="#"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  card: 'shadow-none',
                }
              }}
            />
          ) : (
            <SignUp 
              afterSignUpUrl="/dashboard"
              signInUrl="#"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  card: 'shadow-none',
                }
              }}
            />
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            {!isSignUpMode ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsSignUpMode(true)} 
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsSignUpMode(false)} 
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
