'use client';

import { HeroUIProvider } from '@heroui/react';
import { Toaster } from 'sonner';
import AppLayout from './AppLayout';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <Toaster richColors />

      <AppLayout>{children}</AppLayout>
    </HeroUIProvider>
  );
};
