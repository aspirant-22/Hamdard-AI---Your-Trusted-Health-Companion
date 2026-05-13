import React, { useState, useEffect } from 'react';
import { findHospitals } from '../services/gemini';
import { MapPin, Search, Loader2, Navigation, Phone, Globe, Info, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

import { useLanguage } from '../contexts/LanguageContext';

export default function EmergencyHelp() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() && !coords) return;
    
    setIsProcessing(true);
    try {
      const data = await findHospitals(location || 'current location', coords?.lat, coords?.lng);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'अस्पताल खोजने में त्रुटि। कृपया पुनः प्रयास करें।' : 'Error finding hospitals. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://drive.google.com/thumbnail?id=1g77LKHuiwdVRU3Cr37inbyv_gFtbbTMy&sz=w1200"
          alt="Emergency Help"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-900/40 to-transparent flex flex-col justify-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              {t('emergency.title')}
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg font-medium">
              {t('emergency.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-red-500 transition-colors">
            <MapPin className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={coords 
              ? (language === 'hi' ? "आपके पास खोजा जा रहा है..." : "Searching near you...") 
              : (language === 'hi' ? "अपने गाँव या शहर का नाम दर्ज करें" : "Enter your village or town name")}
            className="w-full bg-white border-2 border-stone-100 rounded-[2rem] pl-16 pr-20 py-6 text-xl font-bold text-ink focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-2xl"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="absolute right-4 top-4 bottom-4 px-6 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg shadow-red-200 flex items-center justify-center"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-8 border-b bg-red-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200">
                <Navigation className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-red-900">{language === 'hi' ? 'आस-पास की स्वास्थ्य सुविधाएं' : 'Nearby Health Facilities'}</h3>
                <p className="text-xs font-black uppercase tracking-widest mt-1 text-red-600">Verified Location Scan</p>
              </div>
            </div>
            <div className="px-6 py-2 rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-red-600 border border-red-200 shadow-sm">
              Live Grounding
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="bg-secondary/30 p-8 rounded-[2rem] border border-stone-100 shadow-inner">
              <div className="markdown-body prose prose-stone max-w-none prose-p:font-bold prose-p:text-lg prose-p:text-ink prose-headings:font-display prose-headings:font-black">
                <Markdown>{result.text}</Markdown>
              </div>
            </div>

            {result.grounding.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-stone-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{language === 'hi' ? 'सत्यापित स्रोत और मानचित्र' : 'Verified Sources & Maps'}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.grounding.map((chunk: any, i: number) => (
                    chunk.maps && (
                      <motion.a
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={chunk.maps.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 bg-white rounded-3xl border border-stone-100 flex items-center gap-5 hover:border-red-500 hover:bg-red-50/50 transition-all group shadow-sm"
                      >
                        <div className="p-4 bg-stone-50 rounded-2xl shadow-sm group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-black text-ink text-lg truncate">{chunk.maps.title || (language === 'hi' ? 'मानचित्र पर देखें' : 'View on Maps')}</p>
                          <p className="text-xs text-stone-400 truncate font-bold mt-1">{chunk.maps.uri}</p>
                        </div>
                      </motion.a>
                    )
                  ))}
                </div>
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Bot className="w-32 h-32 text-red-900" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-4">{language === 'hi' ? 'आपातकालीन प्रोटोकॉल' : 'Emergency Protocol'}</p>
              <div className="flex items-center gap-6 relative z-10">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <span className="text-4xl font-black text-red-500">!!!</span>
                </div>
                <p className="text-red-900 font-black text-xl leading-relaxed">
                  {language === 'hi' 
                    ? 'जीवन-धमकी वाली आपात स्थितियों में, तुरंत 102 या 108 पर कॉल करें।' 
                    : 'In case of life-threatening emergencies, call 102 or 108 immediately.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
