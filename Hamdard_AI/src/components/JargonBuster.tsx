import React, { useState } from 'react';
import { jargonBuster } from '../services/gemini';
import { Search, BookOpen, Loader2, Info, Bot, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function JargonBuster() {
  const { t, language } = useLanguage();
  const [term, setTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    
    setIsProcessing(true);
    try {
      const data = await jargonBuster(term);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'शब्द समझाने में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error explaining term. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=2000"
          alt="Jargon Buster"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-violet-900/40 to-transparent flex flex-col justify-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              {t('jargon.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('jargon.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-8">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={language === 'hi' ? 'मेडिकल शब्द दर्ज करें (जैसे: Hypertension, CBC, Viral)' : "Enter a medical term (e.g., Hypertension, CBC, Viral)"}
            className="w-full bg-white border-2 border-stone-100 rounded-[2rem] px-8 py-6 pr-20 text-xl font-bold text-ink focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-2xl"
          />
          <button
            type="submit"
            disabled={isProcessing || !term.trim()}
            className="absolute right-4 top-4 bottom-4 px-6 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Hypertension', 'Diabetes', 'CBC Test', 'Viral Infection'].map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTerm(t);
                setIsProcessing(true);
                jargonBuster(t).then(setResult).finally(() => setIsProcessing(false));
              }}
              className="px-4 py-4 bg-white border-2 border-stone-50 rounded-2xl text-sm font-black uppercase tracking-widest text-stone-500 hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-violet-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-violet-600 p-3 rounded-2xl shadow-lg shadow-violet-200">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-violet-900">{result.term}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-violet-600">AI Simplified Definition</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-violet-600 border border-violet-200 shadow-sm">
              Language Scan
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Simple Explanation</p>
                  <SpeakButton text={result.explanation} />
                </div>
                <div className="bg-secondary/30 p-8 rounded-[2rem] border border-stone-100 shadow-inner">
                  <p className="text-ink font-bold text-xl leading-relaxed">{result.explanation}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">हिन्दी में सरल अर्थ</p>
                  <SpeakButton text={result.hindiExplanation} />
                </div>
                <div className="bg-violet-50/50 p-8 rounded-[2rem] border border-violet-100">
                  <p className="text-violet-900 font-bold text-2xl leading-relaxed">{result.hindiExplanation}</p>
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
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4">{t('nav.assistant')}</p>
              <p className="text-primary font-bold text-xl leading-relaxed relative z-10">
                {language === 'hi' 
                  ? 'यह स्पष्टीकरण मेडिकल शब्दों को बेहतर ढंग से समझने में आपकी मदद करने के लिए शैक्षिक उद्देश्यों के लिए है। हमेशा चिकित्सा सलाह के लिए पेशेवर से परामर्श लें।' 
                  : 'This explanation is for educational purposes to help you understand medical terms better. Always consult a professional for medical advice.'}
              </p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl text-sm text-stone-500 italic border border-stone-100">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Info className="w-6 h-6 text-stone-400 shrink-0" />
              </div>
              <p className="leading-relaxed font-medium">
                {language === 'hi' 
                  ? 'एआई-जनित सामग्री। केवल संदर्भ के रूप में उपयोग करें।' 
                  : 'AI-generated content. Use as a reference only.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
