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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Dashboard Overview
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Realtime
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Portfolio performance across {totalProperties} properties, {totalBuildings} buildings and {totalBeds} total beds.
          </p>
        </div>

        {/* Quick Operations Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/tenants/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-md shadow-indigo-600/20">
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
          </Link>
          <Link href="/payments/bulk-invoice">
            <Button size="sm" variant="secondary" className="gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-indigo-400" /> Bulk Invoicing
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Properties & Buildings */}
        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Properties</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalProperties}</span>
            <span className="text-xs text-slate-400">({totalBuildings} buildings)</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3.5 w-3.5" /> 100% active status
          </p>
        </Card>

        {/* Total Beds & Occupancy */}
        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bed Occupancy</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{occupancyRate}%</span>
            <span className="text-xs text-slate-400">({occupiedBeds}/{totalBeds} beds)</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </Card>

        {/* Vacant Beds */}
        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Vacant Beds</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{vacantBeds}</span>
            <span className="text-xs text-slate-400">available to book</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Potential upside: ~{formatINR(vacantBeds * 8500)}/mo
          </p>
        </Card>

        {/* Net Operating Income (NOI) */}
        <Card className="glass-card border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-300">Net Operating Income</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{formatINR(netOperatingIncome)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-1 border-t border-slate-800">
            <span>Rev: {formatINR(currentMonthRevenue)}</span>
            <span>Exp: {formatINR(currentMonthExpenses)}</span>
          </div>
        </Card>
      </div>

      {/* Row 2: Financial Grid & Pending Rent Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Rent Box (2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  Pending Rent Dues
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Tenants with unpaid invoices for current cycle</p>
              </div>
              <Link href="/payments" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  All rents are collected for this month!
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                          ₹
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{p.tenant_name}</p>
                          <p className="text-xs text-slate-400">{p.room_number} &bull; For {p.for_month}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-400">{formatINR(p.amount)}</p>
                          <span className="text-[10px] text-slate-400">Due now</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.success(`WhatsApp reminder sent to ${p.tenant_name}!`);
                          }}
                          className="h-8 text-xs text-emerald-400 hover:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
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
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Property Health</CardTitle>
              <p className="text-xs text-slate-400">Occupancy by branch</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {properties.map((prop) => (
                <Link
                  key={prop.id}
                  href={`/properties/${prop.id}`}
                  className="block p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {prop.name}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{prop.occupancy_rate}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{prop.city} &bull; {prop.occupied_beds}/{prop.total_beds} beds occupied</p>
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${prop.occupancy_rate}%` }}
                    />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Recent Complaints & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Complaints */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                Active Maintenance Issues
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Tenant reported issues requiring resolution</p>
            </div>
            <Link href="/complaints" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Kanban Board <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeComplaints.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No active complaints.</p>
            ) : (
              activeComplaints.map((c) => {
                const badge = getComplaintStatusBadge(c.status);
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{c.title}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Room {c.room_number} &bull; {c.tenant_name} &bull; Priority: <span className="text-amber-400 uppercase font-semibold text-[10px]">{c.priority}</span>
                      </p>
                    </div>
                    <Link href={`/complaints`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-300">
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
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" />
                Latest Verified Payments
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Realtime transaction log with digital receipts</p>
            </div>
            <Link href="/payments" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              All Payments <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-white">{p.tenant_name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.receipt_number} &bull; {p.payment_mode} &bull; {formatDate(p.payment_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">{formatINR(p.amount)}</p>
                  <Link
                    href={`/payments/${p.id}`}
                    className="text-[10px] text-indigo-400 hover:underline flex items-center justify-end gap-1 mt-0.5"
                  >
                    View Receipt <ExternalLink className="h-2.5 w-2.5" />
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
