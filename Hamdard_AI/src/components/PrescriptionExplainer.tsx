import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { analyzePrescription } from '../services/gemini';
import { FileText, Info, Clock, Pill, CheckCircle2, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function PrescriptionExplainer() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (base64: string) => {
    setIsProcessing(true);
    try {
      const data = await analyzePrescription(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'प्रिस्क्रिप्शन विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error analyzing prescription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://drive.google.com/thumbnail?id=1--j223JLlk2DAtwAkVaKR_vx5uVzKqoQ&sz=w1200"
          alt="Prescription"
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
              {t('prescription.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('prescription.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <FileUploader 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing}
          label={language === 'hi' ? 'प्रिस्क्रिप्शन फोटो' : 'Prescription Photo'}
          description={language === 'hi' ? 'प्रिस्क्रिप्शन की स्पष्ट फोटो चुनें या अपलोड करें' : 'Click or upload a clear photo of the prescription'}
        />
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-rose-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-200">
                <FileText className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-rose-900">{t('prescription.title')} {t('common.summary')}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-rose-600">{t('common.analyzing')}</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-rose-600 border border-rose-200 shadow-sm">
              Smart Scan
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Pill className="text-primary w-6 h-6" />
                </div>
                <h4 className="font-display font-black text-2xl">{language === 'hi' ? 'पहचानी गई दवाएं' : 'Medicines Identified'}</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {result.medicines.map((med: any, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-secondary/30 rounded-3xl border border-stone-100 flex items-center gap-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4 bg-white rounded-2xl shadow-sm">
                      <Pill className="text-primary w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-ink">{med.name}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-stone-500 font-bold bg-white px-3 py-1 rounded-lg">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{med.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-500 font-bold bg-white px-3 py-1 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-healing" />
                          <span>{med.timing}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">English Summary</p>
                  <SpeakButton text={result.summary} />
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-inner">
                  <div className="markdown-body text-lg">
                    <Markdown>{result.summary}</Markdown>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">हिन्दी में सारांश</p>
                  <SpeakButton text={result.hindiSummary} />
                </div>
                <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100">
                  <p className="text-rose-900 font-bold text-2xl leading-relaxed">{result.hindiSummary}</p>
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
                  ? 'दवाएं लेने से पहले हमेशा अपने फार्मासिस्ट या डॉक्टर से दोबारा जांच करें। अकेले एआई विश्लेषण के आधार पर खुद दवा न लें।' 
                  : 'Always double-check with your pharmacist or doctor before taking the medicines. Do not self-medicate based on AI analysis alone.'}
              </p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl text-sm text-stone-500 italic border border-stone-100">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Info className="w-6 h-6 text-stone-400 shrink-0" />
              </div>
              <p className="leading-relaxed font-medium">
                {language === 'hi' 
                  ? 'यह एक एआई निष्कर्ष है। कृपया पेशेवर मेडिकल निदान के लिए परामर्श लें।' 
                  : 'This is an AI extraction. Please consult a professional medical diagnosis.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
