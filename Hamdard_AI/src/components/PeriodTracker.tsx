import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Info, Heart, ChevronRight, ChevronLeft, Bot, Volume2 } from 'lucide-react';
import { getPeriodTips } from '../services/gemini';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function PeriodTracker() {
  const { t, language } = useLanguage();
  const [day, setDay] = useState(1);
  const [cycleLength, setCycleLength] = useState(28);
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGetTips = async () => {
    setIsProcessing(true);
    try {
      const data = await getPeriodTips(day, cycleLength);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'सुझाव प्राप्त करने में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error getting tips. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://drive.google.com/thumbnail?id=1wYIDnX36MjErzCEN0EJ9E1owU-hyK0Hm&sz=w1200"
          alt="Period Tracker"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-rose-900/40 to-transparent flex flex-col justify-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              {t('period.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('period.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-2xl space-y-10">
          <div className="space-y-8">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{language === 'hi' ? 'चक्र में वर्तमान दिन' : 'Current Day in Cycle'}</span>
              <div className="flex items-center gap-6 mt-4">
                <button 
                  onClick={() => setDay(Math.max(1, day - 1))}
                  className="p-4 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6 text-stone-600" />
                </button>
                <div className="flex-1 text-center bg-secondary/30 py-4 rounded-3xl border border-stone-100">
                  <span className="text-5xl font-display font-black text-primary">{language === 'hi' ? `दिन ${day}` : `Day ${day}`}</span>
                </div>
                <button 
                  onClick={() => setDay(Math.min(cycleLength, day + 1))}
                  className="p-4 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6 text-stone-600" />
                </button>
              </div>
              <input 
                type="range" 
                min="1" 
                max={cycleLength} 
                value={day} 
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="w-full mt-8 h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{language === 'hi' ? 'औसत चक्र लंबाई' : 'Average Cycle Length'}</span>
              <select 
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                className="w-full mt-4 bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-4 font-bold text-ink focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              >
                {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map(l => (
                  <option key={l} value={l}>{l} {language === 'hi' ? 'दिन' : 'Days'}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={handleGetTips}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            <span>{language === 'hi' ? 'एआई स्वास्थ्य सुझाव प्राप्त करें' : 'Get AI Health Tips'}</span>
          </button>
        </div>

        <div className="relative aspect-square bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Calendar className="w-full h-full p-12" />
          </div>
          
          <div className="relative w-80 h-80">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="#f5f5f0"
                strokeWidth="24"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="24"
                strokeDasharray={2 * Math.PI * 140}
                initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 140) * (1 - day / cycleLength) }}
                transition={{ duration: 1.5, ease: "circOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
              <span className="text-6xl font-display font-black text-primary mt-2">{Math.round((day / cycleLength) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-rose-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-200">
                <Heart className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-rose-900">{language === 'hi' ? `${result.phase} चरण` : `${result.phase} Phase`}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-rose-600">AI Cycle Analysis</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-rose-600 border border-rose-200 shadow-sm">
              {result.ovulationStatus}
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{language === 'hi' ? 'स्वास्थ्य सुझाव' : 'Health Tips'}</p>
                  <SpeakButton text={result.tips.join('. ')} />
                </div>
                <ul className="space-y-4">
                  {result.tips.map((tip: string, i: number) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-5 bg-secondary/30 rounded-2xl border border-stone-100 text-ink font-bold text-lg"
                    >
                      <div className="mt-2 w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">हिन्दी में सुझाव</p>
                  <SpeakButton text={result.hindiTips.join('. ')} />
                </div>
                <ul className="space-y-4">
                  {result.hindiTips.map((tip: string, i: number) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-5 bg-rose-50/50 rounded-2xl border border-rose-100 text-rose-900 font-bold text-lg"
                    >
                      <div className="mt-2 w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Bot className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4">{t('nav.assistant')}</p>
              <p className="text-primary font-bold text-xl leading-relaxed relative z-10">
                {language === 'hi' 
                  ? 'यह ट्रैकर सामान्य स्वास्थ्य सलाह देता है। हर चक्र अनोखा होता है; किसी भी विशिष्ट चिंता के लिए कृपया डॉक्टर से परामर्श लें।' 
                  : 'This tracker provides general wellness advice. Every cycle is unique; please consult a doctor for any specific concerns.'}
              </p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl text-sm text-stone-500 italic border border-stone-100">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Info className="w-6 h-6 text-stone-400 shrink-0" />
              </div>
              <p className="leading-relaxed font-medium">
                {language === 'hi' 
                  ? 'यह जानकारी एआई-जनित है। कृपया पेशेवर मेडिकल निदान के लिए परामर्श लें।' 
                  : 'This information is AI-generated. Please consult a professional medical diagnosis.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", props.className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
