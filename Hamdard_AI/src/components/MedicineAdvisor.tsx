import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { analyzeMedicine } from '../services/gemini';
import { Pill, Info, AlertTriangle, Volume2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function MedicineAdvisor() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (base64: string) => {
    setIsProcessing(true);
    try {
      const data = await analyzeMedicine(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'दवा के विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error analyzing medicine. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=2000"
          alt="Medicines"
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
              {t('medicine.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('medicine.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <FileUploader 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing}
          label={language === 'hi' ? 'दवा की फोटो' : 'Medicine Photo'}
          description={language === 'hi' ? 'दवा की स्पष्ट फोटो चुनें या अपलोड करें' : 'Click or upload a clear photo of the medicine'}
        />
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
                <Pill className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-primary">{result.medicineName}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-stone-400">AI Verified Information</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-primary border border-primary/20 shadow-sm">
              Smart Analysis
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="flex justify-end">
              <SpeakButton text={`${result.purpose}. ${result.dosage}. ${result.warnings}`} />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-secondary/30 p-6 rounded-3xl border border-stone-100"
                >
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">{t('medicine.purpose')}</p>
                   <p className="text-xl text-ink font-bold leading-relaxed">{result.purpose}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-secondary/30 p-6 rounded-3xl border border-stone-100"
                >
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">{t('medicine.dosage')}</p>
                   <p className="text-xl text-ink font-bold leading-relaxed">{result.dosage}</p>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 p-8 rounded-[2rem] border border-red-100 shadow-inner"
                >
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                    <div className="bg-red-600 p-2 rounded-xl">
                      <AlertTriangle className="text-white w-6 h-6" />
                    </div>
                    <h4 className="font-display font-black text-2xl">{t('medicine.warnings')}</h4>
                  </div>
                  <p className="text-red-900 text-lg leading-relaxed font-medium">{result.warnings}</p>
                </motion.div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Pill className="w-32 h-32" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{language === 'hi' ? 'हिन्दी में जानकारी' : 'Hindi Explanation'}</p>
                <SpeakButton text={result.hindiExplanation} />
              </div>
              <p className="text-primary font-bold text-2xl leading-relaxed relative z-10">{result.hindiExplanation}</p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl text-sm text-stone-500 italic border border-stone-100">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Info className="w-6 h-6 text-stone-400 shrink-0" />
              </div>
              <p className="leading-relaxed font-medium">{t('medicine.disclaimer')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
