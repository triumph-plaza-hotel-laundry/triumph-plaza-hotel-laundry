import React, { useState } from 'react';
import { Tag, Shirt } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import { careSymbols, fabricsData } from '../data/careLabels';

const CATEGORY_COLORS: Record<string, string> = {
  washing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  drying: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  ironing: 'bg-red-500/20 text-red-400 border-red-500/30',
  bleaching: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  dry_cleaning: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

type Tab = 'symbols' | 'fabrics';

export default function CareLabelsPage() {
  const { language } = useApp();
  const [tab, setTab] = useState<Tab>('symbols');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFabric, setExpandedFabric] = useState<string | null>(null);

  const filteredSymbols = selectedCategory === 'all'
    ? careSymbols
    : careSymbols.filter(s => s.category === selectedCategory);

  const categories = ['all', 'washing', 'drying', 'ironing', 'bleaching', 'dry_cleaning'];
  const categoryLabels: Record<string, { ar: string; en: string }> = {
    all: { ar: 'الكل', en: 'All' },
    washing: { ar: 'الغسيل', en: 'Washing' },
    drying: { ar: 'التجفيف', en: 'Drying' },
    ironing: { ar: 'الكوي', en: 'Ironing' },
    bleaching: { ar: 'التبييض', en: 'Bleaching' },
    dry_cleaning: { ar: 'التنظيف الجاف', en: 'Dry Cleaning' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold-500/20 rounded-xl">
            <Tag size={24} className="text-gold-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'careLabels')}</h1>
            <p className="text-sm text-white/40">
              {language === 'ar' ? 'دليل شامل لرموز العناية بالأقمشة' : 'Complete guide to fabric care symbols'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {(['symbols', 'fabrics'] as Tab[]).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === tabKey ? 'bg-gold-500/30 text-gold-400' : 'text-white/50 hover:text-white'
            }`}
          >
            {tabKey === 'symbols'
              ? (language === 'ar' ? 'رموز العناية' : 'Care Symbols')
              : (language === 'ar' ? 'أنواع الأقمشة' : 'Fabric Types')
            }
          </button>
        ))}
      </div>

      {tab === 'symbols' && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                  selectedCategory === cat
                    ? 'bg-gold-500/30 text-gold-400 border-gold-500/50'
                    : cat !== 'all' && CATEGORY_COLORS[cat]
                    ? `${CATEGORY_COLORS[cat]} opacity-70 hover:opacity-100`
                    : 'glass text-white/50 border-white/10 hover:text-white/80'
                }`}
              >
                {language === 'ar' ? categoryLabels[cat].ar : categoryLabels[cat].en}
              </button>
            ))}
          </div>

          {/* Symbols grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSymbols.map(symbol => (
              <div key={symbol.id} className="luxury-card p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl">
                  {symbol.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-white text-sm">
                      {language === 'ar' ? symbol.name_ar : symbol.name}
                    </span>
                    <span className={`status-badge border text-[10px] ${CATEGORY_COLORS[symbol.category]}`}>
                      {language === 'ar' ? categoryLabels[symbol.category].ar : categoryLabels[symbol.category].en}
                    </span>
                  </div>
                  <p className="text-xs text-white/55 leading-relaxed">
                    {language === 'ar' ? symbol.description_ar : symbol.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'fabrics' && (
        <div className="space-y-3">
          {fabricsData.map(fabric => (
            <div key={fabric.id} className="luxury-card overflow-hidden">
              <button
                className="w-full p-4 text-start flex items-center gap-4"
                onClick={() => setExpandedFabric(expandedFabric === fabric.id ? null : fabric.id)}
              >
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xl flex-shrink-0">
                  {fabric.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {language === 'ar' ? fabric.name_ar : fabric.name}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {language === 'ar' ? fabric.composition_ar : fabric.composition}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">
                    {language === 'ar' ? `حد أقصى ${fabric.maxTemp}°C` : `Max ${fabric.maxTemp}°C`}
                  </span>
                  <div className="text-white/30 text-xs">
                    {expandedFabric === fabric.id ? '▲' : '▼'}
                  </div>
                </div>
              </button>

              {expandedFabric === fabric.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: 'washing', icon: '🫧', label_ar: 'الغسيل', label_en: 'Washing' },
                      { key: 'drying', icon: '💨', label_ar: 'التجفيف', label_en: 'Drying' },
                      { key: 'ironing', icon: '♨️', label_ar: 'الكوي', label_en: 'Ironing' },
                      { key: 'folding', icon: '📐', label_ar: 'الطي', label_en: 'Folding' },
                      { key: 'storage', icon: '📦', label_ar: 'التخزين', label_en: 'Storage' },
                    ].map(({ key, icon, label_ar, label_en }) => (
                      <div key={key}>
                        <div className="text-xs font-medium text-gold-400 mb-1">{icon} {language === 'ar' ? label_ar : label_en}</div>
                        <p className="text-sm text-white/70 leading-relaxed">
                          {language === 'ar' ? (fabric as any)[`${key}_ar`] : (fabric as any)[key]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
