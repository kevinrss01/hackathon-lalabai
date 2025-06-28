'use client';

import { useState, useRef, useEffect } from 'react';
import { PlaceholdersAndVanishInput } from '@/components/landing-page/vanish-input';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

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

const AppPage = () => {
  const [data, setData] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<boolean>(false);

  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.trim()) return;
    setTranscription(true);
    const res = await fetch('http://localhost:4000/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: data.trim() }),
    });
    await res.json();
    setTranscription(false);
    setData('');
  };

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
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setTranscription(true);
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        const response = await fetch('http://localhost:4000/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          await response.json();
        }
      } catch {
        // handle error silently
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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100">
      <div className="w-full max-w-xl px-2 flex justify-center">
        <div className="flex items-center w-full max-w-xl gap-1">
          <div className="flex-1">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
          <button
            type="button"
            onClick={handleRecording}
            disabled={transcription}
            className="ml-0.5 p-0 flex items-center justify-center bg-transparent hover:scale-105 transition disabled:opacity-60 focus:outline-none"
            aria-label={recording ? 'Stop recording' : 'Start recording'}
            style={{ lineHeight: 0 }}
          >
            <MicrophoneIcon
              className={`w-5 h-5 ${recording ? 'text-rose-600 animate-pulse' : 'text-black hover:text-neutral-700'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
