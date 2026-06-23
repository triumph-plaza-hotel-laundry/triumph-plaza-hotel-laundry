import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Plus, Pencil, Trash2, Check, X, RefreshCw, Search, Printer, FileSpreadsheet, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import type { PriceListItem, PriceListCategory } from '../types';

const PRICE_ITEMS_DATA = [
  { item_name: 'Shirt', item_name_ar: 'قميص', washing_price: 15, dry_cleaning_price: 25, pressing_price: 10 },
  { item_name: 'Blouse', item_name_ar: 'بلوزة', washing_price: 18, dry_cleaning_price: 30, pressing_price: 12 },
  { item_name: 'Trousers', item_name_ar: 'بنطلون', washing_price: 20, dry_cleaning_price: 35, pressing_price: 15 },
  { item_name: 'Shorts', item_name_ar: 'شورت', washing_price: 12, dry_cleaning_price: 20, pressing_price: 8 },
  { item_name: 'Jacket', item_name_ar: 'جاكيت', washing_price: 35, dry_cleaning_price: 55, pressing_price: 20 },
  { item_name: 'Pullover', item_name_ar: 'سترة صوف', washing_price: 25, dry_cleaning_price: 40, pressing_price: 15 },
  { item_name: 'Sweatshirt', item_name_ar: 'هودي', washing_price: 22, dry_cleaning_price: 35, pressing_price: 12 },
  { item_name: 'Galabeya', item_name_ar: 'جلابية', washing_price: 25, dry_cleaning_price: 45, pressing_price: 18 },
  { item_name: 'Abaya', item_name_ar: 'عباءة', washing_price: 40, dry_cleaning_price: 70, pressing_price: 25 },
  { item_name: 'Pajamas', item_name_ar: 'بيجامة', washing_price: 18, dry_cleaning_price: 30, pressing_price: 10 },
  { item_name: 'Suit (2 pieces)', item_name_ar: 'بدلة (قطعتين)', washing_price: 50, dry_cleaning_price: 80, pressing_price: 30 },
  { item_name: 'Coat', item_name_ar: 'معطف', washing_price: 45, dry_cleaning_price: 75, pressing_price: 25 },
  { item_name: 'Underwear', item_name_ar: 'ملابس داخلية', washing_price: 8, dry_cleaning_price: 15, pressing_price: 5 },
  { item_name: 'Undershirt', item_name_ar: 'فانلة', washing_price: 10, dry_cleaning_price: 18, pressing_price: 6 },
  { item_name: 'Bra', item_name_ar: 'حمالة صدر', washing_price: 15, dry_cleaning_price: 25, pressing_price: 10 },
  { item_name: 'Socks (pair)', item_name_ar: 'جوارب (زوج)', washing_price: 8, dry_cleaning_price: 12, pressing_price: 5 },
  { item_name: 'Ghutra', item_name_ar: 'غطرة', washing_price: 15, dry_cleaning_price: 25, pressing_price: 12 },
  { item_name: 'Hijab', item_name_ar: 'حجاب', washing_price: 12, dry_cleaning_price: 20, pressing_price: 10 },
  { item_name: 'Scarf', item_name_ar: 'وشاح', washing_price: 15, dry_cleaning_price: 25, pressing_price: 12 },
  { item_name: 'Handkerchief', item_name_ar: 'منديل', washing_price: 8, dry_cleaning_price: 12, pressing_price: 5 },
  { item_name: 'Tie', item_name_ar: 'ربطة عنق', washing_price: 10, dry_cleaning_price: 20, pressing_price: 8 },
  { item_name: 'Bed Sheet', item_name_ar: 'ملاءات سرير', washing_price: 25, dry_cleaning_price: 40, pressing_price: 15 },
  { item_name: 'Pillow Case', item_name_ar: 'غطاء وسادة', washing_price: 12, dry_cleaning_price: 20, pressing_price: 8 },
  { item_name: 'Bath Towel', item_name_ar: 'منشفة استحمام', washing_price: 15, dry_cleaning_price: 25, pressing_price: 10 },
  { item_name: 'Face Towel', item_name_ar: 'منشفة وجه', washing_price: 10, dry_cleaning_price: 15, pressing_price: 6 },
  { item_name: 'Blanket', item_name_ar: 'بطانية', washing_price: 50, dry_cleaning_price: 90, pressing_price: 35 },
  { item_name: 'Large Duvet', item_name_ar: 'لحاف كبير', washing_price: 80, dry_cleaning_price: 150, pressing_price: 50 },
  { item_name: 'Small Duvet', item_name_ar: 'لحاف صغير', washing_price: 60, dry_cleaning_price: 110, pressing_price: 40 },
  { item_name: 'Curtain (per panel)', item_name_ar: 'ستارة (للوحة)', washing_price: 40, dry_cleaning_price: 70, pressing_price: 25 },
  { item_name: 'Hanger (returned)', item_name_ar: 'شماع (مسترجع)', washing_price: 2, dry_cleaning_price: 3, pressing_price: 1 },
];

