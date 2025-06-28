'use client';
import React from 'react';
import { HomeIcon, Cog6ToothIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { FloatingNav } from './floatingNavbar';
import { Logo } from '../landing-page/logo';

const Navbar = () => {
  const navItems = [
    {
      name: 'Home',
      link: '/',
      icon: <HomeIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: 'Settings',
      link: '/settings',
      icon: <Cog6ToothIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: 'Contact',
      link: '/contact',
      icon: <ChatBubbleLeftIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} logo={<Logo className="h-6" />} />
    </div>
  );
};

export default Navbar;
