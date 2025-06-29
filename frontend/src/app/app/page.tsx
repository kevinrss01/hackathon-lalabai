'use client';

import { ContainerTextFlip } from '@/components/ui/containerTextFlip';
import Navbar from '@/components/app/Navbar';
import React from 'react';
import { motion } from 'framer-motion';
import ChatInputMic from '@/components/app/ChatInputMic';

const AppPage = () => {
  const placeholders = React.useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <motion.div
          className="flex items-center gap-2 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-2xl md:text-4xl font-bold text-black">What do you want to</span>
          <div className="min-w-20 w-20">
            <ContainerTextFlip
              words={['see', 'eat', 'buy']}
              images={['/images/plane.png', '/images/food.png', '/images/shopping.png']}
            />
          </div>
          <span className="text-2xl md:text-4xl font-bold text-black ml-[65px]">?</span>
        </motion.div>

        <motion.div
          className="w-full flex items-center justify-center max-w-3xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <ChatInputMic placeholders={placeholders} />
        </motion.div>
      </div>
    </div>
  );
};

export default AppPage;
