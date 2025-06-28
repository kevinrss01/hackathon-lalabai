import * as Headless from '@headlessui/react';
import { clsx } from 'clsx';
import { Link } from './link';

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-2',
    'rounded-lg text-base/6 font-medium',
    'data-[disabled]:opacity-50',
    'data-[hover]:bg-gray-950 data-[hover]:text-white',
    'border border-transparent data-[hover]:border-gray-950'
  ),
  secondary: clsx(
    'relative inline-flex items-center justify-center px-4 py-2',
    'rounded-lg text-base/6 font-medium',
    'border border-gray-300 data-[hover]:border-gray-950',
    'data-[disabled]:opacity-50'
  ),
  outline: clsx(
    'inline-flex items-center justify-center px-2 py-1.5',
    'rounded-lg text-base/6 font-medium',
    'data-[disabled]:opacity-50'
  ),
  ghost: clsx(
    'inline-flex items-center justify-center px-2 py-1.5',
    'rounded-lg text-base/6 font-medium',
    'data-[hover]:bg-gray-950/5',
    'data-[disabled]:opacity-50'
  ),
};

type ButtonProps = {
  variant?: keyof typeof variants;
} & (React.ComponentPropsWithoutRef<typeof Link> | (Headless.ButtonProps & { href?: undefined }));

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  className = clsx(className, variants[variant]);

  if (typeof props.href === 'undefined') {
    return <Headless.Button {...props} className={className} />;
  }

  return <Link {...props} className={className} />;
}
