'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  BedDouble,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  AlertCircle,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Filter,
  BarChart2,
  Sparkles,
  Info,
  Maximize2,
  Phone,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, getComplaintStatusBadge, getPaymentStatusBadge } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const {
    properties,
    totalProperties,
    totalBuildings,
    totalRooms,
    totalBeds,
    occupiedBeds,
    vacantBeds,
    occupancyRate,
    currentMonthRevenue,
    currentMonthExpenses,
    netOperatingIncome,
    pendingPayments,
    complaints,
    payments,
  } = usePGStore();

  const [timeframe, setTimeframe] = React.useState<'hourly' | 'daily' | 'monthly'>('daily');
  const [selectedEnv, setSelectedEnv] = React.useState('All Properties');

  const recentPayments = payments.slice(0, 5);
  const activeComplaints = complaints.filter((c) => c.status !== 'resolved').slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 1. TOP METRIC STRIP (Directly Inspired by Fingerprint Screenshot) */}
      {/* Status: Trailing | Plan: Pro Plus | Usage: 477 | Ends: Apr 20 | Health: No issues found */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          {/* Status */}
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Status</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="h-2 w-2 rounded-full bg-slate-900" />
              <span>Active Portfolio</span>
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Plan</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>Pro Plus</span>
              <button
                onClick={() => toast.info('Current Plan: PGOS Enterprise Multi-Building Pro Plus')}
                className="text-[10px] text-slate-400 hover:text-orange-600 ml-0.5 font-medium"
              >
                View plans &gt;
              </button>
            </div>
          </div>

          {/* Bed Occupancy */}
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bed Usage</span>
            <div className="font-mono font-bold text-slate-900 text-sm">
              {occupiedBeds} <span className="text-slate-400 font-sans text-xs">/ {totalBeds} beds</span>
            </div>
          </div>

          {/* Billing Cycle */}
          <div className="space-y-0.5 hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Cycle Renews on</span>
            <div className="font-bold text-slate-900">Nov 05, 2026</div>
          </div>

          {/* Health Pill (Screenshot "No issues found" Emerald Pill) */}
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">System Health</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                No issues found
              </span>
              <button
                onClick={() => toast.success('All properties operating at 100% telemetry uptime.')}
                className="text-[10px] text-slate-400 hover:text-slate-700 hidden sm:inline"
              >
                View health &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Top Action Pills (Screenshot "Share feedback", "Ask AI", "Docs", "Support") */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => toast.success('Feedback dialog opened')}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-medium"
          >
            Share feedback
          </button>
          <Link
            href="/tenants/new"
            className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Tenant
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. INSIGHTS HEADER WITH FILTERS & 3 STAT CARDS */}
      {/* (Fingerprint "Insights" + Usage / Average RPS / Events per visitor) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {/* Insights Section Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Insights
          </h2>

          <div className="flex items-center gap-2">
            {/* Environment Dropdown */}
            <div className="relative">
              <select
                value={selectedEnv}
                onChange={(e) => setSelectedEnv(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-orange-500 shadow-xs cursor-pointer"
              >
                <option value="All Properties">All Properties (Portfolio)</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range Badge */}
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center gap-1.5 shadow-xs">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Oct 01, 2026 – Oct 31, 2026</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards (Usage / Average RPS / Events per visitor) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Occupancy Usage */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Portfolio Bed Occupancy</span>
              <BedDouble className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {occupancyRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {occupiedBeds} occupied &bull; {vacantBeds} vacant beds available
            </p>
          </div>

          {/* Card 2: Average Monthly Collection Rate */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Net Operating Income (NOI)</span>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatINR(netOperatingIncome)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +14.2% month-on-month velocity
            </p>
          </div>

          {/* Card 3: Events Per Tenant / Rent Turn */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Current Monthly Revenue</span>
              <CreditCard className="h-3.5 w-3.5 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatINR(currentMonthRevenue)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {pendingPayments.length} pending rent collections remaining
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN INTERACTIVE CHART CARD ("Events per visitor" Style) */}
      {/* With Orange Wave Line Chart, Hourly/Daily/Monthly tabs, Tip alert */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Rent Collections & Occupancy Velocity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Shows the ratio of digital payments and room check-ins across active hostel branches.
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                ₹1,85,250
              </span>
              <span className="text-xs font-bold text-emerald-600">
                +100% compared to previous cycle
              </span>
            </div>
          </div>

          {/* Top-Right Toggle Controls (Hourly / Daily / Monthly) */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimeframe('hourly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === 'hourly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('daily')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === 'daily'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
            </div>

            <button
              onClick={() => toast.info('Expanded high-resolution vector view')}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span>UPI & Net Banking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>Active Bed Check-Ins</span>
          </div>
        </div>

        {/* SVG Wave Line Chart (Matching Screenshot's Coral/Orange Peaks) */}
        <div className="relative h-56 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="190" x2="800" y2="190" stroke="#e2e8f0" strokeWidth="1" />

            {/* Indigo Comparison Line (Occupancy check-ins) */}
            <path
              d="M 0 180 Q 80 180 140 170 T 260 160 T 340 120 T 420 80 T 500 130 T 580 90 T 660 140 T 740 60 L 800 110"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.8"
            />

            {/* Orange Area Gradient Fill */}
            <path
              d="M 0 190 Q 60 185 120 180 T 240 170 T 300 110 T 360 40 T 420 130 T 480 80 T 540 140 T 600 70 T 680 120 T 740 30 L 800 110 L 800 190 L 0 190 Z"
              fill="url(#orangeGrad)"
            />

            {/* Primary Orange Line (Collections Velocity) */}
            <path
              d="M 0 190 Q 60 185 120 180 T 240 170 T 300 110 T 360 40 T 420 130 T 480 80 T 540 140 T 600 70 T 680 120 T 740 30 L 800 110"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Peak Points */}
            <circle cx="360" cy="40" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            <circle cx="740" cy="30" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Time axis */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
            <span>08:00 AM</span>
            <span>12:00 PM</span>
            <span>04:00 PM</span>
            <span>08:00 PM</span>
            <span>11:59 PM</span>
          </div>
        </div>

        {/* Tip / Warning Banner (Matching screenshot bottom banner) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
          <Info className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span>
            Automated WhatsApp rent reminders sent on the 1st of every month reduce payment delays by 42%.{' '}
            <button
              onClick={() => toast.info('WhatsApp reminder engine active across all 3 properties.')}
              className="text-orange-600 hover:underline font-bold"
            >
              Learn more
            </button>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. THREE BREAKDOWN TABLES (Matching Screenshot Bottom Row: */}
      {/* Top Operating Systems, Top Browsers, Top URLs) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Table 1: Top Properties by Occupancy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Top Properties (Occupancy)</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">Beds</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Royal Palms Residency', beds: '12 / 12 (100%)', pct: 100 },
              { name: 'Campus View Executive PG', beds: '8 / 9 (88.8%)', pct: 88 },
              { name: 'Greenox Studio Suites', beds: '4 / 5 (80.0%)', pct: 80 },
            ].map((item) => (
              <div key={item.name} className="relative py-1">
                <div
                  className="absolute inset-y-0 left-0 bg-orange-50/70 rounded-lg pointer-events-none"
                  style={{ width: `${item.pct}%` }}
                />
                <div className="relative flex items-center justify-between px-2">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="font-mono text-slate-600 font-bold">{item.beds}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link href="/properties" className="text-xs text-orange-600 hover:underline font-bold">
              See more properties &gt;
            </Link>
          </div>
        </div>

        {/* Table 2: Top Rent Collection Modes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Payment Channels</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">Share</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: 'UPI Dynamic QR (PhonePe/GPay)', count: '68%', pct: 68 },
              { name: 'Bank IMPS / Direct Transfer', count: '20%', pct: 20 },
              { name: 'PGOS Payment Gateway', count: '10%', pct: 10 },
              { name: 'Cash with Floor Warden', count: '2%', pct: 2 },
            ].map((item) => (
              <div key={item.name} className="relative py-1">
                <div
                  className="absolute inset-y-0 left-0 bg-orange-50/70 rounded-lg pointer-events-none"
                  style={{ width: `${item.pct}%` }}
                />
                <div className="relative flex items-center justify-between px-2">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="font-mono text-slate-600 font-bold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link href="/payments" className="text-xs text-orange-600 hover:underline font-bold">
              See more payments &gt;
            </Link>
          </div>
        </div>

        {/* Table 3: Top Stay Types */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Inventory Distribution</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">Units</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: '1. Student Hostels', count: '14 Beds', color: 'text-orange-600' },
              { name: '2. Executive PGs', count: '8 Beds', color: 'text-indigo-600' },
              { name: '3. Shared 2BHK Flats', count: '3 Units', color: 'text-emerald-600' },
              { name: '4. Private Studio Rooms', count: '1 Unit', color: 'text-cyan-600' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className={`font-mono font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link href="/tenants" className="text-xs text-orange-600 hover:underline font-bold">
              See tenant directory &gt;
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. PENDING DUES & ACTIVE COMPLAINTS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Rent Dues Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Pending Rent Dues
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tenants awaiting current billing clearance</p>
            </div>
            <Link href="/payments" className="text-xs text-orange-600 hover:underline font-bold">
              All Invoices &gt;
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {pendingPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{p.tenant_name}</p>
                  <p className="text-[11px] text-slate-500">{p.room_number} &bull; For {p.for_month}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-slate-900">{formatINR(p.amount)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`WhatsApp reminder sent to ${p.tenant_name}!`)}
                    className="h-8 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1"
                  >
                    <Phone className="h-3 w-3" /> Remind
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Tickets Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                Active Maintenance Issues
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Reported by hostel and PG residents</p>
            </div>
            <Link href="/complaints" className="text-xs text-orange-600 hover:underline font-bold">
              Kanban Board &gt;
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {activeComplaints.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900">{c.title}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Room {c.room_number} &bull; Priority: <span className="text-orange-600 font-bold uppercase">{c.priority}</span>
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success(`Complaint marked resolved!`);
                  }}
                  className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Resolve &rarr;
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
