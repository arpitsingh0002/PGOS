'use client';

import * as React from 'react';
import Link from 'next/link';
import { CreditCard, Download, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, getPaymentStatusBadge } from '@/lib/utils/format';

export default function TenantPaymentsPage() {
  const { payments, tenants } = usePGStore();
  const currentTenant = tenants[0];
  const myPayments = payments.filter((p) => p.tenant_id === currentTenant?.id);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-300">
        <h1 className="text-lg font-bold text-slate-950 tracking-tight">My Rent & Payment Receipts</h1>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">Verified digital transaction receipts</p>
      </div>

      <div className="space-y-3">
        {myPayments.map((p) => {
          const badge = getPaymentStatusBadge(p.status);
          return (
            <Card key={p.id} className="bg-white border-slate-300 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-950">{formatINR(p.amount)}</span>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                    Cycle: {p.for_month} &bull; {p.payment_mode}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-mono font-bold text-[11px]">{p.receipt_number}</span>
                <Link href={`/payments/${p.id}`}>
                  <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-indigo-700 hover:text-indigo-900 gap-1 p-0">
                    <Download className="h-3 w-3" /> View / Download
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
