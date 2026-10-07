'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Check, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

function PaymentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preTenantId = searchParams.get('tenantId');

  const { tenants, properties, addPayment } = usePGStore();
  const [tenantId, setTenantId] = React.useState(preTenantId || tenants[0]?.id || 'ten-1');

  const selectedTenant = tenants.find((t) => t.id === tenantId);

  const [amount, setAmount] = React.useState(selectedTenant?.monthly_rent || 9500);
  const [paymentType, setPaymentType] = React.useState<'rent' | 'electricity' | 'mess' | 'deposit'>('rent');
  const [forMonth, setForMonth] = React.useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [paymentDate, setPaymentDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = React.useState('UPI (GPay / PhonePe)');
  const [transactionRef, setTransactionRef] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (selectedTenant && !preTenantId) {
      setAmount(selectedTenant.monthly_rent);
    }
  }, [selectedTenant, preTenantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    const created = addPayment({
      property_id: selectedTenant.property_id,
      tenant_id: selectedTenant.id,
      amount: Number(amount),
      payment_type: paymentType,
      for_month: forMonth,
      payment_date: paymentDate,
      status: 'paid',
      payment_mode: paymentMode,
      transaction_ref: transactionRef || `UPI/${Date.now()}`,
      notes,
      tenant_name: selectedTenant.full_name,
      room_number: `${selectedTenant.room_number || 'Room 101'} (${selectedTenant.bed_number || 'Bed A'})`,
    });

    toast.success(`Payment receipt #${created.receipt_number} generated!`);
    router.push(`/payments/${created.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/payments">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Record Rent or Utility Payment</h1>
          <p className="text-xs text-slate-400">Issue an instant digital receipt and update tenant ledger</p>
        </div>
      </div>

      <Card className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Resident / Tenant *</label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} — {t.room_number} ({t.bed_number}) &bull; ₹{t.monthly_rent}/mo
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Amount Received (₹) *</label>
              <Input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Payment Category</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="rent">Monthly Rent</option>
                <option value="electricity">Electricity Submeter</option>
                <option value="mess">Mess & Meals</option>
                <option value="deposit">Security Deposit</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Billing Month (YYYY-MM)</label>
              <Input
                value={forMonth}
                onChange={(e) => setForMonth(e.target.value)}
                placeholder="2025-03"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Payment Date</label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="UPI (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Net Banking / NEFT / IMPS">Net Banking / NEFT / IMPS</option>
                <option value="Cash">Cash at Reception</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">UTR / Transaction Ref Number</label>
              <Input
                placeholder="e.g. 481920381029"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Internal Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cleared via HDFC Bank statement"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link href="/payments">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25">
              <Check className="h-4 w-4" /> Issue Verified Receipt
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


export default function NewPaymentPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading payment form...</div>}>
      <PaymentFormContent />
    </React.Suspense>
  );
}

