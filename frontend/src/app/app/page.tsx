'use client';

import { PlaceholdersAndVanishInput } from '@/components/landing-page/vanish-input';
import React from 'react';

const AppPage = () => {
  const placeholders = [
    'Find me the best hotels in Paris for March 2024',
    "What's the weather like in Tokyo in April?",
    'Top attractions to visit in New York City',
    'Flight deals from Madrid to Rome in July',
    'Best time to visit the Great Wall of China',
    'Cultural festivals in India during November',
    'Affordable hostels in Barcelona',
    'Must-try foods in Bangkok',
    'Visa requirements for traveling to Australia',
    'How to get around in Amsterdam',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
  };

  return (
    <div className="h-screen bg-linear-115 from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff]">
      <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
          Ask Aceternity UI Anything
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AppPage;
