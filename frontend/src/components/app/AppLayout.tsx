import React from 'react';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (!pathname.includes('app')) return <>{children}</>;

  return (
    <div className="w-full h-screen flex flex-col ">
      <div className="w-full h-[75px]">
        {' '}
        <Navbar />
      </div>

      <div className=" w-full h-full">{children}</div>
    </div>
  );
};

export default AppLayout;
