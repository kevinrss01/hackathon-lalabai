'use client';

import { Button } from '@/components/landing-page/button';
import { Link } from '@/components/landing-page/link';
import { Mark } from '@/components/landing-page/logo';
import { Checkbox, Field, Input, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { FormType } from '@/components/auth/AuthFormSwitcher';

interface LoginFormProps {
  handleSwitchForm: (formType: FormType) => void;
}

const LoginForm = ({ handleSwitchForm }: LoginFormProps) => {
  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <form action="#" method="POST" className="p-7 sm:p-11">
        <div className="flex items-start">
          <Link href="/" title="Home">
            <Mark className="h-9 fill-black" />
          </Link>
        </div>
        <h1 className="mt-8 text-base/6 font-medium">Welcome back!</h1>
        <p className="mt-1 text-sm/5 text-gray-600">Sign in to your account to continue.</p>
        <Field className="mt-8 space-y-3">
          <Label className="text-sm/5 font-medium">Email</Label>
          <Input
            required
            autoFocus
            type="email"
            name="email"
            className={clsx(
              'px-2 py-1.5 text-base/6 sm:text-sm/6',
              'rounded-lg shadow-sm ring-1 ring-gray-950/10',
              'data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black'
            )}
          />
        </Field>
        <Field className="mt-8 space-y-3">
          <Label className="text-sm/5 font-medium">Password</Label>
          <Input
            required
            type="password"
            name="password"
            className={clsx(
              'px-2 py-1.5 text-base/6 sm:text-sm/6',
              'rounded-lg shadow-sm ring-1 ring-gray-950/10',
              'data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black'
            )}
          />
        </Field>
        <div className="mt-8 flex items-center justify-between text-sm/5">
          <Field className="flex items-center gap-3">
            <Checkbox
              name="remember-me"
              className={clsx(
                'group block size-4 rounded-sm border border-transparent shadow-sm ring-1 ring-black/10',
                'data-checked:bg-black data-checked:ring-black',
                'data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black'
              )}
            >
              <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
            </Checkbox>
            <Label>Remember me</Label>
          </Field>
          <Link href="#" className="font-medium hover:text-gray-600">
            Forgot password?
          </Link>
        </div>
        <div className="mt-8">
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>
      <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
        Not a member?{' '}
        <button
          onClick={() => handleSwitchForm(FormType.SIGNUP)}
          className="font-medium hover:text-gray-600 cursor-pointer"
        >
          Create an account
        </button>
      </div>
    </motion.div>
  );
};

export default LoginForm;
