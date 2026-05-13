import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Loader2, Heart, Mic, Volume2 } from 'lucide-react';
import { mentalWellnessChat, mentalWellnessVoiceChat, textToSpeech } from '../services/gemini';
import AudioRecorder from './AudioRecorder';
import { useLanguage } from '../contexts/LanguageContext';

export default function DigitalTherapist() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: language === 'hi' ? "नमस्ते! मैं आपकी डिजिटल थेरेपिस्ट हूँ। मैं यहाँ आपको सुनने और आपका समर्थन करने के लिए हूँ। आज आप कैसा महसूस कर रहे हैं?" : "Namaste! I am your Digital Therapist. I'm here to listen and support you. How are you feeling today?" }
  ]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioBase64 = await textToSpeech(text);
      if (audioBase64) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const arrayBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0)).buffer;
        const pcm16 = new Int16Array(arrayBuffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await mentalWellnessChat(messages, userMsg, language);
      const botMsg = response || "I'm here for you. Could you tell me more?";
      setMessages(prev => [...prev, { role: 'bot', content: botMsg }]);
      
      // Update history for voice if needed
      setChatHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userMsg }] },
        { role: 'model', parts: [{ text: botMsg }] }
      ]);

      if (mode === 'voice') {
        await speak(botMsg);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm having a bit of trouble connecting. But I'm still here to listen." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRecordingComplete = async (base64: string, mimeType: string) => {
    setIsTyping(true);
    try {
      const responseText = await mentalWellnessVoiceChat(chatHistory, base64, mimeType, language);
      const botMsg = responseText || "I'm listening. Could you tell me more?";
      
      setMessages(prev => [...prev, 
        { role: 'user', content: "(Audio Message)" },
        { role: 'bot', content: botMsg }
      ]);

      setChatHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: language === 'hi' ? "(मरीज ने ऑडियो के माध्यम से अपनी भावनाएं व्यक्त की म)" : "(Patient shared feelings via audio)" }] },
        { role: 'model', parts: [{ text: botMsg }] }
      ]);

      if (botMsg) {
        await speak(botMsg);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message || 'Please try again.'}`);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
      {/* Animated Companion Header */}
      <div className="bg-primary p-8 flex items-center justify-between relative overflow-hidden shrink-0">
        {/* Calming Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="flex items-center gap-8 relative z-10 w-full">
          <div className="relative group">
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 0 0px rgba(255,255,255,0.2)", "0 0 0 20px rgba(255,255,255,0)", "0 0 0 0px rgba(255,255,255,0)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative w-28 h-28 bg-white p-1 rounded-full overflow-hidden shadow-2xl border-2 border-white/50"
            >
              <img 
                src="https://drive.google.com/thumbnail?id=1_QNGcByrbFL0bNGsRTbX3zAOGUNOlmvh&sz=w1200"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                alt="Therapist"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-healing rounded-full flex items-center justify-center border-4 border-primary shadow-lg ring-2 ring-white/20">
              <Sparkles className="text-white w-5 h-5 fill-current" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-display font-black text-white tracking-tight">{t('therapist.header.title')}</h3>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-white/10">
                {t('therapist.header.subtitle')}
              </span>
            </div>
            <p className="text-white/70 text-sm mt-2 max-w-lg font-medium leading-relaxed">
              {t('therapist.header.desc')}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-2 h-2 bg-healing rounded-full animate-ping" />
              <span className="text-[10px] text-healing font-black uppercase tracking-[0.2em]">{t('therapist.status')}</span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-3">
            <button
              onClick={() => setMode(prev => prev === 'text' ? 'voice' : 'text')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all backdrop-blur-md border border-white/20 w-fit ${
                mode === 'voice' 
                  ? 'bg-white text-primary shadow-2xl scale-105' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {mode === 'voice' ? <Mic className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span className="text-sm uppercase tracking-widest">{mode === 'voice' ? t('therapist.switch.text') : t('therapist.switch.voice')}</span>
            </button>
            <p className="text-[10px] text-white/40 uppercase tracking-widest text-right">{t('therapist.privacy')}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-10 bg-secondary/30 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-6 max-w-[85%] animate-in fade-in slide-in-from-bottom-4 duration-500",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xl transition-all duration-500 hover:rotate-3",
                msg.role === 'user' 
                  ? "bg-accent border-accent/20" 
                  : "bg-white border-stone-200 overflow-hidden p-0.5"
              )}>
                {msg.role === 'user' 
                  ? <User className="text-white w-7 h-7" /> 
                  : (
                    <img 
                      src="https://drive.google.com/thumbnail?id=1_QNGcByrbFL0bNGsRTbX3zAOGUNOlmvh&sz=w1200" 
                      className="w-full h-full object-cover rounded-xl"
                      alt="Therapist"
                    />
                  )
                }
              </div>
              <div className={cn(
                "p-7 rounded-[2.2rem] text-lg leading-relaxed shadow-2xl transition-all duration-500",
                msg.role === 'user' 
                  ? "bg-accent text-white rounded-tr-none font-medium shadow-accent/20" 
                  : "bg-white text-ink border border-stone-100 rounded-tl-none font-medium text-stone-700"
              )}>
                {msg.content}
                {msg.role === 'bot' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-stone-100/50">
                    <button className="p-2 hover:bg-stone-50 rounded-lg transition-colors group">
                      <Heart className="w-4 h-4 text-stone-300 group-hover:text-red-400 group-hover:fill-current transition-all" />
                    </button>
                    <button onClick={() => speak(msg.content)} className="p-2 hover:bg-stone-50 rounded-lg transition-colors group">
                      <Volume2 className="w-4 h-4 text-stone-300 group-hover:text-primary transition-all" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6 max-w-[85%]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden p-0.5">
              <img 
                src="https://drive.google.com/thumbnail?id=1_QNGcByrbFL0bNGsRTbX3zAOGUNOlmvh&sz=w1200" 
                className="w-full h-full object-cover rounded-xl grayscale opacity-50"
                alt="Typing..."
              />
            </div>
            <div className="bg-white border border-stone-100 p-8 rounded-[2.2rem] rounded-tl-none flex gap-3 shadow-2xl items-center">
              <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-primary/40 rounded-full" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 bg-primary/40 rounded-full" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 bg-primary/40 rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-stone-100 p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.03)] shrink-0">
        <div className="max-w-4xl mx-auto">
          {mode === 'voice' ? (
            <div className="flex flex-col items-center gap-6 py-6 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-stone-100">
              <AudioRecorder 
                onRecordingComplete={handleRecordingComplete} 
                isProcessing={isTyping} 
                isSpeaking={isSpeaking}
              />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">{t('therapist.speak.hint')}</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('therapist.input.placeholder')}
                className="w-full bg-secondary/40 border-2 border-transparent rounded-full px-10 py-6 text-lg focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all shadow-inner pr-24"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-4 rounded-full hover:bg-stone-900 transition-all disabled:opacity-30 shadow-xl hover:scale-110 active:scale-95 group-hover:shadow-primary/20"
              >
                {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </form>
          )}
          <div className="mt-4 flex items-center justify-center gap-6">
             <button onClick={() => setMode('text')} className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", mode === 'text' ? "text-primary" : "text-stone-300 hover:text-stone-500")}>Keyboard</button>
             <div className="w-1 h-1 bg-stone-200 rounded-full" />
             <button onClick={() => setMode('voice')} className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", mode === 'voice' ? "text-primary" : "text-stone-300 hover:text-stone-500")}>Voice Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
