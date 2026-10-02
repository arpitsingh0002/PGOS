'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, Share2, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, formatMonthYear } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function PaymentReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const payId = (params?.id as string) || 'pay-1';

  const { payments, properties, tenants } = usePGStore();
  const payment = payments.find((p) => p.id === payId) || payments[0];
  const property = properties.find((p) => p.id === payment?.property_id) || properties[0];
  const tenant = tenants.find((t) => t.id === payment?.tenant_id) || tenants[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Action Header - Hidden on Print */}
      <div className="no-print flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/payments">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Payment Receipt</h1>
            <p className="text-xs text-slate-400">Official proof of payment</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Receipt link copied to clipboard!');
            }}
            className="gap-1.5 text-xs"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>

          <Button size="sm" onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Printable Receipt Paper Card */}
      <div className="printable-area bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
        {/* Receipt Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                PG
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{property?.name}</h2>
            </div>
            <p className="text-xs text-slate-500">{property?.address}, {property?.city}</p>
            <p className="text-xs text-slate-500">Contact: {property?.contact_phone || '+91 98765 43210'}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
              Payment Received
            </span>
            <p className="text-xs font-mono font-bold text-slate-700 mt-2">{payment?.receipt_number}</p>
            <p className="text-xs text-slate-500 mt-0.5">Date: {formatDate(payment?.payment_date)}</p>
          </div>
        </div>

        {/* Resident & Room Details */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
              Billed To (Resident)
            </span>
            <p className="text-sm font-bold text-slate-900">{payment?.tenant_name || tenant?.full_name}</p>
            <p className="text-slate-600 mt-0.5">Room & Bed: {payment?.room_number || tenant?.room_number || 'Room 101'}</p>
            <p className="text-slate-600">Phone: {tenant?.phone || '9876543210'}</p>
          </div>

          <div className="text-right">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
              Payment Details
            </span>
            <p className="text-slate-700 font-medium capitalize">
              Billing Cycle: <span className="font-bold text-slate-900">{formatMonthYear(payment?.for_month)}</span>
            </p>
            <p className="text-slate-700 font-medium">
              Mode: <span className="font-bold text-slate-900">{payment?.payment_mode}</span>
            </p>
            {payment?.transaction_ref && (
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">Ref: {payment?.transaction_ref}</p>
            )}
          </div>
        </div>

        {/* Itemized Charge Line */}
        <div className="py-6 border-b border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="text-left pb-2">Description</th>
                <th className="text-center pb-2">Period</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-slate-900 capitalize">
                  {payment?.payment_type} Fee — {property?.name}
                </td>
                <td className="py-3 text-center text-slate-600">{payment?.for_month}</td>
                <td className="py-3 text-right font-bold text-slate-900 text-sm">
                  {formatINR(payment?.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Total Amount Paid</span>
            <span className="text-xl font-extrabold text-emerald-600">{formatINR(payment?.amount)}</span>
          </div>
        </div>

        {/* Signature Stamp & Watermark */}
        <div className="pt-8 flex items-end justify-between">
          <div className="space-y-1 text-[11px] text-slate-500">
            <p className="font-medium text-slate-700">Terms & Conditions:</p>
            <p>1. Rent is non-refundable once paid.</p>
            <p>2. This is a computer-generated digital receipt and requires no physical seal.</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-28 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 mx-auto">
              Digitally Signed
            </div>
            <p className="text-[11px] font-semibold text-slate-800 mt-1">Authorized PG Operator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
