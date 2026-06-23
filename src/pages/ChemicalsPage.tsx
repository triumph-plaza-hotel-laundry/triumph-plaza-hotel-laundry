import React, { useState, useMemo } from 'react';
import { Search, FlaskConical, ChevronDown, ChevronUp, AlertTriangle, Check, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import chemicals from '../data/chemicals';
import type { Chemical } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'Detergent': 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  'منظف': 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  'Bleach': 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  'تبييض': 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  'Oxygen Bleach': 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  'تبييض أكسجين': 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  'Softener': 'text-pink-400 bg-pink-500/15 border-pink-500/30',
  'منعم': 'text-pink-400 bg-pink-500/15 border-pink-500/30',
  'Spotter': 'text-orange-400 bg-orange-500/15 border-orange-500/30',
  'مزيل بقع': 'text-orange-400 bg-orange-500/15 border-orange-500/30',
  'Neutralizer': 'text-green-400 bg-green-500/15 border-green-500/30',
  'معادل': 'text-green-400 bg-green-500/15 border-green-500/30',
  'Disinfectant': 'text-red-400 bg-red-500/15 border-red-500/30',
  'مطهر': 'text-red-400 bg-red-500/15 border-red-500/30',
  'Dry Cleaning': 'text-purple-400 bg-purple-500/15 border-purple-500/30',
  'تنظيف جاف': 'text-purple-400 bg-purple-500/15 border-purple-500/30',
  'Finishing': 'text-gold-400 bg-gold-500/15 border-gold-500/30',
  'تشطيب': 'text-gold-400 bg-gold-500/15 border-gold-500/30',
  'Detergent Booster': 'text-teal-400 bg-teal-500/15 border-teal-500/30',
  'معزز منظف': 'text-teal-400 bg-teal-500/15 border-teal-500/30',
};

function ChemicalCard({ chemical, lang }: { chemical: Chemical; lang: 'ar' | 'en' }) {
  const [expanded, setExpanded] = useState(false);
  const catKey = lang === 'ar' ? chemical.category_ar : chemical.category;
  const catColor = CATEGORY_COLORS[catKey] ?? 'text-white/50 bg-white/5 border-white/10';

  return (
    <div className="luxury-card overflow-hidden">
      <button
        className="w-full p-4 text-start flex items-start justify-between gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-white">{lang === 'ar' ? chemical.name_ar : chemical.name}</span>
            <span className={`status-badge border ${catColor}`}>{catKey}</span>
          </div>
          <p className="text-xs text-white/40 line-clamp-1">
            {lang === 'ar' ? chemical.description_ar : chemical.description}
          </p>
        </div>
        <div className="flex-shrink-0 text-white/30">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-3">
          <div>
            <p className="text-sm text-white/70">{lang === 'ar' ? chemical.description_ar : chemical.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gold-400 mb-2">{t(lang, 'usage')}</div>
              <p className="text-sm text-white/70 leading-relaxed">{lang === 'ar' ? chemical.usage_ar : chemical.usage}</p>
            </div>

            {chemical.dilution && (
              <div>
                <div className="text-xs font-medium text-gold-400 mb-2">{t(lang, 'dilution')}</div>
                <p className="text-sm text-white/70">{lang === 'ar' ? chemical.dilution_ar : chemical.dilution}</p>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-green-400 mb-2 flex items-center gap-1">
                <Check size={12} /> {t(lang, 'compatibleFabrics')}
              </div>
              <div className="flex flex-wrap gap-1">
                {chemical.compatibleFabrics.map(f => (
                  <span key={f} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400">{f}</span>
                ))}
              </div>
            </div>

            {chemical.incompatibleFabrics.length > 0 && (
              <div>
                <div className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
                  <X size={12} /> {t(lang, 'incompatibleFabrics')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {chemical.incompatibleFabrics.map(f => (
                    <span key={f} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-400">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="text-xs font-medium text-amber-400 mb-1 flex items-center gap-1">
              <AlertTriangle size={12} /> {t(lang, 'safetyInstructions')}
            </div>
            <p className="text-xs text-amber-300/80">{lang === 'ar' ? chemical.safetyInstructions_ar : chemical.safetyInstructions}</p>
          </div>

          {chemical.warnings && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-xs font-medium text-red-400 mb-1 flex items-center gap-1">
                ⚠️ {t(lang, 'warnings')}
              </div>
              <p className="text-xs text-red-300/80">{lang === 'ar' ? chemical.warnings_ar : chemical.warnings}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChemicalsPage() {
  const { language } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(chemicals.map(c => language === 'ar' ? c.category_ar : c.category));
    return ['all', ...Array.from(cats)];
  }, [language]);

  const filtered = useMemo(() => {
    return chemicals.filter(c => {
      const name = language === 'ar' ? c.name_ar : c.name;
      const cat = language === 'ar' ? c.category_ar : c.category;
      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || cat === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory, language]);

  return (
    <div className="space-y-6">
      <div className="luxury-card p-5 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <FlaskConical size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'chemicals')}</h1>
            <p className="text-sm text-white/40">
              {chemicals.length} {language === 'ar' ? 'مادة كيميائية مسجلة' : 'chemicals in database'}
            </p>
          </div>
        </div>
      </div>

      <div className="luxury-card p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن مادة كيميائية...' : 'Search chemical...'}
            className="luxury-input ps-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500/30 text-gold-400 border border-gold-500/50'
                  : 'glass text-white/50 hover:text-white/80'
              }`}
            >
              {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map(chem => (
          <ChemicalCard key={chem.id} chemical={chem} lang={language} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <FlaskConical size={48} className="mx-auto mb-3 opacity-30" />
          <p>{t(language, 'noData')}</p>
        </div>
      )}
    </div>
  );
}
