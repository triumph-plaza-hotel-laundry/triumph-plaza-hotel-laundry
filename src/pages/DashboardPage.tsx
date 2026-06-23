import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Clock, CheckCircle2, Package, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedToday: number;
  activeEmployees: number;
  revenueToday: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  room_number: string;
  guest_name: string;
  service_type: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  received: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Washing Machine Icon Component
function WashingMachineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <circle cx="12" cy="14" r="5" />
      <circle cx="12" cy="14" r="3" strokeDasharray="2 2" className="animate-spin-slow origin-center" />
      <circle cx="6" cy="5.5" r="1" fill="currentColor" />
      <circle cx="9" cy="5.5" r="1" fill="currentColor" />
      <line x1="14" y1="5" x2="18" y2="5" strokeLinecap="round" />
    </svg>
  );
}

// Floating Bubble Component
function Bubble({ delay, size, left }: { delay: number; size: number; left: number }) {
  return (
    <div
      className="absolute rounded-full border border-gold-400/20"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: '-20px',
        animation: `bubble ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// Ripple Effect Component
function Ripple() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-500/10"
          style={{
            animation: `ripple ${3 + i}s ease-out infinite`,
            animationDelay: `${i * 1}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { language } = useApp();
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, pendingOrders: 0, completedToday: 0, activeEmployees: 0, revenueToday: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [ordersRes, employeesRes] = await Promise.all([
        supabase.from('laundry_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('employees').select('id, status'),
      ]);

      const orders = ordersRes.data ?? [];
      const employees = employeesRes.data ?? [];
      const todayOrders = orders.filter(o => new Date(o.created_at) >= today);

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => ['received', 'processing'].includes(o.status)).length,
        completedToday: todayOrders.filter(o => o.status === 'delivered').length,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        revenueToday: todayOrders.reduce((sum: number, o: any) => sum + (o.total_amount ?? 0), 0),
      });

      setRecentOrders(orders.slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { label: t(language, 'totalOrders'), value: stats.totalOrders, icon: Package, gradient: 'from-blue-500/20' },
    { label: t(language, 'pendingOrders'), value: stats.pendingOrders, icon: Clock, gradient: 'from-amber-500/20' },
    { label: t(language, 'completedToday'), value: stats.completedToday, icon: CheckCircle2, gradient: 'from-emerald-500/20' },
    { label: t(language, 'activeEmployees'), value: stats.activeEmployees, icon: Users, gradient: 'from-purple-500/20' },
    { label: t(language, 'revenueToday'), value: `${stats.revenueToday.toFixed(0)} ${t(language, 'SAR')}`, icon: TrendingUp, gradient: 'from-gold-500/20' },
  ];

  const statusLabels: Record<string, string> = {
    received: t(language, 'received'),
    processing: t(language, 'processing'),
    ready: t(language, 'ready'),
    delivered: t(language, 'delivered'),
    cancelled: t(language, 'cancelled'),
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Banner with Washing Machine */}
      <div className="luxury-card p-6 bg-gradient-to-br from-gold-500/10 via-transparent to-gold-500/5 relative overflow-hidden">
        {/* Water ripple effect */}
        <Ripple />

        {/* Floating bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <Bubble key={i} delay={i * 0.5} size={8 + Math.random() * 12} left={10 + i * 10} />
          ))}
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Rotating Washing Machine Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 flex items-center justify-center">
                <WashingMachineIcon className="w-10 h-10 text-blue-400 animate-spin-slow" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-gold-500/30 rounded-full blur-sm" />
            </div>

            <div>
              <div className="gradient-text-gold text-xl font-bold mb-1">
                {language === 'ar' ? 'مرحباً بك في فندق تريومف بلازا' : 'Welcome to Triumph Plaza Hotel'}
              </div>
              <p className="text-white/50 text-sm flex items-center gap-2">
                <Sparkles size={14} className="text-gold-400" />
                {language === 'ar' ? 'نظام إدارة المغسلة الاحترافي' : 'Professional Laundry Management System'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/assets/images/1000407416 copy.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
              style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }}
            />
            <button onClick={fetchData} className="p-2.5 glass rounded-xl text-white/50 hover:text-gold-400 transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient }, index) => (
          <div
            key={label}
            className={`luxury-card p-5 bg-gradient-to-br ${gradient} to-transparent`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70">
                <Icon size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-white/50">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: language === 'ar' ? 'غسيل ضيوف' : 'Guest Laundry', icon: '🧺', gradient: 'from-blue-500/20' },
          { label: language === 'ar' ? 'تنظيف جاف' : 'Dry Cleaning', icon: '👔', gradient: 'from-gold-500/20' },
          { label: language === 'ar' ? 'تقرير اليوم' : "Today's Report", icon: '📊', gradient: 'from-emerald-500/20' },
          { label: language === 'ar' ? 'حالات طارئة' : 'Urgent Orders', icon: '🔔', gradient: 'from-red-500/20' },
        ].map(({ label, icon, gradient }) => (
          <button
            key={label}
            className={`luxury-card p-4 flex flex-col items-center gap-2 text-center bg-gradient-to-br ${gradient}`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm text-white/70">{label}</span>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gold-500" />
            {t(language, 'recentOrders')}
          </h2>
          <span className="px-3 py-1 glass rounded-full text-xs text-white/50">
            {recentOrders.length} {language === 'ar' ? 'طلب' : 'orders'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>{t(language, 'noData')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    t(language, 'orderNumber'),
                    t(language, 'roomNumber'),
                    t(language, 'guestName'),
                    t(language, 'status'),
                    t(language, 'totalAmount'),
                  ].map(h => (
                    <th key={h} className="text-start py-3 px-3 text-white/40 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-3">
                      <span className="text-gold-400 font-mono text-xs bg-gold-500/10 px-2 py-1 rounded">
                        {order.order_number ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white font-medium">{order.room_number ?? '—'}</td>
                    <td className="py-3 px-3 text-white/70">{order.guest_name ?? '—'}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? 'bg-white/10 text-white/50'}`}>
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gold-400 font-semibold">
                      {order.total_amount ? `${order.total_amount} ${t(language, 'SAR')}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bubble animation keyframes */}
      <style>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-100px) scale(1.1); opacity: 0.3; }
          100% { transform: translateY(-200px) scale(0.8); opacity: 0; }
        }
        @keyframes ripple {
          0% { width: 20px; height: 20px; opacity: 0.3; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
