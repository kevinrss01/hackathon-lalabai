import { Button, Spinner } from '@heroui/react';
import React from 'react';
import { displayToast } from '@/utils/sonnerToast';
import { PlaceholdersAndVanishInput } from '../landing-page/vanish-input';
import { FaMicrophone } from 'react-icons/fa';

const ChatInputMic = ({ placeholders }: { placeholders: string[] }) => {
  const [data, setData] = React.useState('');
  const [recording, setRecording] = React.useState(false);
  const [transcription, setTranscription] = React.useState(false);

  const audioChunksRef = React.useRef<Blob[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  }, []);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!data.trim()) return;

      setTranscription(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transcribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: data.trim() }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log('Text submission result:', result);
        setData('');
      } catch (error) {
        displayToast.error(
          'An error occurred while sending your request. Please try again or contact us.'
        );
        console.error('Error sending data to server:', error);
      } finally {
        setTranscription(false);
      }
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transcribe`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Audio transcription result:', result);

        displayToast.success('Audio message sent successfully!');
      } catch (error) {
        console.error('Error sending audioBlob to server:', error);
        displayToast.error('An error occurred while processing your audio. Please try again.');
      } finally {
        setTranscription(false);
      }
    };

    mediaRecorder.start();
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
    <>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmitAction={onSubmit}
        isRecording={recording}
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
    </>
  );
};

export default ChatInputMic;
