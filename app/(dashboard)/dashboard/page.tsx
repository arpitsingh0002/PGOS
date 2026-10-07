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

  const recentPayments = payments.slice(0, 5);
  const activeComplaints = complaints.filter((c) => c.status !== 'resolved').slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 flex items-center gap-2.5">
            Dashboard Overview
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
              Live Realtime
            </span>
          </h1>
          <p className="text-sm font-bold text-slate-800 mt-1">
            Portfolio performance across <span className="text-slate-950 font-black">{totalProperties}</span> properties, <span className="text-slate-950 font-black">{totalBuildings}</span> buildings and <span className="text-slate-950 font-black">{totalBeds}</span> total beds.
          </p>
        </div>

        {/* Quick Operations Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/tenants/new">
            <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold gap-1.5 shadow-sm">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Add Tenant
            </Button>
          </Link>
          <Link href="/payments/bulk-invoice">
            <Button size="sm" variant="secondary" className="gap-1.5 font-bold text-slate-900 border border-slate-300 bg-slate-100 hover:bg-slate-200">
              <FileSpreadsheet className="h-4 w-4 text-indigo-700 stroke-[2.5]" /> Bulk Invoicing
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Properties & Buildings */}
        <Card className="glass-card border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Total Properties</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Building2 className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950">{totalProperties}</span>
            <span className="text-xs font-bold text-slate-800">({totalBuildings} buildings)</span>
          </div>
          <p className="text-xs text-emerald-800 flex items-center gap-1 mt-2.5 font-bold">
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /> 100% active status
          </p>
        </Card>

        {/* Total Beds & Occupancy */}
        <Card className="glass-card border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Bed Occupancy</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BedDouble className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950">{occupancyRate}%</span>
            <span className="text-xs font-bold text-slate-800">({occupiedBeds}/{totalBeds} beds)</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/60">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </Card>

        {/* Vacant Beds */}
        <Card className="glass-card border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Vacant Beds</span>
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Users className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-800">{vacantBeds}</span>
            <span className="text-xs font-bold text-slate-800">available to book</span>
          </div>
          <p className="text-xs font-bold text-slate-800 mt-2.5">
            Potential upside: <span className="text-emerald-800 font-black">~{formatINR(vacantBeds * 8500)}/mo</span>
          </p>
        </Card>

        {/* Net Operating Income (NOI) */}
        <Card className="glass-card border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">Net Operating Income</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <TrendingUp className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-950">{formatINR(netOperatingIncome)}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mt-2.5 pt-2 border-t border-indigo-200">
            <span className="text-emerald-800 font-bold">Rev: {formatINR(currentMonthRevenue)}</span>
            <span className="text-rose-800 font-bold">Exp: {formatINR(currentMonthExpenses)}</span>
          </div>
        </Card>
      </div>

      {/* Row 2: Financial Grid & Pending Rent Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Rent Box (2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full flex flex-col justify-between border-slate-300 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <CardTitle className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-amber-600 stroke-[2.5]" />
                  Pending Rent Dues
                </CardTitle>
                <p className="text-xs font-bold text-slate-700 mt-1">Tenants with unpaid invoices for current cycle</p>
              </div>
              <Link href="/payments" className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {pendingPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-700 font-bold text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2 stroke-[2.5]" />
                  All rents are collected for this month!
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300 hover:border-slate-400 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-black text-sm">
                          ₹
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-950">{p.tenant_name}</p>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">{p.room_number} &bull; For {p.for_month}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-black text-amber-800">{formatINR(p.amount)}</p>
                          <span className="text-[11px] text-rose-800 bg-rose-100 border border-rose-300 font-bold px-2 py-0.5 rounded-md inline-block mt-0.5">Due now</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.success(`WhatsApp reminder sent to ${p.tenant_name}!`);
                          }}
                          className="h-8 text-xs font-bold text-emerald-800 hover:text-emerald-950 border-emerald-400 bg-emerald-50 hover:bg-emerald-100 shadow-xs"
                        >
                          Send WhatsApp
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Property Occupancy Breakdown */}
        <div className="lg:col-span-1">
          <Card className="glass-card h-full border-slate-300 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-200">
              <CardTitle className="text-base font-bold text-slate-950">Property Health</CardTitle>
              <p className="text-xs font-bold text-slate-700 mt-0.5">Occupancy by branch</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {properties.map((prop) => {
                const totalBedsCount = prop.total_beds ?? (prop.id === 'prop-1' ? 18 : prop.id === 'prop-2' ? 12 : 10);
                const occupiedBedsCount = prop.occupied_beds ?? (prop.id === 'prop-1' ? 15 : prop.id === 'prop-2' ? 11 : 8);
                const occRate = prop.occupancy_rate ?? Math.round((occupiedBedsCount / Math.max(1, totalBedsCount)) * 100);

                return (
                  <Link
                    key={prop.id}
                    href={`/properties/${prop.id}`}
                    className="block p-3.5 rounded-xl bg-slate-50 border border-slate-300 hover:border-indigo-400 hover:bg-slate-100/80 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-950 group-hover:text-indigo-700 transition-colors">
                        {prop.name}
                      </span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                        {occRate}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 mt-1.5">
                      {prop.city} &bull; <span className="text-slate-950 font-black">{occupiedBedsCount}/{totalBedsCount}</span> beds occupied
                    </p>
                    <div className="mt-2.5 w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/60">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${occRate}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Recent Complaints & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Complaints */}
        <Card className="glass-card border-slate-300 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <CardTitle className="text-base font-bold text-slate-950 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 stroke-[2.5]" />
                Active Maintenance Issues
              </CardTitle>
              <p className="text-xs font-bold text-slate-700 mt-1">Tenant reported issues requiring resolution</p>
            </div>
            <Link href="/complaints" className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1">
              Kanban Board <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {activeComplaints.length === 0 ? (
              <p className="text-xs font-bold text-slate-700 py-6 text-center">No active complaints.</p>
            ) : (
              activeComplaints.map((c) => {
                const badge = getComplaintStatusBadge(c.status);
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-950">{c.title}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1.5">
                        Room <span className="text-slate-950 font-black">{c.room_number}</span> &bull; <span className="text-slate-950 font-bold">{c.tenant_name}</span> &bull; Priority: <span className="text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded uppercase font-black text-[10px]">{c.priority}</span>
                      </p>
                    </div>
                    <Link href={`/complaints`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-slate-900 hover:text-indigo-700 hover:bg-slate-100">
                        Resolve &rarr;
                      </Button>
                    </Link>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Rent Payments */}
        <Card className="glass-card border-slate-300 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <CardTitle className="text-base font-bold text-slate-950 flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-emerald-600 stroke-[2.5]" />
                Latest Verified Payments
              </CardTitle>
              <p className="text-xs font-bold text-slate-700 mt-1">Realtime transaction log with digital receipts</p>
            </div>
            <Link href="/payments" className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1">
              All Payments <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {recentPayments.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-950">{p.tenant_name}</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">
                    <span className="font-mono text-slate-950 font-bold">{p.receipt_number}</span> &bull; <span className="text-slate-950 font-bold">{p.payment_mode}</span> &bull; {formatDate(p.payment_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-800">{formatINR(p.amount)}</p>
                  <Link
                    href={`/payments/${p.id}`}
                    className="text-xs text-indigo-700 hover:text-indigo-900 hover:underline flex items-center justify-end gap-1 mt-1 font-bold"
                  >
                    View Receipt <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
