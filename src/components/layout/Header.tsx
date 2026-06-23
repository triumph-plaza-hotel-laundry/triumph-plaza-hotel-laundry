import React, { useState, useEffect } from 'react';
import { Bell, Globe, Wifi, WifiOff, Sparkles, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../lib/i18n';
import type { Page } from '../../types';

interface HeaderProps {
  currentPage: Page;
}

const pageConfig: Record<Page, { icon: React.ReactNode; gradient: string }> = {
  dashboard: { icon: <span className="text-xl">🏠</span>, gradient: 'from-blue-500/20' },
  'ai-assistant': { icon: <span className="text-xl">🤖</span>, gradient: 'from-purple-500/20' },
  stains: { icon: <span className="text-xl">🔬</span>, gradient: 'from-red-500/20' },
  chemicals: { icon: <span className="text-xl">⚗️</span>, gradient: 'from-green-500/20' },
  'care-labels': { icon: <span className="text-xl">🏷️</span>, gradient: 'from-cyan-500/20' },
  'price-list': { icon: <span className="text-xl">💰</span>, gradient: 'from-gold-500/20' },
  employees: { icon: <span className="text-xl">👥</span>, gradient: 'from-indigo-500/20' },
  shifts: { icon: <span className="text-xl">📅</span>, gradient: 'from-orange-500/20' },
  reports: { icon: <span className="text-xl">📊</span>, gradient: 'from-emerald-500/20' },
  settings: { icon: <span className="text-xl">⚙️</span>, gradient: 'from-slate-500/20' },
};

export default function Header({ currentPage }: HeaderProps) {
  const { language, setLanguage } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const timeStr = now.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <header className="glass border-b border-gold-500/15 px-6 py-4 flex items-center justify-between sticky top-0 z-30 animate-fade-in">
      {/* Left side - Page title */}
      <div className="flex items-center gap-4">
        <div className={`relative p-3 rounded-xl bg-gradient-to-br ${pageConfig[currentPage].gradient} border border-white/10`}>
          {pageConfig[currentPage].icon}
          <div className="absolute inset-0 bg-gold-500/10 rounded-xl blur-xl opacity-50" />
        </div>
        <div>
          <h1 className="font-semibold text-white text-lg leading-tight flex items-center gap-2">
            {t(language, currentPage.replace('-', '') as any)}
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{dateStr}</span>
            <span className="w-1 h-1 rounded-full bg-gold-500/50" />
            <span className="text-gold-400/70 font-mono">{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Online status */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
          isOnline
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/15 text-red-400 border border-red-500/20'
        }`}>
          {isOnline ? (
            <Wifi size={14} className="animate-pulse" />
          ) : (
            <WifiOff size={14} />
          )}
          <span className="hidden sm:inline">
            {isOnline
              ? (language === 'ar' ? 'متصل' : 'Online')
              : (language === 'ar' ? 'غير متصل' : 'Offline')
            }
          </span>
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium
            text-gold-400 hover:text-white hover:bg-gold-500/20 hover:border-gold-500/40
            transition-all duration-300 group"
        >
          <Globe size={14} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">{language === 'ar' ? 'EN' : 'عر'}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-3 glass rounded-xl text-white/60 hover:text-gold-400 hover:bg-gold-500/10 transition-all duration-300 group">
          <Bell size={16} className="group-hover:animate-wiggle" />
          <span className="absolute top-2 end-2 w-2.5 h-2.5 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
        </button>

        {/* User avatar */}
        <div className="relative group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 flex items-center justify-center text-sm font-bold text-black shadow-lg shadow-gold-500/20 transition-transform group-hover:scale-105">
            <Sparkles size={18} />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gold-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </header>
  );
}
