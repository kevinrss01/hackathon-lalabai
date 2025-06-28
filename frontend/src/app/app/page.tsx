'use client';

import { PlaceholdersAndVanishInput } from '@/components/landing-page/vanish-input';
import { ContainerTextFlip } from '@/components/ui/containerTextFlip';
import Navbar from '@/components/app-components/Navbar';
import React from 'react';
import { Button, Spinner } from '@heroui/react';
import { FaMicrophone } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AppPage = () => {
  const [data, setData] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const [transcription, setTranscription] = React.useState(false);

  const audioChunksRef = React.useRef<Blob[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

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

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  }, []);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!data.trim()) return;

      setTranscription(true);

      const res = await fetch('http://localhost:4000/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: data.trim() }),
      });

      const result = await res.json();
      console.log('txt:', result);

      setTranscription(false);
    },
    [data]
  );

  const startRecording = async () => {
    audioChunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm; codecs=opus',
      audioBitsPerSecond: 128000,
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.onstart = () => setRecording(true);

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
            <ContainerTextFlip words={['see', 'eat', 'buy']} />
          </div>
          <span className="text-2xl md:text-4xl font-bold text-black ml-3">?</span>
        </motion.div>

        <motion.div
          className="w-full flex items-center justify-center max-w-3xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmitAction={onSubmit}
          />
          <Button
            disabled={transcription}
            onPress={handleRecording}
            isIconOnly
            className={`w-12 h-12 min-w-12 rounded-3xl relative right-[60px] ${
              recording
                ? 'bg-red-500 hover:bg-red-600'
                : transcription
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
            }`}
          >
            {recording || transcription ? (
              <Spinner color="white" size="md" />
            ) : (
              <FaMicrophone className="text-white text-lg" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AppPage;
