'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileSpreadsheet, Check, Sparkles, Building2, Calendar, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function BulkInvoicePage() {
  const router = useRouter();
  const { properties, tenants, addPayment } = usePGStore();

  const [selectedPropId, setSelectedPropId] = React.useState(properties[0]?.id || 'prop-1');
  const [targetMonth, setTargetMonth] = React.useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isGenerated, setIsGenerated] = React.useState(false);

  const activeTenants = tenants.filter(
    (t) => (selectedPropId === 'all' || t.property_id === selectedPropId) && t.status === 'active'
  );

  const totalInvoiceAmount = activeTenants.reduce((sum, t) => sum + t.monthly_rent, 0);

  const handleGenerateInvoices = () => {
    activeTenants.forEach((tenant) => {
      addPayment({
        property_id: tenant.property_id,
        tenant_id: tenant.id,
        amount: tenant.monthly_rent,
        payment_type: 'rent',
        for_month: targetMonth,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        payment_mode: 'UPI',
        tenant_name: tenant.full_name,
        room_number: `${tenant.room_number || 'Room 101'} (${tenant.bed_number || 'Bed A'})`,
        notes: `Automated bulk invoice for ${targetMonth}`,
      });
    });

    setIsGenerated(true);
    toast.success(`Successfully generated ${activeTenants.length} rent invoices for ${targetMonth}!`);
    setTimeout(() => {
      router.push('/payments');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/payments">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Bulk Invoice Generation</h1>
          <p className="text-xs text-slate-400">Generate monthly rent dues for all occupied beds in 1-click</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white">Select Cycle & Branch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Property / Branch</label>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Billing Month Cycle</label>
              <input
                type="month"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Occupied Beds Ready to Invoice ({activeTenants.length})
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Total: {formatINR(totalInvoiceAmount)}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 max-h-60 overflow-y-auto divide-y divide-slate-800/80">
              {activeTenants.map((t) => (
                <div key={t.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">{t.full_name}</p>
                    <p className="text-[11px] text-slate-400">{t.room_number} &bull; {t.bed_number}</p>
                  </div>
                  <span className="font-bold text-white">{formatINR(t.monthly_rent)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link href="/payments">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button
              type="button"
              onClick={handleGenerateInvoices}
              disabled={isGenerated || activeTenants.length === 0}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25"
            >
              <Check className="h-4 w-4" />
              {isGenerated ? 'Invoices Created!' : `Confirm & Generate (${activeTenants.length} Invoices)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
