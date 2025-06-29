'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';

export enum FormType {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

export default function AuthFormSwitcher() {
  const [formType, setFormType] = useState<FormType>(FormType.LOGIN);

  const handleSwitchForm = (formType: FormType) => {
    setFormType(formType);
  };

  return (
    <AnimatePresence mode="wait">
      {formType === FormType.LOGIN ? (
        <LoginForm handleSwitchForm={handleSwitchForm} />
      ) : (
        <SignupForm handleSwitchForm={handleSwitchForm} />
      )}
    </AnimatePresence>
  );
}
