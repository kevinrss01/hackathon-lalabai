'use client';
import { GradientBackground } from '@/components/landing-page/gradient';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

export enum FormType {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

export default function LoginPage() {
  const [formType, setFormType] = useState<FormType>(FormType.LOGIN);

  const handleSwitchForm = (formType: FormType) => {
    setFormType(formType);
  };

  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
          <AnimatePresence mode="wait">
            {formType === FormType.LOGIN ? (
              <LoginForm handleSwitchForm={handleSwitchForm} />
            ) : (
              <SignupForm handleSwitchForm={handleSwitchForm} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
