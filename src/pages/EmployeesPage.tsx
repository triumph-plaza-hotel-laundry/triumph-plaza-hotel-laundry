import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Check, X, Phone, Briefcase, RefreshCw, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import type { Employee, EmployeeStatus } from '../types';

const STATUS_COLORS: Record<EmployeeStatus, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  on_leave: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const EMPTY_EMP: Partial<Employee> = {
  name: '', name_ar: '', department: 'Laundry', position: '', phone: '', email: '', status: 'active', notes: '',
};

function EmployeeModal({ employee, onSave, onClose, lang }: {
  employee: Partial<Employee>; onSave: (e: Partial<Employee>) => void; onClose: () => void; lang: 'ar' | 'en';
}) {
  const [form, setForm] = useState({ ...employee });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="luxury-card w-full max-w-lg p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white text-lg">
            {employee.id ? t(lang, 'editItem') : t(lang, 'addEmployee')}
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={20} /></button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {[
            { key: 'name', label: lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)', type: 'text' },
            { key: 'name_ar', label: lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)', type: 'text' },
            { key: 'department', label: t(lang, 'department'), type: 'text' },
            { key: 'position', label: t(lang, 'position'), type: 'text' },
            { key: 'phone', label: t(lang, 'phone'), type: 'tel' },
            { key: 'email', label: t(lang, 'email'), type: 'email' },
            { key: 'hire_date', label: t(lang, 'hireDate'), type: 'date' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs text-white/50 mb-1">{label}</label>
              <input
                type={type}
                value={(form as any)[key] ?? ''}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="luxury-input text-sm"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-white/50 mb-1">{t(lang, 'employeeStatus')}</label>
            <select
              value={form.status ?? 'active'}
              onChange={e => setForm(p => ({ ...p, status: e.target.value as EmployeeStatus }))}
              className="luxury-input text-sm"
            >
              <option value="active" className="bg-marble-800">{t(lang, 'active')}</option>
              <option value="inactive" className="bg-marble-800">{t(lang, 'inactive')}</option>
              <option value="on_leave" className="bg-marble-800">{t(lang, 'onLeave')}</option>
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs text-white/50 mb-1">{t(lang, 'notes')}</label>
          <textarea
            value={form.notes ?? ''}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            rows={2}
            className="luxury-input text-sm resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={() => onSave(form)} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
            <Check size={14} /> {t(lang, 'save')}
          </button>
          <button onClick={onClose} className="btn-ghost text-sm px-4 py-2">{t(lang, 'cancel')}</button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const { language } = useApp();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalEmployee, setModalEmployee] = useState<Partial<Employee> | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchEmployees = async () => {
    setLoading(true);
    const { data } = await supabase.from('employees').select('*').order('name');
    setEmployees(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = employees.filter(e => {
    const name = (e.name + ' ' + (e.name_ar ?? '')).toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const saveEmployee = async (data: Partial<Employee>) => {
    if (data.id) {
      await supabase.from('employees').update({ ...data, updated_at: new Date().toISOString() }).eq('id', data.id);
    } else {
      await supabase.from('employees').insert({ ...data });
    }
    setModalEmployee(null);
    fetchEmployees();
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
    await supabase.from('employees').delete().eq('id', id);
    fetchEmployees();
  };

  const statusLabels: Record<string, string> = {
    active: t(language, 'active'),
    inactive: t(language, 'inactive'),
    on_leave: t(language, 'onLeave'),
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Users size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'employees')}</h1>
            <p className="text-sm text-white/40">{stats.total} {language === 'ar' ? 'موظف' : 'employees'} · {stats.active} {language === 'ar' ? 'نشط' : 'active'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchEmployees} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setModalEmployee(EMPTY_EMP)} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
            <Plus size={16} /> {t(language, 'addEmployee')}
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: language === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, color: 'text-white' },
          { label: t(language, 'active'), value: stats.active, color: 'text-green-400' },
          { label: t(language, 'onLeave'), value: stats.onLeave, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="luxury-card p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="luxury-card p-4 flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن موظف...' : 'Search employee...'}
            className="luxury-input ps-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive', 'on_leave'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filterStatus === s
                  ? 'bg-gold-500/30 text-gold-400'
                  : 'glass text-white/50 hover:text-white'
              }`}
            >
              {s === 'all' ? t(language, 'all') : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Employee cards */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(emp => (
            <div key={emp.id} className="luxury-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-700/20 border border-gold-500/30 flex items-center justify-center font-semibold text-gold-400">
                    {emp.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{language === 'ar' && emp.name_ar ? emp.name_ar : emp.name}</div>
                    <div className="text-xs text-white/40">{emp.department}</div>
                  </div>
                </div>
                <span className={`status-badge border ${STATUS_COLORS[emp.status]}`}>
                  {statusLabels[emp.status]}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {emp.position && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Briefcase size={13} className="text-gold-400/60" />
                    {emp.position}
                  </div>
                )}
                {emp.phone && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Phone size={13} className="text-gold-400/60" />
                    {emp.phone}
                  </div>
                )}
                {emp.hire_date && (
                  <div className="text-xs text-white/30">
                    {language === 'ar' ? 'تاريخ التعيين: ' : 'Hired: '}
                    {new Date(emp.hire_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setModalEmployee(emp)}
                  className="flex-1 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  <Pencil size={12} /> {t(language, 'edit')}
                </button>
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-white/30">
              <Users size={48} className="mx-auto mb-3 opacity-30" />
              <p>{t(language, 'noData')}</p>
            </div>
          )}
        </div>
      )}

      {modalEmployee && (
        <EmployeeModal
          employee={modalEmployee}
          onSave={saveEmployee}
          onClose={() => setModalEmployee(null)}
          lang={language}
        />
      )}
    </div>
  );
}
