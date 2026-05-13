import React, { useState, useEffect, useRef } from 'react';
import AudioRecorder from './AudioRecorder';
import { analyzeSymptoms, conversationalTriage, textToSpeech } from '../services/gemini';
import { AlertTriangle, CheckCircle2, Volume2, Loader2, MessageSquare, Power, User, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

import { useLanguage } from '../contexts/LanguageContext';

export default function VoiceTriage() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState<'single' | 'conversational'>('single');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [convMessages, setConvMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRecordingComplete = async (base64: string, mimeType: string) => {
    setIsProcessing(true);
    try {
      if (mode === 'single') {
        const data = await analyzeSymptoms(base64, mimeType, language);
        setResult(data);
      } else {
        const responseText = await conversationalTriage(chatHistory, base64, mimeType, language);
        
        const newHistory = [
          ...chatHistory,
          { role: 'user', parts: [{ text: language === 'hi' ? "(मरीज ने ऑडियो के माध्यम से अपने लक्षण बताए)" : "(Patient explained symptoms via audio)" }] },
          { role: 'model', parts: [{ text: responseText }] }
        ];
        setChatHistory(newHistory);
        setConvMessages(prev => [...prev, 
          { role: 'user', content: language === 'hi' ? "(वॉयस संदेश)" : "(Audio Message)" },
          { role: 'bot', content: responseText || "" }
        ]);

        if (responseText) {
          await speak(responseText);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(language === 'hi' ? 'त्रुटि: कृपया पुनः प्रयास करें।' : `Error: ${err.message || 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioBase64 = await textToSpeech(text);
      if (audioBase64) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const arrayBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0)).buffer;
        
        // Gemini returns 16-bit PCM. AudioBuffer expects Float32.
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
        source.onended = () => {
          setIsSpeaking(false);
          audioContext.close();
        };
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      setIsSpeaking(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'single' ? 'conversational' : 'single');
    setResult(null);
    setChatHistory([]);
    setConvMessages([]);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://drive.google.com/thumbnail?id=1WwVhDLqZ0NTwhYWpZjGxhc0tlZC9OPQC&sz=w1200"
          alt="Medical Care"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent flex flex-col justify-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              {t('voice.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {mode === 'single' 
                ? (language === 'hi' ? 'त्वरित एआई-संचालित सारांश और मार्गदर्शन के लिए अपने लक्षण बताएं।' : 'Speak your symptoms for a quick AI-powered summary and guidance.')
                : (language === 'hi' ? 'विस्तृत स्वास्थ्य सहायता के लिए हमदर्द के साथ स्वाभाविक बातचीत करें।' : 'Have a natural conversation with Hamdard for detailed health support.')}
            </p>
          </motion.div>
        </div>
        
        <div className="absolute top-8 right-8">
          <button
            onClick={toggleMode}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all backdrop-blur-md border border-white/30 ${
              mode === 'conversational' 
                ? 'bg-white text-primary shadow-xl' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {mode === 'conversational' ? <MessageSquare className="w-5 h-5" /> : <Power className="w-5 h-5" />}
            <span>{mode === 'conversational' ? (language === 'hi' ? 'वार्तालाप मोड' : 'Conversational Mode') : (language === 'hi' ? 'सिंगल टर्न मोड' : 'Single Turn Mode')}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-12">
        <div className="max-w-2xl mx-auto w-full">
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete} 
            isProcessing={isProcessing} 
            isSpeaking={isSpeaking}
          />
        </div>

        {mode === 'conversational' && convMessages.length > 0 && (
          <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in zoom-in duration-500">
            <div className="p-6 border-b bg-stone-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <MessageSquare className="text-primary w-5 h-5" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-stone-500">
                  {language === 'hi' ? 'संवाद इतिहास' : 'Dialogue History'}
                </span>
              </div>
              <button 
                onClick={() => {setChatHistory([]); setConvMessages([]);}}
                className="text-xs text-red-600 font-black hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {language === 'hi' ? 'सत्र रीसेट करें' : 'Reset Session'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {convMessages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                    msg.role === 'user' ? 'bg-accent text-white' : 'bg-primary text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-5 rounded-3xl text-base leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-none font-medium' 
                      : 'bg-stone-50 text-ink border border-stone-100 rounded-tl-none font-medium'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-stone-50 border border-stone-100 p-5 rounded-3xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary/40 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary/40 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary/40 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'single' && result && (
          <div className={`p-8 rounded-[2.5rem] border-2 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 ${
            result.emergency 
              ? 'bg-red-50 border-red-200' 
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${result.emergency ? 'bg-red-600' : 'bg-emerald-600'}`}>
                  {result.emergency ? (
                    <AlertTriangle className="text-white w-8 h-8" />
                  ) : (
                    <CheckCircle2 className="text-white w-8 h-8" />
                  )}
                </div>
                <div>
                  <h3 className={`text-3xl font-display font-black ${
                    result.emergency ? 'text-red-900' : 'text-emerald-900'
                  }`}>
                    {result.emergency 
                      ? (language === 'hi' ? 'आपातकालीन अलर्ट' : 'Emergency Alert') 
                      : (language === 'hi' ? 'ट्राइएज सारांश' : 'Triage Summary')}
                  </h3>
                  <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${
                    result.emergency ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {language === 'hi' ? 'एआई विश्लेषण पूरा हुआ' : 'AI Analysis Complete'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => speak(result.advice)}
                disabled={isSpeaking}
                className={`p-4 rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 ${
                  result.emergency 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                } disabled:opacity-50`}
              >
                {isSpeaking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>

            <div className="mt-10 space-y-10">
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-4">
                  {language === 'hi' ? 'सारांश' : 'Summary'}
                </p>
                <p className="text-xl text-ink font-semibold leading-relaxed">{result.summary}</p>
              </div>

              {result.dangerSigns.length > 0 && (
                <div className="bg-red-100/50 p-8 rounded-3xl border border-red-200/50">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-4">
                    {language === 'hi' ? 'खतरे के संकेत मिले' : 'Danger Signs Detected'}
                  </p>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {result.dangerSigns.map((sign: string, i: number) => (
                      <li key={i} className="flex items-center gap-3 text-red-800 font-bold bg-white/50 p-3 rounded-xl border border-red-200/30">
                        <div className="w-2 h-2 bg-red-600 rounded-full shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-stone-200/50 shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">
                  {language === 'hi' ? 'सलाह और अगले चरण' : 'Advice & Next Steps'}
                </p>
                <div className="markdown-body text-lg">
                  <Markdown>{result.advice}</Markdown>
                </div>
              </div>

              {result.emergency && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-red-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-red-200 flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="flex-1 text-center md:text-left">
                    <p className="font-display font-black text-3xl">
                      {language === 'hi' ? 'तत्काल कार्रवाई आवश्यक' : 'Immediate Action Required'}
                    </p>
                    <p className="text-red-100 text-lg mt-2 font-medium">
                      {language === 'hi' 
                        ? 'कृपया तुरंत निकटतम स्वास्थ्य केंद्र (PHC) पर जाएँ या 102/108 पर कॉल करें।' 
                        : 'Please visit the nearest Health Center (PHC) immediately or call 102/108.'}
                    </p>
                  </div>
                  <button className="bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-red-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                    {language === 'hi' ? 'निकटतम PHC खोजें' : 'Find Nearest PHC'}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