export default function PriceListPage() {
  const { language } = useApp();
  const [items, setItems] = useState<PriceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PriceListCategory>('guest');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PriceListItem>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: '',
    item_name_ar: '',
    washing_price: 0,
    dry_cleaning_price: 0,
    pressing_price: 0,
  });

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('price_lists').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const initializeData = async () => {
    setSaving(true);
    const existing = await supabase.from('price_lists').select('id').limit(1);
    if ((existing.data?.length ?? 0) === 0) {
      const guestItems = PRICE_ITEMS_DATA.map((item, idx) => ({
        ...item,
        category: 'guest' as PriceListCategory,
        currency: 'SAR',
        is_active: true,
        sort_order: idx + 1,
      }));
      const outsideItems = PRICE_ITEMS_DATA.map((item, idx) => ({
        ...item,
        category: 'outside' as PriceListCategory,
        currency: 'SAR',
        is_active: true,
        sort_order: idx + 1,
        washing_price: Math.ceil(item.washing_price * 1.3),
        dry_cleaning_price: Math.ceil(item.dry_cleaning_price * 1.3),
        pressing_price: Math.ceil(item.pressing_price * 1.3),
      }));
      await supabase.from('price_lists').insert([
        ...guestItems.map(i => ({ ...i, washing_price: i.washing_price, dry_cleaning_price: i.dry_cleaning_price, pressing_price: i.pressing_price })),
        ...outsideItems.map(i => ({ ...i }))
      ]);
      fetchItems();
    }
    setSaving(false);
  };

  if (items.length === 0 && !loading && !saving) {
    initializeData();
  }

  const filtered = items.filter(i =>
    i.category === selectedCategory &&
    (!search || i.item_name.toLowerCase().includes(search.toLowerCase()) || i.item_name_ar?.includes(search))
  );

  const addItem = async () => {
    if (!newItem.item_name) return;
    setSaving(true);
    const maxOrder = Math.max(0, ...items.filter(i => i.category === selectedCategory).map(i => i.sort_order || 0));
    await supabase.from('price_lists').insert({
      ...newItem,
      category: selectedCategory,
      currency: 'SAR',
      is_active: true,
      sort_order: maxOrder + 1,
    });
    setShowAddModal(false);
    setNewItem({ item_name: '', item_name_ar: '', washing_price: 0, dry_cleaning_price: 0, pressing_price: 0 });
    fetchItems();
    setSaving(false);
  };

  const updateItem = async () => {
    if (!editingId) return;
    setSaving(true);
    await supabase.from('price_lists').update({
      ...editData,
      updated_at: new Date().toISOString(),
    }).eq('id', editingId);
    setEditingId(null);
    setEditData({});
    fetchItems();
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Delete this item?')) return;
    await supabase.from('price_lists').delete().eq('id', id);
    fetchItems();
  };

  const startEdit = (item: PriceListItem) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToCSV = () => {
    const headers = ['Item', 'Item (AR)', 'Washing', 'Dry Cleaning', 'Pressing', 'Currency'];
    const rows = filtered.map(item => [
      item.item_name,
      item.item_name_ar || '',
      item.washing_price,
      item.dry_cleaning_price,
      item.pressing_price,
      item.currency,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-list-${selectedCategory}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryLabel = selectedCategory === 'guest'
    ? (language === 'ar' ? 'غسيل الضيوف' : 'Guest Laundry')
    : (language === 'ar' ? 'غسيل العملاء الخارجيين' : 'Outside Customer');

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/5 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold-500/20 rounded-xl">
            <DollarSign size={24} className="text-gold-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'priceList')}</h1>
            <p className="text-sm text-white/40">{filtered.length} {language === 'ar' ? 'صنف' : 'items'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={handlePrint} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors" title="Print">
            <Printer size={16} />
          </button>
          <button onClick={exportToCSV} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors" title="Export CSV">
            <FileSpreadsheet size={16} />
          </button>
          <button onClick={handlePrint} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors" title="Export PDF">
            <FileText size={16} />
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
            <Plus size={16} />
            {language === 'ar' ? 'إضافة صنف' : 'Add Item'}
          </button>
        </div>
      </div>

      {/* Printable Header */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold gold-text">TRIUMPH PLAZA HOTEL</h1>
        <h2 className="text-lg mt-2">{language === 'ar' ? 'قائمة الأسعار - ' : 'Price List - '}{categoryLabel}</h2>
        <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 no-print">
        {(['guest', 'outside'] as PriceListCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                : 'glass text-white/50 hover:text-white'
            }`}
          >
            {cat === 'guest'
              ? (language === 'ar' ? '👤 غسيل الضيوف' : '👤 Guest Laundry')
              : (language === 'ar' ? '🌐 عملاء خارجيين' : '🌐 Outside Customers')}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="luxury-card p-4 no-print">
        <div className="relative">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن صنف...' : 'Search item...'}
            className="luxury-input ps-10 text-sm w-full"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="luxury-card overflow-hidden">
        {loading || saving ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gold-500/20 bg-white/[0.02]">
                <tr>
                  <th className="text-start py-3 px-4 text-white/50 font-medium text-xs">{language === 'ar' ? 'الصنف' : 'Item'}</th>
                  <th className="text-center py-3 px-4 text-white/50 font-medium text-xs">{language === 'ar' ? 'غسيل (ر.س)' : 'Washing (SAR)'}</th>
                  <th className="text-center py-3 px-4 text-white/50 font-medium text-xs">{language === 'ar' ? 'تنظيف جاف (ر.س)' : 'Dry Clean (SAR)'}</th>
                  <th className="text-center py-3 px-4 text-white/50 font-medium text-xs">{language === 'ar' ? 'كوي (ر.س)' : 'Pressing (SAR)'}</th>
                  <th className="text-center py-3 px-4 text-white/50 font-medium text-xs no-print">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    {editingId === item.id ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editData.item_name ?? ''}
                            onChange={e => setEditData(p => ({ ...p, item_name: e.target.value }))}
                            className="luxury-input text-sm py-1"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            value={editData.washing_price ?? 0}
                            onChange={e => setEditData(p => ({ ...p, washing_price: +e.target.value }))}
                            className="luxury-input text-sm py-1 w-20 text-center mx-auto"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            value={editData.dry_cleaning_price ?? 0}
                            onChange={e => setEditData(p => ({ ...p, dry_cleaning_price: +e.target.value }))}
                            className="luxury-input text-sm py-1 w-20 text-center mx-auto"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            value={editData.pressing_price ?? 0}
                            onChange={e => setEditData(p => ({ ...p, pressing_price: +e.target.value }))}
                            className="luxury-input text-sm py-1 w-20 text-center mx-auto"
                          />
                        </td>
                        <td className="py-3 px-4 text-center no-print">
                          <div className="flex gap-1 justify-center">
                            <button onClick={updateItem} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
                              <Check size={14} />
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 bg-white/5 text-white/50 rounded hover:bg-white/10">
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-white font-medium">
                          {language === 'ar' && item.item_name_ar ? item.item_name_ar : item.item_name}
                        </td>
                        <td className="py-3 px-4 text-center text-gold-400 font-semibold">{item.washing_price}</td>
                        <td className="py-3 px-4 text-center text-white/70">{item.dry_cleaning_price}</td>
                        <td className="py-3 px-4 text-center text-white/70">{item.pressing_price}</td>
                        <td className="py-3 px-4 text-center no-print">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(item)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-white/30">
                      {language === 'ar' ? 'لا توجد عناصر' : 'No items found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm no-print">
          <div className="luxury-card w-full max-w-md p-6">
            <h3 className="font-semibold text-white mb-4">{language === 'ar' ? 'إضافة صنف جديد' : 'Add New Item'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={e => setNewItem(p => ({ ...p, item_name: e.target.value }))}
                  className="luxury-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                <input
                  type="text"
                  value={newItem.item_name_ar}
                  onChange={e => setNewItem(p => ({ ...p, item_name_ar: e.target.value }))}
                  className="luxury-input text-sm"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'غسيل' : 'Washing'}</label>
                  <input
                    type="number"
                    value={newItem.washing_price}
                    onChange={e => setNewItem(p => ({ ...p, washing_price: +e.target.value }))}
                    className="luxury-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'تنظيف جاف' : 'Dry Clean'}</label>
                  <input
                    type="number"
                    value={newItem.dry_cleaning_price}
                    onChange={e => setNewItem(p => ({ ...p, dry_cleaning_price: +e.target.value }))}
                    className="luxury-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">{language === 'ar' ? 'كوي' : 'Pressing'}</label>
                  <input
                    type="number"
                    value={newItem.pressing_price}
                    onChange={e => setNewItem(p => ({ ...p, pressing_price: +e.target.value }))}
                    className="luxury-input text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addItem} disabled={saving || !newItem.item_name} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
                <Check size={14} /> {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="btn-ghost flex items-center gap-2 text-sm px-4 py-2">
                <X size={14} /> {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
