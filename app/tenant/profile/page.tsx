'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, FileText, BedDouble, LogOut, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { DEMO_TENANT } from '@/lib/data/initial-data';
import { formatINR, formatDate, formatPhone } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function TenantProfilePage() {
  const router = useRouter();
  const { tenants } = usePGStore();
  const currentTenant = tenants.find((t) => t.id === DEMO_TENANT.id) || tenants[0] || DEMO_TENANT;

  const handleLogout = () => {
    toast.success('Logged out from Tenant Portal');
    router.push('/tenant/login');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-12">
      <div className="pb-2 border-b border-slate-300">
        <h1 className="text-lg font-bold text-slate-950 tracking-tight">Resident Profile</h1>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">Your KYC details and stay contract</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-base shadow-xs">
          {currentTenant?.full_name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-950">{currentTenant?.full_name}</h2>
          <p className="text-xs font-semibold text-slate-700">{formatPhone(currentTenant?.phone || '9876543210')}</p>
          <Badge variant="success" className="text-[10px] mt-1 font-bold">Active Resident</Badge>
        </div>
      </div>

      {/* Contract & Deposit Details */}
      <Card className="bg-white border-slate-300 p-4 space-y-3 text-xs shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-700 font-bold">Bed Slot</span>
          <span className="font-bold text-slate-950">
            {currentTenant?.room_number || 'Room 101'} &bull; {currentTenant?.bed_number || 'Bed A'}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-700 font-bold">Monthly Rent</span>
          <span className="font-black text-emerald-800">{formatINR(currentTenant?.monthly_rent || 9500)}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-700 font-bold">Security Deposit Held</span>
          <span className="font-bold text-indigo-900">{formatINR(currentTenant?.security_deposit || 19000)}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-700 font-bold">Move-in Date</span>
          <span className="font-bold text-slate-950">{formatDate(currentTenant?.joining_date)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-bold">Rental Agreement</span>
          <span className="font-bold text-emerald-800 capitalize">{currentTenant?.agreement_status || 'Signed'}</span>
        </div>
      </Card>

      {/* College & Academic Details (Used for Mess & Tiffin Batching) */}
      <Card className="bg-white border-slate-300 p-4 space-y-2.5 text-xs shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
            Academic Information
          </span>
          <Badge variant="outline" className="text-[10px] font-bold">Tiffin Routing</Badge>
        </div>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
          <span className="text-slate-700 font-bold">College / Institute</span>
          <span className="font-bold text-slate-950 text-right max-w-[200px] truncate">
            {currentTenant?.college_name || 'BMS College of Engineering'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-bold">Course / Branch</span>
          <span className="font-semibold text-slate-900">
            {currentTenant?.course || 'B.Tech CSE (3rd Year)'}
          </span>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-white border-slate-300 p-4 space-y-2 text-xs shadow-sm">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
          Emergency Contact
        </span>
        <p className="font-bold text-slate-950">{currentTenant?.emergency_contact_name || 'Rajesh Sharma (Father)'}</p>
        <p className="text-slate-700 font-semibold">{formatPhone(currentTenant?.emergency_contact_phone || '9845112233')}</p>
      </Card>

      <div className="pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleLogout}
          className="w-full text-xs font-bold text-rose-700 hover:bg-rose-50 border-rose-300 gap-1.5"
        >
          <LogOut className="h-4 w-4" /> Sign Out from Resident Portal
        </Button>
      </div>
    </div>
  );
}
