'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, CheckCircle2, AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function TenantCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params?.id as string) || 'ten-1';

  const { tenants, checkoutTenant } = usePGStore();
  const tenant = tenants.find((t) => t.id === tenantId) || tenants[0];

  const [checkoutDate, setCheckoutDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [paintingDeduction, setPaintingDeduction] = React.useState(1500);
  const [electricityDeduction, setElectricityDeduction] = React.useState(850);
  const [damageDeduction, setDamageDeduction] = React.useState(0);
  const [notes, setNotes] = React.useState('Key returned, room inspection clear.');

  const totalDeductions = Number(paintingDeduction) + Number(electricityDeduction) + Number(damageDeduction);
  const deposit = tenant?.security_deposit || 19000;
  const netRefund = Math.max(0, deposit - totalDeductions);

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    checkoutTenant(tenant.id);
    toast.success(`${tenant.full_name} checked out successfully. Bed marked available.`);
    router.push('/tenants');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href={`/tenants/${tenant?.id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Checkout Resident: {tenant?.full_name}</h1>
          <p className="text-xs text-slate-400">
            Vacate bed {tenant?.bed_number || 'Bed A'} &bull; Settle security deposit & deductions
          </p>
        </div>
      </div>

      <Card className="glass-card">
        <form onSubmit={handleConfirmCheckout} className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <p className="font-semibold text-amber-300">Important Action</p>
              <p className="mt-0.5">
                Executing this checkout will change {tenant?.full_name}&apos;s status to <strong>Checked Out</strong> and immediately free their bed slot in Room {tenant?.room_number} to <strong>Available</strong> for new bookings.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Official Checkout Date</label>
            <Input
              type="date"
              required
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />
          </div>

          {/* Deductions Breakdown */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Deposit Deductions Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Deep Cleaning & Paint (₹)</label>
                <Input
                  type="number"
                  value={paintingDeduction}
                  onChange={(e) => setPaintingDeduction(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Pending Electricity / Mess (₹)</label>
                <Input
                  type="number"
                  value={electricityDeduction}
                  onChange={(e) => setElectricityDeduction(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Damages / Repairs (₹)</label>
                <Input
                  type="number"
                  value={damageDeduction}
                  onChange={(e) => setDamageDeduction(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Refund Calculation Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Original Security Deposit Held</span>
              <span className="font-semibold text-white">{formatINR(deposit)}</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span>Total Deductions</span>
              <span className="font-semibold">-{formatINR(totalDeductions)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold">
              <span className="text-white">Net Refundable Security Deposit</span>
              <span className="text-emerald-400">{formatINR(netRefund)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Inspection & Settlement Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Returned AC remote, keys handed over to caretaker"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link href={`/tenants/${tenant?.id}`}>
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button type="submit" size="sm" variant="danger" className="gap-1.5 shadow-lg shadow-rose-600/25">
              <LogOut className="h-4 w-4" /> Confirm Move Out & Free Bed
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
