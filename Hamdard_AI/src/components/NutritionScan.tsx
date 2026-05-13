import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { analyzeNutrition } from '../services/gemini';
import { AlertCircle, CheckCircle, Info, Apple, Bot, Volume2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function NutritionScan() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (base64: string) => {
    setIsProcessing(true);
    try {
      const data = await analyzeNutrition(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'छवि विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error analyzing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'mild': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://drive.google.com/thumbnail?id=1-cdTjmy2PA1ps9cpo0IN1uM9Q1Wy5PWB&sz=w1200"
          alt="Child Nutrition"
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
              {t('nutrition.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('nutrition.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <FileUploader 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing}
          label={language === 'hi' ? 'बच्चे की फोटो' : "Child's Photo"}
          description={language === 'hi' ? 'बच्चे की स्पष्ट फोटो चुनें या अपलोड करें' : 'Click or upload a clear photo of the child'}
        />
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`p-8 border-b flex items-center justify-between ${getRiskColor(result.riskLevel)}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white/30 backdrop-blur-md`}>
                {result.riskLevel.toLowerCase() === 'high' ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-3xl font-display font-black">{language === 'hi' ? 'पोषण स्थिति' : 'Nutrition Status'}: {result.riskLevel}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 opacity-70">AI Diagnostic Assessment</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest border border-white/20">
              Verified Analysis
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Info className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-black text-2xl">{language === 'hi' ? 'अवलोकन' : 'Observations'}</h4>
                </div>
                <ul className="space-y-4">
                  {result.observations.map((obs: string, i: number) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 text-ink font-medium bg-secondary/30 p-4 rounded-2xl border border-stone-100"
                    >
                      <div className="mt-2 w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                      <span>{obs}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-accent">
                    <div className="bg-accent/10 p-2 rounded-xl">
                      <Apple className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-black text-2xl">{language === 'hi' ? 'पोषण संबंधी सलाह' : 'Nutritional Advice'}</h4>
                  </div>
                  <SpeakButton text={result.recommendations} />
                </div>
                <div className="bg-accent/5 p-8 rounded-[2rem] border border-accent/10 shadow-inner">
                  <div className="markdown-body text-lg">
                    <Markdown>{result.recommendations}</Markdown>
                  </div>
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{language === 'hi' ? 'हिन्दी मार्गदर्शन' : 'Hindi Guidance'}</p>
                <SpeakButton text={result.hindiAdvice} />
              </div>
              <p className="text-primary font-bold text-2xl leading-relaxed relative z-10">{result.hindiAdvice}</p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl text-sm text-stone-500 italic border border-stone-100">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Info className="w-6 h-6 text-stone-400 shrink-0" />
              </div>
              <p className="leading-relaxed">
                {language === 'hi' 
                  ? 'यह एआई-जनित मूल्यांकन है। कृपया पेशेवर मेडिकल निदान के लिए आंगनवाड़ी कार्यकर्ता या डॉक्टर से परामर्श लें।' 
                  : 'This is an AI-generated assessment. Please consult an Anganwadi worker or a doctor for a professional medical diagnosis.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
