import React from 'react';
import { motion } from 'motion/react';
import { HeartPulse, Stethoscope, Mic, FileText, Pill, BookOpen, Baby, MapPin, ChevronRight } from 'lucide-react';
import logo from '../hamdard-logo.png';
import doctorHero from '../hero-doctor.png';

import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export default function Home({ setActiveTab }: HomeProps) {
  const { language, setLanguage, t } = useLanguage();

  const services = [
    {
      id: 'voice',
      title: t('service.voice.title'),
      description: t('service.voice.desc'),
      image: 'https://drive.google.com/thumbnail?id=1WwVhDLqZ0NTwhYWpZjGxhc0tlZC9OPQC&sz=w800',
      color: 'bg-emerald-50',
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 'prescription',
      title: t('service.prescription.title'),
      description: t('service.prescription.desc'),
      image: 'https://drive.google.com/thumbnail?id=1--j223JLlk2DAtwAkVaKR_vx5uVzKqoQ&sz=w800',
      color: 'bg-rose-50',
      icon: <FileText className="w-8 h-8" />
    },
    {
      id: 'medicine',
      title: t('service.medicine.title'),
      description: t('service.medicine.desc'),
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
      color: 'bg-indigo-50',
      icon: <Pill className="w-8 h-8" />
    },
    {
      id: 'lab',
      title: t('service.lab.title'),
      description: t('service.lab.desc'),
      image: 'https://drive.google.com/thumbnail?id=1e7lDQ818DDjlxmjHMQgWc0MDR3Ml2rrK&sz=w800',
      color: 'bg-sky-50',
      icon: <Stethoscope className="w-8 h-8" />
    },
    {
      id: 'visual',
      title: t('service.visual.title'),
      description: t('service.visual.desc'),
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=400',
      color: 'bg-amber-50',
      icon: <HeartPulse className="w-8 h-8" />
    },
    {
      id: 'therapist',
      title: t('service.therapist.title'),
      description: t('service.therapist.desc'),
      image: 'https://drive.google.com/thumbnail?id=1_QNGcByrbFL0bNGsRTbX3zAOGUNOlmvh&sz=w800',
      color: 'bg-primary/5',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 'period',
      title: t('service.period.title'),
      description: t('service.period.desc'),
      image: 'https://drive.google.com/thumbnail?id=1wYIDnX36MjErzCEN0EJ9E1owU-hyK0Hm&sz=w800',
      color: 'bg-pink-50',
      icon: <Baby className="w-8 h-8" />
    },
    {
      id: 'jargon',
      title: t('service.jargon.title'),
      description: t('service.jargon.desc'),
      image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=400',
      color: 'bg-violet-50',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 'nutrition',
      title: t('service.nutrition.title'),
      description: t('service.nutrition.desc'),
      image: 'https://drive.google.com/thumbnail?id=1-cdTjmy2PA1ps9cpo0IN1uM9Q1Wy5PWB&sz=w800',
      color: 'bg-orange-50',
      icon: <Baby className="w-8 h-8" />
    },
    {
      id: 'emergency',
      title: t('service.emergency.title'),
      description: t('service.emergency.desc'),
      image: 'https://drive.google.com/thumbnail?id=1g77LKHuiwdVRU3Cr37inbyv_gFtbbTMy&sz=w800',
      color: 'bg-red-50',
      icon: <MapPin className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F8] p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Logo & Language */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
          <div className="relative">
             <img src={logo} alt={t('app.name')} className="w-80 h-auto object-contain drop-shadow-xl" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-black text-primary leading-none">{t('app.name')}</h1>
            <p className="text-xs font-black uppercase tracking-widest text-stone-400 mt-2">{t('app.tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-stone-100">
          <span className="text-sm font-bold text-stone-500">{t('app.language.select')}</span>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-stone-100 border-none rounded-xl px-4 py-2 font-bold text-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
        <div className="max-w-2xl text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-black text-ink leading-tight"
          >
            {t('app.hero.title')} <span className="text-primary">{t('app.name')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-stone-500 mt-6 font-medium"
          >
            {t('app.hero.subtitle')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-4"
          >
            <div className="bg-primary p-4 rounded-3xl shadow-2xl shadow-primary/30">
              <Stethoscope className="text-white w-10 h-10" />
            </div>
            <h3 className="text-4xl font-display font-black text-ink">{t('app.hero.services')}</h3>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          
          {/* Greeting Callout */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-20 -left-10 z-20 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-stone-100 max-w-[280px]"
          >
            <div className="absolute -bottom-3 left-10 w-6 h-6 bg-white rotate-45 border-b border-r border-stone-100" />
            <p className="text-sm font-bold text-ink leading-relaxed">
              {t('app.hero.greeting')}
            </p>
          </motion.div>

          <img 
            src={doctorHero}
            alt="Indian Female Doctor in Saree"
            className="relative w-[300px] md:w-[480px] h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-700 select-none animate-float"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => setActiveTab(service.id)}
            className={`group relative flex flex-col p-8 rounded-[2.5rem] border border-stone-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 text-left overflow-hidden ${service.color}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="max-w-[60%]">
                <h4 className="text-2xl font-display font-black text-ink leading-tight group-hover:text-primary transition-colors">{service.title}</h4>
                <p className="text-sm text-stone-500 mt-3 font-medium leading-relaxed">{service.description}</p>
              </div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white shrink-0 group-hover:scale-110 transition-transform duration-500 bg-white flex items-center justify-center relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center', 'text-primary/40');
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-primary/40 pointer-events-none opacity-0 group-has-[img[style*='display: none']]:opacity-100 transition-opacity">
                  {service.icon}
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
              <span>{t('app.try_now')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-stone-200 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-xs font-black uppercase tracking-widest text-stone-400">
          <span>{t('footer.copyright')}</span>
          <span className="text-stone-200">||</span>
          <span>{t('footer.priority')}</span>
          <span className="text-stone-200">||</span>
          <span>{t('footer.love')}</span>
        </div>
      </footer>
    </div>
  );
}
