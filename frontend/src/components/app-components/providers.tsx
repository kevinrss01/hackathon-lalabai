'use client';

import { HeroUIProvider } from '@heroui/react';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <Toaster richColors />
      {children}
    </HeroUIProvider>
  );
};
