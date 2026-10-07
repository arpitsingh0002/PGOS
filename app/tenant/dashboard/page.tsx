'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  UtensilsCrossed,
  AlertCircle,
  Bell,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import { TiffinHubCard } from '@/components/tenant/tiffin-hub-card';

export default function TenantDashboardPage() {
  const { tenants, messMenus, notices, complaints, payments } = usePGStore();
  const currentTenant = tenants[0] || {
    id: 'ten-1',
    full_name: 'Aarav Sharma',
    phone: '9876543210',
    room_number: '101',
    bed_number: 'Bed A',
    monthly_rent: 9500,
    security_deposit: 19000,
    joining_date: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
    agreement_status: 'signed',
    status: 'active',
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaysMenu = messMenus.find((m) => m.day_of_week === todayDay) || messMenus[0];

  const myComplaints = complaints.filter((c) => c.tenant_id === currentTenant.id);
  const latestNotice = notices[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Resident Greeting Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 border border-indigo-200 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-bold text-indigo-900 tracking-wide uppercase">
              Welcome Home
            </span>
            <h1 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
              {currentTenant.full_name}
            </h1>
            <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
              <span>Room {currentTenant.room_number || '101'}</span>
              <span>&bull;</span>
              <span className="text-emerald-800 font-extrabold">{currentTenant.bed_number || 'Bed A'}</span>
              <span>&bull;</span>
              <span>Tower A</span>
            </p>
          </div>

          <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-950 flex items-center justify-center font-bold text-sm border border-indigo-300 shadow-xs">
            {currentTenant.full_name.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Rent Action Due Card */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-bold">Monthly Rent</span>
            <p className="text-lg font-black text-slate-950">{formatINR(currentTenant.monthly_rent)}</p>
            <span className="text-[10px] text-emerald-800 font-bold">Due on 5th of every month</span>
          </div>

          <Button
            size="sm"
            disabled
            className="bg-slate-200 text-slate-500 cursor-not-allowed text-xs font-bold gap-1.5 border border-slate-300"
            title="Online payment gateway coming soon"
          >
            <CreditCard className="h-3.5 w-3.5" /> Pay via UPI (Disabled / Coming Soon)
          </Button>
        </div>
      </div>

      {/* Daily Student Tiffin Box Hub (College Route & Delivery Selector) */}
      <TiffinHubCard />

      {/* Today's Mess Menu Card */}
      <Card className="bg-white border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Today&apos;s Menu ({todayDay})</h3>
          </div>
          <Link href="/tenant/mess" className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900">
            Full Week &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-amber-900 font-bold block mb-0.5">Breakfast</span>
            <p className="text-[11px] text-slate-800 font-semibold line-clamp-1">{todaysMenu?.breakfast}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-emerald-900 font-bold block mb-0.5">Lunch</span>
            <p className="text-[11px] text-slate-800 font-semibold line-clamp-1">{todaysMenu?.lunch}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-indigo-900 font-bold block mb-0.5">Evening Snacks</span>
            <p className="text-[11px] text-slate-800 font-semibold line-clamp-1">{todaysMenu?.snacks || 'Tea & Samosa'}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-cyan-900 font-bold block mb-0.5">Dinner</span>
            <p className="text-[11px] text-slate-800 font-semibold line-clamp-1">{todaysMenu?.dinner}</p>
          </div>
        </div>
      </Card>

      {/* Quick App Navigation Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/tenant/complaints" className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 block transition-all shadow-xs">
          <AlertCircle className="h-5 w-5 text-amber-600 mb-2" />
          <h4 className="text-xs font-bold text-slate-950">Raise Issue</h4>
          <p className="text-[10px] text-slate-600 font-semibold mt-0.5">AC, Wi-Fi or Plumbing</p>
        </Link>

        <Link href="/tenant/payments" className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 block transition-all shadow-xs">
          <Download className="h-5 w-5 text-indigo-700 mb-2" />
          <h4 className="text-xs font-bold text-slate-950">Rent Receipts</h4>
          <p className="text-[10px] text-slate-600 font-semibold mt-0.5">Download past PDFs</p>
        </Link>
      </div>

      {/* Latest Notice Alert */}
      {latestNotice && (
        <Card className="p-4 border-indigo-200 bg-indigo-50/70 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="h-4 w-4 text-indigo-700 animate-pulse" />
            <h4 className="text-xs font-bold text-slate-950">{latestNotice.title}</h4>
          </div>
          <p className="text-[11px] text-slate-800 font-medium line-clamp-2 leading-relaxed">{latestNotice.content}</p>
          <Link href="/tenant/notices" className="text-[11px] font-bold text-indigo-700 hover:underline block mt-2">
            View Notice Board &rarr;
          </Link>
        </Card>
      )}
    </div>
  );
}
