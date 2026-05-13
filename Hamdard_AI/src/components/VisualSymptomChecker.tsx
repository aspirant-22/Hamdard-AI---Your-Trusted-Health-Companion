import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { analyzeVisualSymptoms } from '../services/gemini';
import { Eye, AlertTriangle, Info, CheckCircle2, ShieldAlert, Bot, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function VisualSymptomChecker() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (base64: string) => {
    setIsProcessing(true);
    try {
      const data = await analyzeVisualSymptoms(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'लक्षणों के विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error analyzing symptoms. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'bg-red-600 text-white shadow-lg shadow-red-200';
      case 'medium': return 'bg-amber-500 text-white shadow-lg shadow-amber-200';
      default: return 'bg-green-600 text-white shadow-lg shadow-green-200';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=2000"
          alt="Visual Check"
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
              {t('visual.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('visual.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <FileUploader 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing}
          label={language === 'hi' ? 'लक्षण फोटो' : 'Symptom Photo'}
          description={language === 'hi' ? 'प्रभावित क्षेत्र की स्पष्ट फोटो चुनें या अपलोड करें' : 'Click or upload a clear photo of the affected area'}
        />
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-rose-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-200">
                <Eye className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-rose-900">{language === 'hi' ? 'दृश्य विश्लेषण' : 'Visual Analysis'}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-rose-600">AI Symptom Scan</p>
              </div>
            </div>
            <div className={cn(
              "px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-widest",
              getUrgencyColor(result.urgency)
            )}>
              {language === 'hi' ? 'तोरण' : 'Urgency'}: {result.urgency}
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <ShieldAlert className="text-primary w-6 h-6" />
                  </div>
                  <h4 className="font-display font-black text-2xl">{language === 'hi' ? 'संभावित कारण' : 'Potential Causes'}</h4>
                </div>
                <ul className="space-y-4">
                  {result.potentialCauses.map((cause: string, i: number) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-5 bg-secondary/30 rounded-2xl border border-stone-100 text-ink font-bold text-lg"
                    >
                      <div className="w-3 h-3 rounded-full bg-rose-400 shrink-0" />
                      {cause}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-accent">
                    <div className="bg-accent/10 p-2 rounded-xl">
                      <Info className="text-accent w-6 h-6" />
                    </div>
                    <h4 className="font-display font-black text-2xl">{language === 'hi' ? 'विशेषज्ञ सलाह' : 'Expert Advice'}</h4>
                  </div>
                  <SpeakButton text={result.advice} />
                </div>
                <div className="bg-accent/5 p-8 rounded-[2rem] border border-accent/10 shadow-inner">
                  <p className="text-ink font-bold text-xl leading-relaxed">{result.advice}</p>
                </div>
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
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{t('nav.assistant')}</p>
                <SpeakButton text={result.hindiAdvice} />
              </div>
              <p className="text-primary font-bold text-2xl leading-relaxed relative z-10">{result.hindiAdvice}</p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-red-50 rounded-3xl text-sm text-red-600 border border-red-100 italic">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              </div>
              <p className="leading-relaxed font-bold">
                {language === 'hi' 
                  ? 'यह एक मेडिकल निदान नहीं है। यदि लक्षण बने रहते हैं या बिगड़ जाते हैं, तो कृपया तुरंत डॉक्टर से मिलें।' 
                  : 'This is not a medical diagnosis. If symptoms persist or worsen, please see a doctor immediately.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
