'use client';

import ChatInputMic from '@/components/app/ChatInputMic';
import { MicrophoneIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

type Message = {
  id: string;
  type: 'text' | 'audio';
  content?: string;
  role: 'assistant' | 'user';
  timestamp: Date;
};

function ChatBubble({ message }: { message: Message }) {
  const user = message.role === 'user';

  return (
    <div className={`flex ${user ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${user ? 'order-2' : 'order-1'}`}>
        <div className={`text-xs text-gray-500 mb-1 ${user ? 'text-right' : 'text-left'}`}>
          {user ? 'You' : 'Assistant'}
        </div>

        <div
          className={`
            px-4 py-3 rounded-2xl max-w-full break-words
            ${
              user
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }
          `}
        >
          {message.type === 'audio' ? (
            <div className="flex items-center gap-2">
              <MicrophoneIcon className={`w-5 h-5 ${user ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-sm" aria-label="Audio message">
                Audio message
              </span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        <div className={`text-xs text-gray-400 mt-1 ${user ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      </div>
    </div>
  );
}

const ChatInterface = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

// fake data
const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'audio',
    content: '',
    role: 'user',
    timestamp: new Date('2025-06-29T14:00:00'), // 2:00 PM
  },
  {
    id: '2',
    type: 'text',
    content: 'I want to travel from Paris to London next week. What are my options?',
    role: 'user',
    timestamp: new Date('2025-06-29T14:01:00'), // 2:01 PM
  },
  {
    id: '3',
    type: 'text',
    content:
      'I can help you find the best travel options from Paris to London! There are several great ways to make this journey:\n\n🚄 **Eurostar** (Recommended)\n- Duration: 2h 15min\n- Price: €45-120\n- Direct from Gare du Nord to St Pancras\n\n✈️ **Flights**\n- Duration: 1h 15min + airport time\n- Price: €50-150\n- Multiple airlines available\n\n🚌 **Bus**\n- Duration: 7-9 hours\n- Price: €25-45\n- Budget-friendly option\n\nWould you like me to provide more details about any of these options?',
    role: 'assistant',
    timestamp: new Date('2025-06-29T14:02:00'), // 2:02 PM
  },
  {
    id: '4',
    type: 'text',
    content: 'The Eurostar sounds good! Can you tell me more about booking and schedules?',
    role: 'user',
    timestamp: new Date('2025-06-29T14:04:00'), // 2:04 PM
  },
  {
    id: '5',
    type: 'text',
    content:
      "Perfect choice! Here's everything you need to know about Eurostar:\n\n📅 **Booking Tips:**\n- Book in advance for better prices\n- Flexible tickets allow changes\n- Standard class offers great value\n\n🕐 **Schedule:**\n- First train: 6:30 AM\n- Last train: 8:30 PM\n- Trains every 1-2 hours\n\n🎫 **Booking:**\n- Official site: eurostar.com\n- Check-in 30-45 min before\n- Passport required\n\nWould you like me to help you find specific dates and times?",
    role: 'assistant',
    timestamp: new Date('2025-06-29T14:05:00'), // 2:05 PM
  },
];

export default function ConversationPage() {
  const [messages] = useState<Message[]>(sampleMessages);
  const placeholders = [
    'Continue the conversation',
    'Ask about travel options',
    'Inquire about hotel bookings',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="border-gray-200 px-4 py-3 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-900">Travel Assistant</h1>
          <p className="text-sm text-gray-500">Resume conversation TODO</p>
        </div>
      </div>

      <ChatInterface messages={messages} />

      <div className="fixed bottom-4 left-0 right-0 mx-auto w-full flex items-center justify-center max-w-3xl z-10">
        <ChatInputMic placeholders={placeholders} />
      </div>
    </div>
  );
}
