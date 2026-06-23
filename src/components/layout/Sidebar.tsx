import React, { useState } from 'react';
import {
  LayoutDashboard, Bot, Droplets, FlaskConical, Tag, DollarSign,
  Users, Calendar, BarChart3, Settings, X, Menu, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../lib/i18n';
import type { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; icon: React.ComponentType<{ size?: number; className?: string }>; key: string; gradient: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, key: 'dashboard', gradient: 'from-blue-500/20' },
  { page: 'ai-assistant', icon: Bot, key: 'aiAssistant', gradient: 'from-purple-500/20' },
  { page: 'stains', icon: Droplets, key: 'stains', gradient: 'from-red-500/20' },
  { page: 'chemicals', icon: FlaskConical, key: 'chemicals', gradient: 'from-green-500/20' },
  { page: 'care-labels', icon: Tag, key: 'careLabels', gradient: 'from-cyan-500/20' },
  { page: 'price-list', icon: DollarSign, key: 'priceList', gradient: 'from-gold-500/20' },
  { page: 'employees', icon: Users, key: 'employees', gradient: 'from-indigo-500/20' },
  { page: 'shifts', icon: Calendar, key: 'shifts', gradient: 'from-orange-500/20' },
  { page: 'reports', icon: BarChart3, key: 'reports', gradient: 'from-emerald-500/20' },
  { page: 'settings', icon: Settings, key: 'settings', gradient: 'from-slate-500/20' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { language, isRTL } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-4 p-5 mb-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gold-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src="/assets/images/1000407416 copy.png"
            alt="Logo"
            className={`object-contain relative z-10 transition-all duration-300 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
            style={{ filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.5))' }}
          />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <div className="gradient-text-gold font-bold text-base leading-tight tracking-wide">TRIUMPH PLAZA</div>
            <div className="text-xs text-gold-400/60 leading-tight flex items-center gap-1 mt-0.5">
              <Sparkles size={10} />
              {language === 'ar' ? 'نظام المغسلة' : 'Laundry System'}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 mb-5 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(({ page, icon: Icon, key, gradient }, index) => (
          <button
            key={page}
            onClick={() => handleNavClick(page)}
            className={`sidebar-item w-full text-start group animate-slide-in ${currentPage === page ? 'active bg-gradient-to-r ' + gradient : ''} ${collapsed ? 'justify-center' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
            title={collapsed ? t(language, key as any) : undefined}
          >
            <div className={`transition-all duration-300 ${currentPage === page ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
              <Icon size={18} className="flex-shrink-0" />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium transition-colors">{t(language, key as any)}</span>
            )}
            {currentPage === page && !collapsed && (
              <div className="ms-auto w-1.5 h-1.5 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-5 mt-auto">
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-4" />

        {/* App version */}
        {!collapsed && (
          <div className="px-3 py-2 mb-3 text-center animate-fade-in">
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Version 1.0</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 start-4 z-50 p-3 glass rounded-xl text-gold-400 hover:scale-105 transition-all animate-fade-in"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 z-50
        bg-gradient-to-b from-marble-950 via-marble-900 to-marble-950
        border-${isRTL ? 'l' : 'r'} border-gold-500/20
        transform transition-all duration-500 ease-out
        ${mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 end-4 p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col h-full transition-all duration-500 ease-out relative
        bg-gradient-to-b from-marble-950 via-marble-900/95 to-marble-950
        border-${isRTL ? 'l' : 'r'} border-gold-500/15
        ${collapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-24 ${isRTL ? '-left-3' : '-right-3'} z-20
            w-7 h-7 rounded-full bg-marble-900 border border-gold-500/40
            flex items-center justify-center text-gold-400 hover:bg-gold-500/20 hover:border-gold-500/60
            shadow-lg transition-all duration-300 hover:scale-110`}
        >
          {isRTL
            ? (collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />)
            : (collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />)
          }
        </button>

        <SidebarContent />
      </div>
    </>
  );
}
