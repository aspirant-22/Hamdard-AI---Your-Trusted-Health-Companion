import React from 'react';
import { motion } from 'motion/react';
import { 
  Home as HomeIcon,
  Mic, 
  Baby, 
  Pill, 
  FileText, 
  BookOpen, 
  MapPin, 
  HeartPulse,
  Menu,
  X,
  Eye,
  Bot,
  Calendar
} from 'lucide-react';
import logo from '../hamdard-logo.png';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

import { useLanguage } from '../contexts/LanguageContext';

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('nav.dashboard'), icon: HomeIcon, color: 'bg-primary' },
    { id: 'voice', label: t('service.voice.title'), icon: Mic, color: 'bg-emerald-500' },
    { id: 'nutrition', label: t('service.nutrition.title'), icon: Baby, color: 'bg-orange-500' },
    { id: 'medicine', label: t('service.medicine.title'), icon: Pill, color: 'bg-indigo-500' },
    { id: 'prescription', label: t('service.prescription.title'), icon: FileText, color: 'bg-rose-500' },
    { id: 'lab', label: t('service.lab.title'), icon: FileText, color: 'bg-sky-500' },
    { id: 'visual', label: t('service.visual.title'), icon: Eye, color: 'bg-amber-500' },
    { id: 'therapist', label: t('service.therapist.title'), icon: Bot, color: 'bg-primary' },
    { id: 'period', label: t('service.period.title'), icon: Calendar, color: 'bg-pink-400' },
    { id: 'jargon', label: t('service.jargon.title'), icon: BookOpen, color: 'bg-violet-500' },
    { id: 'emergency', label: t('nav.emergency'), icon: MapPin, color: 'bg-red-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary selection:bg-primary/20">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt={t('app.name')} className="w-24 h-auto object-contain" />
          <span className="font-display text-xl font-bold text-ink">{t('app.name')}</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-ink">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={cn(
        "fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:relative md:flex md:w-72 md:flex-col border-r border-stone-200 transition-all duration-500 md:translate-x-0",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 hidden md:flex items-center gap-4 border-b border-stone-100">
          <img src={logo} alt={t('app.name')} className="w-32 h-auto object-contain animate-float" />
          <div>
            <h1 className="font-display text-2xl font-bold text-ink leading-none">{t('app.name')}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black mt-2">{t('nav.assistant')}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-2xl shadow-primary/40 scale-[1.02]" 
                  : "hover:bg-stone-100/80 text-stone-500 hover:text-ink"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors duration-300",
                activeTab === item.id ? "bg-white/20" : "bg-stone-100 group-hover:bg-white"
              )}>
                <item.icon className={cn(
                  "w-5 h-5",
                  activeTab === item.id ? "text-white" : "text-stone-400 group-hover:text-primary"
                )} />
              </div>
              <span className="font-semibold tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-8 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-stone-100">
          <div className="bg-red-50 rounded-3xl p-5 border border-red-100 group cursor-pointer hover:bg-red-100 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <MapPin className="text-white w-4 h-4" />
              </div>
              <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">{t('nav.emergency')}</p>
            </div>
            <p className="text-2xl font-display font-black text-red-700 group-hover:scale-105 transition-transform">102 / 108</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto transition-all duration-500",
        (activeTab === 'therapist' || activeTab === 'home') ? "p-0" : "p-4 md:p-8 lg:p-12"
      )}>
        <div className={cn(
          "mx-auto transition-all duration-500",
          activeTab === 'therapist' ? "max-w-7xl h-full p-4 md:p-6 lg:p-8" : 
          activeTab === 'home' ? "max-w-none" : "max-w-5xl"
        )}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={activeTab === 'therapist' ? "h-full" : ""}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
