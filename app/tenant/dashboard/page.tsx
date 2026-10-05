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
  QrCode,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
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
    joining_date: '2025-01-15',
    agreement_status: 'signed',
    status: 'active',
  };

  const [showPayModal, setShowPayModal] = React.useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaysMenu = messMenus.find((m) => m.day_of_week === todayDay) || messMenus[0];

  const myComplaints = complaints.filter((c) => c.tenant_id === currentTenant.id);
  const latestNotice = notices[0];

  const handleSimulatePayment = () => {
    toast.success('UPI Payment Received! Digital Receipt Generated.');
    setShowPayModal(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Resident Greeting Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-500/25 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-indigo-300 tracking-wide uppercase">
              Welcome Home
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {currentTenant.full_name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <span>Room {currentTenant.room_number || '101'}</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">{currentTenant.bed_number || 'Bed A'}</span>
              <span>&bull;</span>
              <span>Tower A</span>
            </p>
          </div>

          <div className="h-10 w-10 rounded-2xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
            {currentTenant.full_name.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Rent Action Due Card */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Rent</span>
            <p className="text-lg font-bold text-white">{formatINR(currentTenant.monthly_rent)}</p>
            <span className="text-[10px] text-emerald-400">Due on 5th of every month</span>
          </div>

          <Button
            size="sm"
            onClick={() => setShowPayModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold gap-1.5 shadow-lg shadow-emerald-600/25"
          >
            <CreditCard className="h-3.5 w-3.5" /> Pay via UPI
          </Button>
        </div>
      </div>

      {/* Daily Student Tiffin Box Hub (College Route & Delivery Selector) */}
      <TiffinHubCard />

      {/* Today's Mess Menu Card */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today&apos;s Menu ({todayDay})</h3>
          </div>
          <Link href="/tenant/mess" className="text-[11px] text-indigo-400 hover:text-indigo-300">
            Full Week &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">Breakfast</span>
            <p className="text-[11px] text-slate-200 line-clamp-1">{todaysMenu?.breakfast}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-emerald-400 font-semibold block mb-0.5">Lunch</span>
            <p className="text-[11px] text-slate-200 line-clamp-1">{todaysMenu?.lunch}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-indigo-400 font-semibold block mb-0.5">Evening Snacks</span>
            <p className="text-[11px] text-slate-200 line-clamp-1">{todaysMenu?.snacks || 'Tea & Samosa'}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-cyan-400 font-semibold block mb-0.5">Dinner</span>
            <p className="text-[11px] text-slate-200 line-clamp-1">{todaysMenu?.dinner}</p>
          </div>
        </div>
      </Card>

      {/* Quick App Navigation Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/tenant/complaints" className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 block transition-colors">
          <AlertCircle className="h-5 w-5 text-amber-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Raise Issue</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">AC, Wi-Fi or Plumbing</p>
        </Link>

        <Link href="/tenant/payments" className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 block transition-colors">
          <Download className="h-5 w-5 text-indigo-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Rent Receipts</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Download past PDFs</p>
        </Link>
      </div>

      {/* Latest Notice Alert */}
      {latestNotice && (
        <Card className="glass-card p-4 border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-slate-900">
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="h-4 w-4 text-indigo-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white">{latestNotice.title}</h4>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{latestNotice.content}</p>
          <Link href="/tenant/notices" className="text-[11px] text-indigo-400 hover:underline block mt-2">
            View Notice Board &rarr;
          </Link>
        </Card>
      )}

      {/* Pay Modal with UPI QR */}
      {showPayModal && (
        <Modal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          title="Instant Rent Payment via UPI"
          description={`Amount Due: ${formatINR(currentTenant.monthly_rent)} for March 2025`}
        >
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-white text-slate-900 inline-block mx-auto shadow-md">
              <QrCode className="h-36 w-36 mx-auto text-slate-900" />
              <span className="text-[10px] font-mono font-bold block mt-1">UPI ID: royalpalms@okhdfcbank</span>
            </div>

            <p className="text-xs text-slate-400">
              Scan with any UPI app (Google Pay, PhonePe, Paytm) to pay instantly.
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowPayModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSimulatePayment} className="bg-emerald-600 hover:bg-emerald-500 text-xs">
                Simulate Payment Done &check;
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
