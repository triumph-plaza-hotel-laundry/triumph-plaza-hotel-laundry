import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, User, RefreshCw, Printer, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import type { Shift, Employee, ShiftType, ShiftStatus } from '../types';

const SHIFT_COLORS: Record<ShiftType, string> = {
  morning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  evening: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  night: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const STATUS_COLORS: Record<ShiftStatus, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  attended: 'bg-green-500/20 text-green-400',
  absent: 'bg-red-500/20 text-red-400',
  late: 'bg-yellow-500/20 text-yellow-400',
  on_leave: 'bg-purple-500/20 text-purple-400',
};

function AddShiftModal({ employees, onSave, onClose, lang }: {
  employees: Employee[];
  onSave: (s: Partial<Shift>) => void;
  onClose: () => void;
  lang: 'ar' | 'en';
}) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState<Partial<Shift>>({
    shift_date: today,
    shift_type: 'morning',
    status: 'scheduled',
    start_time: '07:00',
    end_time: '15:00',
    late_minutes: 0,
    overtime_minutes: 0,
  });

  const shiftTimes: Record<ShiftType, { start: string; end: string }> = {
    morning: { start: '07:00', end: '15:00' },
    evening: { start: '15:00', end: '23:00' },
    night: { start: '23:00', end: '07:00' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="luxury-card w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">{t(lang, 'addShift')}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs text-white/50 mb-1">{lang === 'ar' ? 'الموظف' : 'Employee'}</label>
            <select value={form.employee_id ?? ''} onChange={e => setForm(p => ({ ...p, employee_id: e.target.value }))} className="luxury-input text-sm">
              <option value="" className="bg-marble-800">{lang === 'ar' ? 'اختر موظف' : 'Select employee'}</option>
              {employees.filter(e => e.status === 'active').map(e => (
                <option key={e.id} value={e.id} className="bg-marble-800">
                  {lang === 'ar' && e.name_ar ? e.name_ar : e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(lang, 'shiftDate')}</label>
              <input type="date" value={form.shift_date ?? today} onChange={e => setForm(p => ({ ...p, shift_date: e.target.value }))} className="luxury-input text-sm" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(lang, 'shiftType')}</label>
              <select value={form.shift_type ?? 'morning'} onChange={e => {
                const type = e.target.value as ShiftType;
                setForm(p => ({ ...p, shift_type: type, start_time: shiftTimes[type].start, end_time: shiftTimes[type].end }));
              }} className="luxury-input text-sm">
                <option value="morning" className="bg-marble-800">{t(lang, 'morning')}</option>
                <option value="evening" className="bg-marble-800">{t(lang, 'evening')}</option>
                <option value="night" className="bg-marble-800">{t(lang, 'night')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(lang, 'checkIn')}</label>
              <input type="time" value={form.start_time ?? '07:00'} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))} className="luxury-input text-sm" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(lang, 'checkOut')}</label>
              <input type="time" value={form.end_time ?? '15:00'} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))} className="luxury-input text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">{t(lang, 'shiftStatus')}</label>
            <select value={form.status ?? 'scheduled'} onChange={e => setForm(p => ({ ...p, status: e.target.value as ShiftStatus }))} className="luxury-input text-sm">
              {(['scheduled', 'attended', 'absent', 'late', 'on_leave'] as ShiftStatus[]).map(s => (
                <option key={s} value={s} className="bg-marble-800">{t(lang, s as any)}</option>
              ))}
            </select>
          </div>

          {(form.status === 'late') && (
            <div>
              <label className="block text-xs text-white/50 mb-1">{t(lang, 'lateMinutes')}</label>
              <input type="number" value={form.late_minutes ?? 0} onChange={e => setForm(p => ({ ...p, late_minutes: +e.target.value }))} className="luxury-input text-sm" min={0} />
            </div>
          )}

          <div>
            <label className="block text-xs text-white/50 mb-1">{t(lang, 'notes')}</label>
            <textarea value={form.notes ?? ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="luxury-input text-sm resize-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onSave(form)} disabled={!form.employee_id} className="btn-gold flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50">
            <Check size={14} /> {t(lang, 'save')}
          </button>
          <button onClick={onClose} className="btn-ghost text-sm px-4 py-2">{t(lang, 'cancel')}</button>
        </div>
      </div>
    </div>
  );
}

