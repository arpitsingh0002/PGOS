'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  BedDouble,
  CreditCard,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  LogOut,
  CheckCircle2,
  Calendar,
  DollarSign,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, formatPhone, getPaymentStatusBadge, getComplaintStatusBadge } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function TenantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params?.id as string) || 'ten-1';

  const { tenants, payments, complaints, addPayment } = usePGStore();
  const tenant = tenants.find((t) => t.id === tenantId) || tenants[0];

  const tenantPayments = payments.filter((p) => p.tenant_id === tenant?.id);
  const tenantComplaints = complaints.filter((c) => c.tenant_id === tenant?.id);

  const [activeTab, setActiveTab] = React.useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'payments', label: 'Payments History', count: tenantPayments.length },
    { id: 'complaints', label: 'Complaints', count: tenantComplaints.length },
    { id: 'ledger', label: 'Statement Ledger' },
    { id: 'documents', label: 'Documents & KYC' },
    { id: 'timeline', label: 'Activity Timeline' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/tenants">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/20">
              {tenant?.full_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{tenant?.full_name}</h1>
                <Badge variant={tenant?.status === 'active' ? 'success' : 'secondary'}>
                  {tenant?.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {tenant?.room_number || 'Room 101'} &bull; {tenant?.bed_number || 'Bed A'} &bull; Joined {formatDate(tenant?.joining_date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/payments/new?tenantId=${tenant?.id}`}>
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5 text-emerald-400" /> Record Payment
            </Button>
          </Link>

          {tenant?.status === 'active' && (
            <Link href={`/tenants/${tenant?.id}/checkout`}>
              <Button size="sm" variant="danger" className="gap-1.5 text-xs">
                <LogOut className="h-3.5 w-3.5" /> Move Out / Checkout
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="glass-card md:col-span-2 space-y-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Resident Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Phone Number</span>
                  <span className="font-semibold text-white mt-0.5 block">{formatPhone(tenant.phone)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Address</span>
                  <span className="font-semibold text-white mt-0.5 block">{tenant.email || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency Contact</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {tenant.emergency_contact_name || 'Not provided'} ({tenant.emergency_contact_phone || 'None'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">ID Proof</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {tenant.id_proof_type || 'Aadhaar'}: {tenant.id_proof_number || 'Verified'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Monthly Rent</span>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">{formatINR(tenant.monthly_rent)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Deposit Held</span>
                  <p className="text-base font-bold text-indigo-400 mt-0.5">{formatINR(tenant.security_deposit)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Agreement</span>
                  <p className="text-base font-bold text-white capitalize mt-0.5">{tenant.agreement_status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accommodation Snapshot */}
          <Card className="glass-card space-y-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Bed Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Branch</span>
                <span className="font-medium text-white">{tenant.property_name || 'Royal Palms'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Building</span>
                <span className="font-medium text-white">{tenant.building_name || 'Tower A'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Room</span>
                <span className="font-medium text-white">{tenant.room_number || 'Room 101'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bed Slot</span>
                <Badge variant="success">{tenant.bed_number || 'Bed A'}</Badge>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`Payment reminder link sent via WhatsApp to ${tenant.full_name}`)}
                  className="w-full text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  Send WhatsApp Rent Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === 'payments' && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Payment Receipts & Invoices</CardTitle>
              <p className="text-xs text-slate-400">Complete transaction history for {tenant.full_name}</p>
            </div>
            <Link href={`/payments/new?tenantId=${tenant.id}`}>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Record Payment
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {tenantPayments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No payment entries found for this tenant.</p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {tenantPayments.map((p) => {
                  const badge = getPaymentStatusBadge(p.status);
                  return (
                    <div key={p.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{formatINR(p.amount)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Receipt: {p.receipt_number} &bull; For Month: {p.for_month} &bull; Paid via {p.payment_mode}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/payments/${p.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-indigo-400 gap-1">
                            <Download className="h-3.5 w-3.5" /> Receipt PDF
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Complaints Filed</CardTitle>
              <p className="text-xs text-slate-400">Maintenance requests raised by {tenant.full_name}</p>
            </div>
            <Link href={`/complaints/new?tenantId=${tenant.id}`}>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> New Ticket
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {tenantComplaints.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No maintenance complaints raised yet.</p>
            ) : (
              <div className="space-y-3">
                {tenantComplaints.map((c) => {
                  const badge = getComplaintStatusBadge(c.status);
                  return (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{c.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Reported on {formatDate(c.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 4: LEDGER */}
      {activeTab === 'ledger' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Running Financial Ledger</CardTitle>
            <p className="text-xs text-slate-400">Chronological debits (charges) and credits (payments)</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-3">{formatDate(tenant.joining_date)}</td>
                    <td className="p-3">Security Deposit Inward</td>
                    <td className="p-3 text-emerald-400 font-semibold">Credit</td>
                    <td className="p-3 text-emerald-400">{formatINR(tenant.security_deposit)}</td>
                    <td className="p-3 text-white font-medium">₹0 Due</td>
                  </tr>
                  <tr>
                    <td className="p-3">01 Mar 2025</td>
                    <td className="p-3">Monthly Rent Invoice</td>
                    <td className="p-3 text-rose-400 font-semibold">Debit</td>
                    <td className="p-3 text-rose-400">-{formatINR(tenant.monthly_rent)}</td>
                    <td className="p-3 text-rose-400 font-medium">-{formatINR(tenant.monthly_rent)} Due</td>
                  </tr>
                  <tr>
                    <td className="p-3">03 Mar 2025</td>
                    <td className="p-3">Rent Payment Received (UPI)</td>
                    <td className="p-3 text-emerald-400 font-semibold">Credit</td>
                    <td className="p-3 text-emerald-400">+{formatINR(tenant.monthly_rent)}</td>
                    <td className="p-3 text-emerald-400 font-medium">₹0 Due (Clear)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: DOCUMENTS & KYC */}
      {activeTab === 'documents' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Document Vault & Verification</CardTitle>
            <p className="text-xs text-slate-400">Govt IDs, police verification & signed rental agreements</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <Badge variant="success">Verified</Badge>
                </div>
                <h4 className="text-xs font-semibold text-white">Aadhaar Card (KYC)</h4>
                <p className="text-[11px] text-slate-400">No: {tenant.id_proof_number || '8921-4456-9901'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <Badge variant="success">Signed</Badge>
                </div>
                <h4 className="text-xs font-semibold text-white">Rental Agreement (11 Months)</h4>
                <p className="text-[11px] text-slate-400">Signed on {formatDate(tenant.joining_date)}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <FileText className="h-5 w-5 text-amber-400" />
                  <Badge variant="warning">Submitted</Badge>
                </div>
                <h4 className="text-xs font-semibold text-white">Police Intimation Receipt</h4>
                <p className="text-[11px] text-slate-400">Local station record synced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: TIMELINE */}
      {activeTab === 'timeline' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Resident Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              <div className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                <p className="text-xs font-semibold text-white">Onboarded into {tenant.bed_number || 'Bed A'}</p>
                <p className="text-[11px] text-slate-400">{formatDate(tenant.joining_date)} &bull; Security deposit received</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                <p className="text-xs font-semibold text-white">March Rent Paid</p>
                <p className="text-[11px] text-slate-400">Receipt generated & invoice emailed</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-slate-500 ring-4 ring-slate-950" />
                <p className="text-xs font-semibold text-white">Tenant portal activated</p>
                <p className="text-[11px] text-slate-400">Access credentials delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
