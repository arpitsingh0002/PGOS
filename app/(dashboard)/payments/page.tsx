'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Printer,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, getPaymentStatusBadge } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const router = useRouter();
  const { payments, properties, addPayment } = usePGStore();

  const [search, setSearch] = React.useState('');
  const [filterMonth, setFilterMonth] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filtered = payments.filter((p) => {
    const matchesSearch =
      (p.tenant_name && p.tenant_name.toLowerCase().includes(search.toLowerCase())) ||
      p.receipt_number.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = filterMonth === 'all' || p.for_month === filterMonth;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const totalCollected = filtered
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = filtered
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Rent & Payments Register
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {payments.length} Records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate rent collection, verify UPI receipts, and dispatch digital invoices
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/payments/bulk-invoice">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
              <FileSpreadsheet className="h-4 w-4 text-indigo-400" /> Bulk Invoicing
            </Button>
          </Link>
          <Link href="/payments/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
              <Plus className="h-4 w-4" /> Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial Quick Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Collected (Filtered)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{formatINR(totalCollected)}</p>
        </Card>

        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Outstanding / Pending</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{formatINR(totalPending)}</p>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant name or receipt #..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Receipt #</th>
                <th className="p-4 font-semibold">Tenant & Room</th>
                <th className="p-4 font-semibold">Billing Cycle</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Payment Date</th>
                <th className="p-4 font-semibold">Mode & Ref</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((pay) => {
                const badge = getPaymentStatusBadge(pay.status);
                return (
                  <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-indigo-400 font-medium">{pay.receipt_number}</td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{pay.tenant_name || 'Resident'}</p>
                      <p className="text-[11px] text-slate-400">{pay.room_number || 'Room 101'}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-300 capitalize">{pay.for_month} &bull; {pay.payment_type}</td>
                    <td className="p-4 font-bold text-white text-sm">{formatINR(pay.amount)}</td>
                    <td className="p-4 text-slate-400">{formatDate(pay.payment_date)}</td>
                    <td className="p-4">
                      <p className="text-slate-300 font-medium">{pay.payment_mode}</p>
                      {pay.transaction_ref && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                          {pay.transaction_ref}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/payments/${pay.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-indigo-400 gap-1">
                          <Printer className="h-3 w-3" /> View Receipt
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
