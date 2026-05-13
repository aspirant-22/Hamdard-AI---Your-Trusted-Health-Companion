import React, { useState, useRef } from 'react';
import { Volume2, Loader2, Square } from 'lucide-react';
import { textToSpeech } from '../services/gemini';
import { useLanguage } from '../contexts/LanguageContext';

interface SpeakButtonProps {
  text: string;
}

export default function SpeakButton({ text }: SpeakButtonProps) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSpeak = async () => {
    if (isPlaying) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsProcessing(true);
    try {
      const base64 = await textToSpeech(text);
      if (base64) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = audioContext;
        
        const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
        const pcm16 = new Int16Array(arrayBuffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768;
        }

        const audioBuffer = audioContext.createBuffer(1, float32.length, 24000);
        audioBuffer.getChannelData(0).set(float32);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        audioSourceRef.current = source;
        
        setIsPlaying(true);
        source.onended = () => {
          setIsPlaying(false);
          audioSourceRef.current = null;
          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
        };
        source.start();
      }
    } catch (err) {
      console.error('Error in TTS:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isProcessing}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all border shadow-sm ${
        isPlaying 
          ? 'bg-rose-50 text-rose-600 border-rose-200' 
          : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
      }`}
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
      ) : isPlaying ? (
        <Square className="w-4 h-4 text-rose-600 fill-current" />
      ) : (
        <Volume2 className="w-4 h-4 text-indigo-600" />
      )}
      <span>
        {isProcessing 
          ? (language === 'hi' ? 'तैयार हो रहा है...' : 'Preparing...') 
          : isPlaying 
            ? (language === 'hi' ? 'रुकें' : 'Stop') 
            : (language === 'hi' ? 'सुनें' : 'Listen')}
      </span>
    </button>
  );
}