export default function ShiftsPage() {
  const { language, isRTL } = useApp();
  const [shifts, setShifts] = useState<(Shift & { employee?: Employee })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const fetchData = async () => {
    setLoading(true);
    const [shiftsRes, empsRes] = await Promise.all([
      supabase.from('shifts').select('*, employee:employees(*)').order('shift_date', { ascending: false }),
      supabase.from('employees').select('*').eq('status', 'active'),
    ]);
    setShifts(shiftsRes.data ?? []);
    setEmployees(empsRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const saveShift = async (data: Partial<Shift>) => {
    await supabase.from('shifts').insert({ ...data });
    setShowModal(false);
    fetchData();
  };

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();
  const todayStr = new Date().toISOString().split('T')[0];

  const shiftTypeLabel = (type: ShiftType) => {
    const labels: Record<ShiftType, { ar: string; en: string }> = {
      morning: { ar: 'ص', en: 'M' },
      evening: { ar: 'م', en: 'E' },
      night: { ar: 'ل', en: 'N' },
    };
    return language === 'ar' ? labels[type].ar : labels[type].en;
  };

  const recentShifts = shifts.slice(0, 20);

  const stats = {
    todayShifts: shifts.filter(s => s.shift_date === todayStr).length,
    presentToday: shifts.filter(s => s.shift_date === todayStr && s.status === 'attended').length,
    absentToday: shifts.filter(s => s.shift_date === todayStr && s.status === 'absent').length,
    lateToday: shifts.filter(s => s.shift_date === todayStr && s.status === 'late').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Calendar size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'shifts')}</h1>
            <p className="text-sm text-white/40">{shifts.length} {language === 'ar' ? 'وردية مسجلة' : 'shifts recorded'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => window.print()} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors no-print">
            <Printer size={16} />
          </button>
          <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
            <Plus size={16} /> {t(language, 'addShift')}
          </button>
        </div>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: language === 'ar' ? 'ورديات اليوم' : "Today's Shifts", value: stats.todayShifts, color: 'text-white' },
          { label: t(language, 'attended'), value: stats.presentToday, color: 'text-green-400' },
          { label: t(language, 'absent'), value: stats.absentToday, color: 'text-red-400' },
          { label: t(language, 'late'), value: stats.lateToday, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="luxury-card p-4 text-center">
            <div className={`text-xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Weekly view */}
      <div className="luxury-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">{t(language, 'weeklySchedule')}</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() - 7);
              setCurrentDate(d);
            }} className="p-1.5 glass rounded-lg text-white/50 hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-white/60">
              {weekDates[0].toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
              {' - '}
              {weekDates[6].toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
            </span>
            <button onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + 7);
              setCurrentDate(d);
            }} className="p-1.5 glass rounded-lg text-white/50 hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-start py-2 px-3 text-white/40 min-w-32">{language === 'ar' ? 'الموظف' : 'Employee'}</th>
                {weekDates.map(d => {
                  const isToday = d.toISOString().split('T')[0] === todayStr;
                  return (
                    <th key={d.toISOString()} className={`text-center py-2 px-2 min-w-16 ${isToday ? 'text-gold-400' : 'text-white/40'}`}>
                      <div>{d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short' })}</div>
                      <div className={`font-bold ${isToday ? 'text-gold-400' : 'text-white'}`}>{d.getDate()}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.slice(0, 10).map(emp => (
                <tr key={emp.id} className="hover:bg-white/2">
                  <td className="py-2 px-3 text-white/70">
                    {language === 'ar' && emp.name_ar ? emp.name_ar : emp.name}
                  </td>
                  {weekDates.map(d => {
                    const dateStr = d.toISOString().split('T')[0];
                    const dayShifts = shifts.filter(s => s.shift_date === dateStr && s.employee_id === emp.id);
                    return (
                      <td key={dateStr} className="py-2 px-2 text-center">
                        <div className="flex flex-col gap-0.5 items-center">
                          {dayShifts.map(s => (
                            <span key={s.id} className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${SHIFT_COLORS[s.shift_type]}`}>
                              {shiftTypeLabel(s.shift_type)}
                            </span>
                          ))}
                          {dayShifts.length === 0 && <span className="text-white/10">—</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent shifts list */}
      <div className="luxury-card p-5">
        <h2 className="font-semibold text-white mb-4">{language === 'ar' ? 'آخر الورديات' : 'Recent Shifts'}</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {recentShifts.map(shift => {
              const emp = shift.employee;
              return (
                <div key={shift.id} className="flex items-center gap-4 p-3 glass rounded-xl hover:border-gold-500/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-semibold flex-shrink-0">
                    {emp?.name?.[0] ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">
                      {language === 'ar' && emp?.name_ar ? emp.name_ar : emp?.name ?? '—'}
                    </div>
                    <div className="text-xs text-white/40">
                      {new Date(shift.shift_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </div>
                  <span className={`status-badge border ${SHIFT_COLORS[shift.shift_type]}`}>
                    {t(language, shift.shift_type)}
                  </span>
                  <span className={`status-badge ${STATUS_COLORS[shift.status]}`}>
                    {t(language, shift.status as any)}
                  </span>
                  {shift.late_minutes > 0 && (
                    <span className="text-xs text-yellow-400">+{shift.late_minutes}{language === 'ar' ? 'د' : 'm'}</span>
                  )}
                </div>
              );
            })}
            {recentShifts.length === 0 && (
              <div className="text-center py-8 text-white/30">
                <Calendar size={40} className="mx-auto mb-2 opacity-30" />
                <p>{t(language, 'noData')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <AddShiftModal employees={employees} onSave={saveShift} onClose={() => setShowModal(false)} lang={language} />
      )}
    </div>
  );
}
