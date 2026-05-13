import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { analyzeLabReport } from '../services/gemini';
import { FileText, AlertCircle, CheckCircle2, Info, ArrowRight, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import SpeakButton from './SpeakButton';

import { useLanguage } from '../contexts/LanguageContext';

export default function LabReportAnalyzer() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (base64: string) => {
    setIsProcessing(true);
    try {
      const data = await analyzeLabReport(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'रिपोर्ट विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error analyzing report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://drive.google.com/thumbnail?id=1e7lDQ818DDjlxmjHMQgWc0MDR3Ml2rrK&sz=w1200"
          alt="Lab Report"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-900/40 to-transparent flex flex-col justify-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              {t('lab.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('lab.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <FileUploader 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing}
          label={language === 'hi' ? 'लैब रिपोर्ट फोटो' : 'Lab Report Photo'}
          description={language === 'hi' ? 'अपनी टेस्ट रिपोर्ट की स्पष्ट फोटो चुनें या अपलोड करें' : 'Click or upload a clear photo of your test report'}
        />
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-indigo-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                <FileText className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-indigo-900">{result.reportType} {t('common.summary')}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-indigo-600">{t('common.analyzing')}</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-indigo-600 border border-indigo-200 shadow-sm">
              Smart Analysis
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <AlertCircle className="text-primary w-6 h-6" />
                </div>
                <h4 className="font-display font-black text-2xl">{language === 'hi' ? 'असामान्य मान पहचाने गए' : 'Abnormal Values Detected'}</h4>
              </div>
              <div className="space-y-4">
                {result.abnormalValues.length > 0 ? (
                  result.abnormalValues.map((val: any, i: number) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 bg-red-50 rounded-3xl border border-red-100 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-600 p-2 rounded-xl">
                            <AlertCircle className="text-white w-5 h-5" />
                          </div>
                          <span className="text-2xl font-display font-black text-red-900">{val.parameter}</span>
                        </div>
                        <div className="flex items-center gap-4 text-lg">
                          <span className="px-4 py-2 bg-white rounded-xl border-2 border-red-200 text-red-700 font-black shadow-sm">{val.value}</span>
                          <ArrowRight className="text-red-300 w-6 h-6" />
                          <span className="text-stone-500 font-bold">{language === 'hi' ? 'संदर्भ' : 'Ref'}: {val.referenceRange}</span>
                        </div>
                      </div>
                      <p className="text-red-800 text-lg leading-relaxed font-medium">{val.explanation}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4 shadow-sm">
                    <div className="bg-green-600 p-2 rounded-xl">
                      <CheckCircle2 className="text-white w-8 h-8" />
                    </div>
                    <p className="text-green-900 font-bold text-xl">{language === 'hi' ? 'दी गई रिपोर्ट में कोई असामान्य मान नहीं पाया गया।' : 'No abnormal values detected in the provided report.'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">English Summary</p>
                  <SpeakButton text={result.summary} />
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-inner">
                  <p className="text-ink font-bold text-xl leading-relaxed">{result.summary}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">हिन्दी में सारांश</p>
                  <SpeakButton text={result.hindiSummary} />
                </div>
                <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100">
                  <p className="text-indigo-900 font-bold text-2xl leading-relaxed">{result.hindiSummary}</p>
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
                  ? 'यह एक एआई-सहायता प्राप्त स्पष्टीकरण है। कृपया इन परिणामों और किसी भी आवश्यक उपचार पर चर्चा करने के लिए अपने डॉक्टर से परामर्श लें।' 
                  : 'This is an AI-assisted explanation. Please consult your doctor to discuss these results and any necessary treatment.'}
              </p>
            </motion.div>

            <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl text-sm text-stone-500 italic border border-stone-100">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Info className="w-6 h-6 text-stone-400 shrink-0" />
              </div>
              <p className="leading-relaxed font-medium">
                {language === 'hi' 
                  ? 'हमेशा पेशेवर मेडिकल निदान के लिए परामर्श लें। खुद से निदान न करें।' 
                  : 'Always consult a professional medical diagnosis. Do not self-diagnose.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
