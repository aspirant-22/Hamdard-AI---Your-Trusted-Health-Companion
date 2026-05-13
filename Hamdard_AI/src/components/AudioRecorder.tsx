import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface AudioRecorderProps {
  onRecordingComplete: (base64: string, mimeType: string) => void;
  isProcessing: boolean;
  isSpeaking?: boolean;
}

export default function AudioRecorder({ onRecordingComplete, isProcessing, isSpeaking }: AudioRecorderProps) {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          onRecordingComplete(base64String, mimeType);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert(language === 'hi' ? 'माइक्रोफ़ोन तक पहुँच नहीं मिल सकी। कृपया अनुमति जाँचें।' : 'Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const getStatusText = () => {
    if (isRecording) return language === 'hi' ? 'आपको सुन रही हूँ...' : 'Listening to you...';
    if (isSpeaking) return language === 'hi' ? 'हमदर्द जवाब दे रहा है...' : 'Hamdard is responding...';
    if (isProcessing) return language === 'hi' ? 'सोच रही हूँ...' : 'Thinking...';
    return language === 'hi' ? 'हमदर्द से बात करने के लिए टैप करें' : 'Tap to talk to Hamdard';
  };

  const getSubText = () => {
    if (isRecording) return language === 'hi' ? 'ऑडियो रिकॉर्ड किया जा रहा है' : 'Recording Audio';
    return language === 'hi' ? 'सहानुभूतिपूर्ण साथी' : 'Empathetic Companion';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {/* Animated Rings */}
        <AnimatePresence>
          {(isRecording || isSpeaking || isProcessing) && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full border-2 ${
                  isRecording ? 'border-red-400' : isSpeaking ? 'border-primary' : 'border-accent'
                }`}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className={`absolute inset-0 rounded-full border-2 ${
                  isRecording ? 'border-red-300' : isSpeaking ? 'border-primary/50' : 'border-accent/50'
                }`}
              />
            </>
          )}
        </AnimatePresence>

        {/* Avatar Image */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || isSpeaking}
          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform active:scale-95 disabled:opacity-80"
        >
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"
            alt="Therapist"
            className={`w-full h-full object-cover transition-all duration-500 ${
              isRecording ? 'grayscale-0 scale-110' : 'grayscale-[0.2]'
            }`}
            referrerPolicy="no-referrer"
          />
          
          {/* Overlay Icons */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
            isRecording ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {isRecording ? (
              <Square className="w-10 h-10 text-white fill-current" />
            ) : isProcessing ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : isSpeaking ? (
              <div className="flex gap-1">
                <motion.div animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 bg-white rounded-full" />
                <motion.div animate={{ height: [20, 40, 20] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1.5 bg-white rounded-full" />
                <motion.div animate={{ height: [15, 35, 15] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1.5 bg-white rounded-full" />
              </div>
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className={`font-serif font-bold text-lg ${
          isRecording ? 'text-red-600' : isSpeaking ? 'text-primary' : 'text-stone-700'
        }`}>
          {getStatusText()}
        </p>
        <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">
          {getSubText()}
        </p>
      </div>
    </div>
  );
}
