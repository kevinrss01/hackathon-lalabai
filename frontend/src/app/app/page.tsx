'use client';

import { PlaceholdersAndVanishInput } from '@/components/landing-page/vanish-input';
import React from 'react';

const AppPage = () => {
  const [data, setData] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const [transcription, setTranscription] = React.useState(false);

  const audioChunksRef = React.useRef<Blob[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

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
    setData(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    const dataTranscribed = await res.json();
    console.log('data recu', dataTranscribed);
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());

        setTranscription(true);

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch('http://localhost:4000/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Transcription reçu audio:', result);
          }
        } catch (error) {
          console.error('Error sending audioBlob to server:', error);
        } finally {
          setTranscription(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      alert('error during recording' + error);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !recording) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  React.useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="h-screen bg-linear-115 from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff]">
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <h2 className="mb-4 sm:mb-8 text-xl text-center sm:text-5xl dark:text-white text-black">
          Ask your travel questions
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            disabled={transcription}
            onClick={handleRecording}
            className={`px-6 py-3 rounded-lg font-semibold ${
              recording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : transcription
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {recording
              ? "🛑 Arrêter l'enregistrement"
              : transcription
                ? '🔄 Transcription...'
                : "🎤 Démarrer l'enregistrement"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
