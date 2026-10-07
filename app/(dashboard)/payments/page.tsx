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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            Rent & Payments Register
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              {payments.length} Records
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Automate rent collection, verify UPI receipts, and dispatch digital invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/payments/bulk-invoice">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-bold text-slate-900 border border-slate-300 bg-slate-100 hover:bg-slate-200">
              <FileSpreadsheet className="h-4 w-4 text-indigo-700 stroke-[2.5]" /> Bulk Invoicing
            </Button>
          </Link>
          <Link href="/payments/new">
            <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold gap-1.5 text-xs shadow-sm">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial Quick Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass-card border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Total Collected (Filtered)</span>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-700 stroke-[2.5]" />
          </div>
          <p className="text-3xl font-black text-emerald-800 mt-2">{formatINR(totalCollected)}</p>
        </Card>

        <Card className="glass-card border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Total Outstanding / Pending</span>
            <Clock className="h-4.5 w-4.5 text-amber-700 stroke-[2.5]" />
          </div>
          <p className="text-3xl font-black text-amber-800 mt-2">{formatINR(totalPending)}</p>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-700 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant name or receipt #..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-950 placeholder:text-slate-600 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-300 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-900">
              <tr>
                <th className="p-4 font-black">Receipt #</th>
                <th className="p-4 font-black">Tenant & Room</th>
                <th className="p-4 font-black">Billing Cycle</th>
                <th className="p-4 font-black">Amount</th>
                <th className="p-4 font-black">Payment Date</th>
                <th className="p-4 font-black">Mode & Ref</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
              {filtered.map((pay) => {
                const badge = getPaymentStatusBadge(pay.status);
                return (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-700">{pay.receipt_number}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-950">{pay.tenant_name || 'Resident'}</p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{pay.room_number || 'Room 101'}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-800 capitalize">{pay.for_month} &bull; {pay.payment_type}</td>
                    <td className="p-4 font-black text-slate-950 text-sm">{formatINR(pay.amount)}</td>
                    <td className="p-4 font-bold text-slate-800">{formatDate(pay.payment_date)}</td>
                    <td className="p-4">
                      <p className="text-slate-950 font-bold">{pay.payment_mode}</p>
                      {pay.transaction_ref && (
                        <span className="text-[10px] text-slate-700 font-semibold block truncate max-w-[120px]">
                          {pay.transaction_ref}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/payments/${pay.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-slate-100 gap-1">
                          <Printer className="h-3.5 w-3.5 stroke-[2.2]" /> View Receipt
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

