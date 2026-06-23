import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Printer, RefreshCw, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import type { LaundryOrder, Employee, Shift } from '../types';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

interface ReportData {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  byService: Record<string, number>;
  byStatus: Record<string, number>;
  topEmployees: { name: string; shifts: number }[];
}

export default function ReportsPage() {
  const { language } = useApp();
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const generateReport = async () => {
    setLoading(true);
    const now = new Date();
    let startDate: Date;

    if (period === 'daily') {
      startDate = new Date(now.toDateString());
    } else if (period === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const [ordersRes, shiftsRes, empsRes] = await Promise.all([
      supabase.from('laundry_orders').select('*').gte('created_at', startDate.toISOString()),
      supabase.from('shifts').select('*, employee:employees(name, name_ar)').gte('shift_date', startDate.toISOString().split('T')[0]),
      supabase.from('employees').select('*'),
    ]);

    const ordData = ordersRes.data as LaundryOrder[] ?? [];
    const shData = shiftsRes.data as any[] ?? [];
    const empData = empsRes.data as Employee[] ?? [];

    setOrders(ordData);
    setShifts(shData);
    setEmployees(empData);

    const byService: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    ordData.forEach(o => {
      byService[o.service_type] = (byService[o.service_type] ?? 0) + 1;
      byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    });

    const shiftsByEmp: Record<string, { name: string; shifts: number }> = {};
    shData.forEach((s: any) => {
      const name = language === 'ar' && s.employee?.name_ar ? s.employee.name_ar : s.employee?.name ?? '—';
      if (!shiftsByEmp[s.employee_id]) shiftsByEmp[s.employee_id] = { name, shifts: 0 };
      shiftsByEmp[s.employee_id].shifts++;
    });

    setReportData({
      totalOrders: ordData.length,
      totalRevenue: ordData.reduce((sum, o) => sum + (o.total_amount ?? 0), 0),
      completedOrders: ordData.filter(o => o.status === 'delivered').length,
      pendingOrders: ordData.filter(o => ['received', 'processing'].includes(o.status)).length,
      byService,
      byStatus,
      topEmployees: Object.values(shiftsByEmp).sort((a, b) => b.shifts - a.shifts).slice(0, 5),
    });

    setLoading(false);
  };

  useEffect(() => { generateReport(); }, [period]);

  const periodLabel = (p: ReportPeriod) => {
    const labels = {
      daily: { ar: 'يومي', en: 'Daily' },
      weekly: { ar: 'أسبوعي', en: 'Weekly' },
      monthly: { ar: 'شهري', en: 'Monthly' },
    };
    return language === 'ar' ? labels[p].ar : labels[p].en;
  };

  const serviceLabels: Record<string, { ar: string; en: string }> = {
    guest: { ar: 'غسيل ضيوف', en: 'Guest Laundry' },
    outside: { ar: 'غسيل خارجي', en: 'Outside Laundry' },
    dry_cleaning: { ar: 'تنظيف جاف', en: 'Dry Cleaning' },
    pressing: { ar: 'كوي', en: 'Pressing' },
    express: { ar: 'سريع', en: 'Express' },
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    received: { ar: 'مستلم', en: 'Received' },
    processing: { ar: 'قيد المعالجة', en: 'Processing' },
    ready: { ar: 'جاهز', en: 'Ready' },
    delivered: { ar: 'تم التسليم', en: 'Delivered' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card p-5 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <BarChart3 size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t(language, 'reports')}</h1>
            <p className="text-sm text-white/40">{language === 'ar' ? 'تقارير وإحصائيات شاملة' : 'Comprehensive reports and statistics'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={generateReport} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => window.print()} className="p-2 glass rounded-lg text-white/50 hover:text-gold-400 transition-colors no-print">
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {(['daily', 'weekly', 'monthly'] as ReportPeriod[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === p ? 'bg-gold-500/30 text-gold-400' : 'text-white/50 hover:text-white'
            }`}
          >
            {periodLabel(p)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t(language, 'totalOrders'), value: reportData.totalOrders, color: 'text-blue-400', bg: 'from-blue-500/10' },
              { label: t(language, 'totalRevenue'), value: `${reportData.totalRevenue.toFixed(0)} ${t(language, 'SAR')}`, color: 'text-gold-400', bg: 'from-gold-500/10' },
              { label: t(language, 'completedToday'), value: reportData.completedOrders, color: 'text-green-400', bg: 'from-green-500/10' },
              { label: t(language, 'pendingOrders'), value: reportData.pendingOrders, color: 'text-orange-400', bg: 'from-orange-500/10' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`luxury-card p-5 bg-gradient-to-br ${bg} to-transparent`}>
                <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* By service */}
            <div className="luxury-card p-5">
              <h3 className="font-semibold text-white mb-4">{language === 'ar' ? 'الطلبات حسب نوع الخدمة' : 'Orders by Service Type'}</h3>
              {Object.entries(reportData.byService).length === 0 ? (
                <p className="text-white/30 text-sm">{t(language, 'noData')}</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(reportData.byService).sort((a, b) => b[1] - a[1]).map(([service, count]) => {
                    const total = reportData.totalOrders || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={service}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">
                            {language === 'ar' ? serviceLabels[service]?.ar : serviceLabels[service]?.en}
                          </span>
                          <span className="text-gold-400 font-semibold">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* By status */}
            <div className="luxury-card p-5">
              <h3 className="font-semibold text-white mb-4">{language === 'ar' ? 'الطلبات حسب الحالة' : 'Orders by Status'}</h3>
              {Object.entries(reportData.byStatus).length === 0 ? (
                <p className="text-white/30 text-sm">{t(language, 'noData')}</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(reportData.byStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                    const total = reportData.totalOrders || 1;
                    const pct = Math.round((count / total) * 100);
                    const colors: Record<string, string> = {
                      received: 'from-blue-600 to-blue-400',
                      processing: 'from-yellow-600 to-yellow-400',
                      ready: 'from-green-600 to-green-400',
                      delivered: 'from-emerald-600 to-emerald-400',
                      cancelled: 'from-red-600 to-red-400',
                    };
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">
                            {language === 'ar' ? statusLabels[status]?.ar : statusLabels[status]?.en}
                          </span>
                          <span className="text-white/70 font-semibold">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[status] ?? 'from-white/30 to-white/20'} rounded-full`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Top employees */}
          {reportData.topEmployees.length > 0 && (
            <div className="luxury-card p-5">
              <h3 className="font-semibold text-white mb-4">{t(language, 'employeeProductivity')}</h3>
              <div className="space-y-3">
                {reportData.topEmployees.map((emp, idx) => (
                  <div key={emp.name} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-xs font-bold text-gold-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{emp.name}</span>
                        <span className="text-gold-400">{emp.shifts} {language === 'ar' ? 'وردية' : 'shifts'}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                          style={{ width: `${(emp.shifts / (reportData.topEmployees[0]?.shifts || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Print area */}
          <div className="luxury-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{language === 'ar' ? 'ملخص التقرير' : 'Report Summary'}</h3>
              <div className="text-xs text-white/30">
                {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="glass rounded-lg p-3">
                <div className="text-white/40 text-xs mb-1">{language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}</div>
                <div className="text-white font-semibold">{employees.length}</div>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="text-white/40 text-xs mb-1">{language === 'ar' ? 'إجمالي الورديات' : 'Total Shifts'}</div>
                <div className="text-white font-semibold">{shifts.length}</div>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="text-white/40 text-xs mb-1">{language === 'ar' ? 'متوسط الإيراد' : 'Avg Revenue/Order'}</div>
                <div className="text-gold-400 font-semibold">
                  {reportData.totalOrders > 0 ? (reportData.totalRevenue / reportData.totalOrders).toFixed(0) : 0} {t(language, 'SAR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
