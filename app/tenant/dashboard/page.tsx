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
  GraduationCap,
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
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-orange-600 tracking-wide uppercase bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              Welcome Home
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
              {currentTenant.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
              <span>Room {currentTenant.room_number || '304'}</span>
              <span>&bull;</span>
              <span className="text-emerald-600 font-bold">{currentTenant.bed_number || 'Bed B'}</span>
              <span>&bull;</span>
              <span>Royal Palms Living</span>
            </p>
          </div>

          <div className="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm border border-orange-200">
            {currentTenant.full_name.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Rent Action Due Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Rent</span>
            <p className="text-lg font-black text-slate-900">{formatINR(currentTenant.monthly_rent)}</p>
            <span className="text-[10px] text-emerald-600 font-bold">&check; Paid for Current Month</span>
          </div>

          <Button
            size="sm"
            onClick={() => setShowPayModal(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-1.5 shadow-xs"
          >
            <CreditCard className="h-3.5 w-3.5" /> Pay via UPI
          </Button>
        </div>
      </div>

      {/* Switch to Full Student Command Desk Card */}
      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="h-5 w-5 text-orange-600 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-900">Switch to Full Student Desk</span>
            <p className="text-[10px] text-slate-500">QR Gate Pass, Mess Hub & WiFi credentials</p>
          </div>
        </div>
        <Link href="/student">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-1 h-8">
            Open Desk &rarr;
          </Button>
        </Link>
      </div>

      {/* Daily Student Tiffin Box Hub (College Route & Delivery Selector) */}
      <TiffinHubCard />

      {/* Today's Mess Menu Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Today&apos;s Menu ({todayDay})</h3>
          </div>
          <Link href="/student" className="text-[11px] text-orange-600 hover:underline font-bold">
            Full Week &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-orange-700 font-bold block mb-0.5">Breakfast</span>
            <p className="text-[11px] text-slate-800 font-medium line-clamp-1">{todaysMenu?.breakfast}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-emerald-700 font-bold block mb-0.5">Lunch</span>
            <p className="text-[11px] text-slate-800 font-medium line-clamp-1">{todaysMenu?.lunch}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-indigo-700 font-bold block mb-0.5">Evening Snacks</span>
            <p className="text-[11px] text-slate-800 font-medium line-clamp-1">{todaysMenu?.snacks || 'Tea & Samosa'}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-cyan-700 font-bold block mb-0.5">Dinner</span>
            <p className="text-[11px] text-slate-800 font-medium line-clamp-1">{todaysMenu?.dinner}</p>
          </div>
        </div>
      </Card>

      {/* Quick App Navigation Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/student" className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-500/40 block transition-colors shadow-xs">
          <AlertCircle className="h-5 w-5 text-amber-500 mb-2" />
          <h4 className="text-xs font-bold text-slate-900">Raise Issue</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">AC, Wi-Fi or Plumbing</p>
        </Link>

        <Link href="/student" className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-500/40 block transition-colors shadow-xs">
          <Download className="h-5 w-5 text-orange-500 mb-2" />
          <h4 className="text-xs font-bold text-slate-900">Rent Receipts</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Download past PDFs</p>
        </Link>
      </div>

      {/* Latest Notice Alert */}
      {latestNotice && (
        <Card className="p-4 border-orange-200 bg-orange-50/50">
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="h-4 w-4 text-orange-600 animate-pulse" />
            <h4 className="text-xs font-bold text-slate-900">{latestNotice.title}</h4>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{latestNotice.content}</p>
          <Link href="/student" className="text-[11px] text-orange-600 hover:underline font-bold block mt-2">
            View Student Notice Board &rarr;
          </Link>
        </Card>
      )}

      {/* Pay Modal with UPI QR */}
      {showPayModal && (
        <Modal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          title="Instant Rent Payment via UPI"
          description={`Amount Due: ${formatINR(currentTenant.monthly_rent)} for current cycle`}
        >
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-white text-slate-900 inline-block mx-auto border border-slate-200 shadow-xs">
              <QrCode className="h-36 w-36 mx-auto text-slate-900" />
              <span className="text-[10px] font-mono font-bold block mt-1 text-orange-600">UPI ID: royalpalms@okhdfcbank</span>
            </div>

            <p className="text-xs text-slate-500">
              Scan with any UPI app (Google Pay, PhonePe, Paytm) to pay instantly.
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowPayModal(false)} className="text-xs border-slate-200">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSimulatePayment} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold">
                Simulate Payment Done &check;
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
