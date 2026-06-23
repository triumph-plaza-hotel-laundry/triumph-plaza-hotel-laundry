import React, { useState, useEffect } from 'react';
import { Settings, Building2, Globe, Palette, Database, Download, Upload, RotateCcw, Check, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';

type Tab = 'hotel' | 'language' | 'backup';

interface HotelInfo {
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  email: string;
  website: string;
}

const DEFAULT_HOTEL: HotelInfo = {
  name: 'Triumph Plaza Hotel',
  name_ar: 'فندق تريومف بلازا',
  address: 'Riyadh, Kingdom of Saudi Arabia',
  address_ar: 'الرياض، المملكة العربية السعودية',
  phone: '+966 11 000 0000',
  email: 'info@triumphplaza.sa',
  website: 'www.triumphplaza.sa',
};

export default function SettingsPage() {
  const { language, setLanguage } = useApp();
  const [tab, setTab] = useState<Tab>('hotel');
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(DEFAULT_HOTEL);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('app_settings').select('key, value');
      if (data) {
        const settings: Record<string, string> = {};
        data.forEach(s => { settings[s.key] = s.value; });
        if (settings.hotel_info) {
          try {
            setHotelInfo(JSON.parse(settings.hotel_info));
          } catch { /* use default */ }
        }
      }
    };
    loadSettings();
  }, []);

  const saveHotelInfo = async () => {
    setSaving(true);
    const value = JSON.stringify(hotelInfo);
    await supabase.from('app_settings').upsert({ key: 'hotel_info', value });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const [employees, shifts, priceLists, orders, vacations] = await Promise.all([
        supabase.from('employees').select('*'),
        supabase.from('shifts').select('*'),
        supabase.from('price_lists').select('*'),
        supabase.from('laundry_orders').select('*'),
        supabase.from('vacations').select('*'),
      ]);

      const backup = {
        version: '1.0',
        date: new Date().toISOString(),
        data: {
          employees: employees.data ?? [],
          shifts: shifts.data ?? [],
          price_lists: priceLists.data ?? [],
          laundry_orders: orders.data ?? [],
          vacations: vacations.data ?? [],
          hotel_info: hotelInfo,
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `triumph-plaza-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
    setExporting(false);
  };

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.data) throw new Error('Invalid backup file');

      const { data } = backup;

      if (data.employees?.length) {
        await supabase.from('employees').upsert(data.employees);
      }
      if (data.shifts?.length) {
        await supabase.from('shifts').upsert(data.shifts);
      }
      if (data.price_lists?.length) {
        await supabase.from('price_lists').upsert(data.price_lists);
      }
      if (data.laundry_orders?.length) {
        await supabase.from('laundry_orders').upsert(data.laundry_orders);
      }
      if (data.vacations?.length) {
        await supabase.from('vacations').upsert(data.vacations);
      }
      if (data.hotel_info) {
        setHotelInfo(data.hotel_info);
        await supabase.from('app_settings').upsert({ key: 'hotel_info', value: JSON.stringify(data.hotel_info) });
      }

      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err: any) {
      setImportError(err.message || 'Failed to import backup');
    }

    setImporting(false);
    e.target.value = '';
  };

  const resetSettings = async () => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من إعادة تعيين جميع الإعدادات؟' : 'Reset all settings to default?')) return;
    setHotelInfo(DEFAULT_HOTEL);
    await supabase.from('app_settings').upsert({ key: 'hotel_info', value: JSON.stringify(DEFAULT_HOTEL) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabItems: { key: Tab; icon: React.ReactNode; label: { ar: string; en: string } }[] = [
    { key: 'hotel', icon: <Building2 size={16} />, label: { ar: 'معلومات الفندق', en: 'Hotel Info' } },
    { key: 'language', icon: <Globe size={16} />, label: { ar: 'اللغة', en: 'Language' } },
    { key: 'backup', icon: <Database size={16} />, label: { ar: 'النسخ الاحتياطي', en: 'Backup' } },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-slate-500/10 via-transparent to-slate-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-500/20 rounded-xl">
            <Settings size={24} className="text-slate-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'settings')}</h1>
            <p className="text-sm text-white/40">{language === 'ar' ? 'إعدادات التطبيق والفندق' : 'App and hotel settings'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {tabItems.map(tabItem => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === tabItem.key ? 'bg-gold-500/30 text-gold-400' : 'text-white/50 hover:text-white'
            }`}
          >
            {tabItem.icon}
            {language === 'ar' ? tabItem.label.ar : tabItem.label.en}
          </button>
        ))}
      </div>

      {/* Hotel Info Tab */}
      {tab === 'hotel' && (
        <div className="luxury-card p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Building2 size={18} className="text-gold-400" />
            {language === 'ar' ? 'معلومات الفندق' : 'Hotel Information'}
          </h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'اسم الفندق (إنجليزي)' : 'Hotel Name (English)'}</label>
              <input
                type="text"
                value={hotelInfo.name}
                onChange={e => setHotelInfo(p => ({ ...p, name: e.target.value }))}
                className="luxury-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'اسم الفندق (عربي)' : 'Hotel Name (Arabic)'}</label>
              <input
                type="text"
                value={hotelInfo.name_ar}
                onChange={e => setHotelInfo(p => ({ ...p, name_ar: e.target.value }))}
                className="luxury-input text-sm"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'العنوان (إنجليزي)' : 'Address (English)'}</label>
              <input
                type="text"
                value={hotelInfo.address}
                onChange={e => setHotelInfo(p => ({ ...p, address: e.target.value }))}
                className="luxury-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'العنوان (عربي)' : 'Address (Arabic)'}</label>
              <input
                type="text"
                value={hotelInfo.address_ar}
                onChange={e => setHotelInfo(p => ({ ...p, address_ar: e.target.value }))}
                className="luxury-input text-sm"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(language, 'phone')}</label>
              <input
                type="tel"
                value={hotelInfo.phone}
                onChange={e => setHotelInfo(p => ({ ...p, phone: e.target.value }))}
                className="luxury-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(language, 'email')}</label>
              <input
                type="email"
                value={hotelInfo.email}
                onChange={e => setHotelInfo(p => ({ ...p, email: e.target.value }))}
                className="luxury-input text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</label>
              <input
                type="text"
                value={hotelInfo.website}
                onChange={e => setHotelInfo(p => ({ ...p, website: e.target.value }))}
                className="luxury-input text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={saveHotelInfo} disabled={saving} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <Check size={14} />
              ) : null}
              {saved ? t(language, 'saved') : t(language, 'save')}
            </button>
            <button onClick={resetSettings} className="btn-ghost flex items-center gap-2 text-sm px-4 py-2">
              <RotateCcw size={14} />
              {language === 'ar' ? 'استعادة الافتراضي' : 'Reset to Default'}
            </button>
          </div>
        </div>
      )}

      {/* Language Tab */}
      {tab === 'language' && (
        <div className="luxury-card p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Globe size={18} className="text-gold-400" />
            {language === 'ar' ? 'إعدادات اللغة' : 'Language Settings'}
          </h3>

          <div className="space-y-4">
            <p className="text-sm text-white/60">
              {language === 'ar'
                ? 'اختر لغة واجهة التطبيق. تدعم التطبيق اللغة العربية والإنجليزية.'
                : 'Select the interface language. The app supports Arabic and English.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setLanguage('ar')}
                className={`p-5 rounded-xl border transition-all text-start ${
                  language === 'ar'
                    ? 'bg-gold-500/20 border-gold-500/50'
                    : 'glass border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-2">🇸🇦</div>
                <div className="font-semibold text-white mb-1">العربية</div>
                <div className="text-xs text-white/50">Arabic - اللغة الأصلية</div>
                {language === 'ar' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gold-400">
                    <Check size={12} /> {language === 'ar' ? 'محدد' : 'Selected'}
                  </div>
                )}
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`p-5 rounded-xl border transition-all text-start ${
                  language === 'en'
                    ? 'bg-gold-500/20 border-gold-500/50'
                    : 'glass border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-2">🇬🇧</div>
                <div className="font-semibold text-white mb-1">English</div>
                <div className="text-xs text-white/50">الإنجليزية - Secondary</div>
                {language === 'en' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gold-400">
                    <Check size={12} /> {language === 'ar' ? 'محدد' : 'Selected'}
                  </div>
                )}
              </button>
            </div>

            <div className="mt-4 p-4 glass rounded-lg flex items-start gap-3">
              <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/50">
                {language === 'ar'
                  ? 'سيتم حفظ تفضيلات اللغة تلقائياً وسيتم تطبيقها في كل مرة تقوم فيها بتسجيل الدخول.'
                  : 'Language preference is saved automatically and applied every time you log in.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backup Tab */}
      {tab === 'backup' && (
        <div className="luxury-card p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Database size={18} className="text-gold-400" />
            {language === 'ar' ? 'النسخ الاحتياطي والاستعادة' : 'Backup and Restore'}
          </h3>

          <div className="space-y-6">
            {/* Export */}
            <div className="p-5 glass rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Download size={20} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
                  </h4>
                  <p className="text-sm text-white/50 mb-4">
                    {language === 'ar'
                      ? 'قم بتصدير جميع البيانات (الموظفين، الورديات، قوائم الأسعار، الطلبات) إلى ملف JSON'
                      : 'Export all data (employees, shifts, price lists, orders) to a JSON file'}
                  </p>
                  <button onClick={exportData} disabled={exporting} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
                    {exporting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    {language === 'ar' ? 'تصدير النسخة الاحتياطية' : 'Export Backup'}
                  </button>
                </div>
              </div>
            </div>

            {/* Import */}
            <div className="p-5 glass rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Upload size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {language === 'ar' ? 'استيراد البيانات' : 'Import Data'}
                  </h4>
                  <p className="text-sm text-white/50 mb-4">
                    {language === 'ar'
                      ? 'قم باستيراد ملف نسخة احتياطية سابقة. سيتم استبدال البيانات الحالية.'
                      : 'Import a previous backup file. Current data will be replaced.'}
                  </p>

                  <label className="btn-ghost flex items-center gap-2 text-sm px-4 py-2 w-fit cursor-pointer">
                    {importing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {language === 'ar' ? 'استيراد النسخة الاحتياطية' : 'Import Backup'}
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                      disabled={importing}
                    />
                  </label>

                  {importError && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle size={14} />
                      {importError}
                    </div>
                  )}

                  {importSuccess && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-sm text-green-400">
                      <Check size={14} />
                      {language === 'ar' ? 'تم استيراد البيانات بنجاح' : 'Data imported successfully'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-400/80">
                <strong>{language === 'ar' ? 'تنبيه:' : 'Warning:'}</strong>{' '}
                {language === 'ar'
                  ? 'استيراد نسخة احتياطية سيستبدل جميع البيانات الحالية. تأكد من تصدير نسخة احتياطية قبل الاستيراد.'
                  : 'Importing a backup will replace all current data. Make sure to export a backup before importing.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
