import React, { useState, useMemo } from 'react';
import { Search, Droplets, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import stains from '../data/stains';
import type { Stain } from '../types';

const DIFFICULTY_CONFIG = {
  easy: { label_ar: 'سهل', label_en: 'Easy', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  medium: { label_ar: 'متوسط', label_en: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  hard: { label_ar: 'صعب', label_en: 'Hard', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  very_hard: { label_ar: 'صعب جداً', label_en: 'Very Hard', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

function StainCard({ stain, lang }: { stain: Stain; lang: 'ar' | 'en' }) {
  const [expanded, setExpanded] = useState(false);
  const diff = DIFFICULTY_CONFIG[stain.difficulty];

  return (
    <div className="luxury-card overflow-hidden">
      <button
        className="w-full p-4 text-start flex items-start justify-between gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-white">{lang === 'ar' ? stain.name_ar : stain.name}</span>
            <span className={`status-badge border ${diff.color}`}>
              {lang === 'ar' ? diff.label_ar : diff.label_en}
            </span>
          </div>
          <span className="text-xs text-white/40">{lang === 'ar' ? stain.category_ar : stain.category}</span>
        </div>
        <div className="flex-shrink-0 text-white/30">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          <div>
            <div className="text-xs font-medium text-gold-400 mb-1">{t(lang, 'cause')}</div>
            <p className="text-sm text-white/70">{lang === 'ar' ? stain.cause_ar : stain.cause}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gold-400 mb-1">{t(lang, 'removalMethod')}</div>
            <p className="text-sm text-white/70 leading-relaxed">{lang === 'ar' ? stain.removalMethod_ar : stain.removalMethod}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gold-400 mb-1">{t(lang, 'recommendedChemicals')}</div>
            <div className="flex flex-wrap gap-1">
              {(lang === 'ar' ? stain.chemicals_ar : stain.chemicals).map(c => (
                <span key={c} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">{c}</span>
              ))}
            </div>
          </div>
          {stain.warnings && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-xs font-medium text-red-400 mb-1">⚠️ {t(lang, 'warnings')}</div>
              <p className="text-xs text-red-300/80">{lang === 'ar' ? stain.warnings_ar : stain.warnings}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StainsPage() {
  const { language } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(stains.map(s => language === 'ar' ? s.category_ar : s.category));
    return ['all', ...Array.from(cats)];
  }, [language]);

  const filtered = useMemo(() => {
    return stains.filter(s => {
      const name = language === 'ar' ? s.name_ar : s.name;
      const cat = language === 'ar' ? s.category_ar : s.category;
      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || cat.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || cat === selectedCategory;
      const matchDiff = selectedDifficulty === 'all' || s.difficulty === selectedDifficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [search, selectedCategory, selectedDifficulty, language]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Droplets size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'stains')}</h1>
            <p className="text-sm text-white/40">
              {stains.length} {language === 'ar' ? 'نوع بقعة مسجل' : 'stain types in database'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="luxury-card p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن نوع البقعة...' : 'Search stain type...'}
            className="luxury-input ps-10"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Category filter */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Filter size={12} className="text-white/40" />
              <span className="text-xs text-white/40">{language === 'ar' ? 'التصنيف' : 'Category'}</span>
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="luxury-input text-sm"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-marble-800">
                  {c === 'all' ? (language === 'ar' ? 'الكل' : 'All') : c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Filter size={12} className="text-white/40" />
              <span className="text-xs text-white/40">{t(language, 'difficulty')}</span>
            </div>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="luxury-input text-sm"
            >
              <option value="all" className="bg-marble-800">{t(language, 'all')}</option>
              <option value="easy" className="bg-marble-800">{t(language, 'easy')}</option>
              <option value="medium" className="bg-marble-800">{t(language, 'medium')}</option>
              <option value="hard" className="bg-marble-800">{t(language, 'hard')}</option>
              <option value="very_hard" className="bg-marble-800">{t(language, 'veryHard')}</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-white/40">
          {filtered.length} {language === 'ar' ? 'نتيجة' : 'results'}
        </div>
      </div>

      {/* Stains list */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map(stain => (
          <StainCard key={stain.id} stain={stain} lang={language} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <Droplets size={48} className="mx-auto mb-3 opacity-30" />
          <p>{t(language, 'noData')}</p>
        </div>
      )}
    </div>
  );
}
