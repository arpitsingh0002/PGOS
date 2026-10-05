'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, FileText, BedDouble, LogOut, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, formatPhone } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function TenantProfilePage() {
  const router = useRouter();
  const { tenants } = usePGStore();
  const currentTenant = tenants[0];

  const handleLogout = () => {
    toast.success('Logged out from Tenant Portal');
    router.push('/tenant/login');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-tight">Resident Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Your KYC details and stay contract</p>
      </div>

      <div className="p-4 rounded-2xl glass-card flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-bold text-white text-base">
          {currentTenant?.full_name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{currentTenant?.full_name}</h2>
          <p className="text-xs text-slate-400">{formatPhone(currentTenant?.phone || '9876543210')}</p>
          <Badge variant="success" className="text-[10px] mt-1">Active Resident</Badge>
        </div>
      </div>

      {/* Contract & Deposit Details */}
      <Card className="glass-card p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-slate-400">Bed Slot</span>
          <span className="font-semibold text-white">
            {currentTenant?.room_number || 'Room 101'} &bull; {currentTenant?.bed_number || 'Bed A'}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-slate-400">Monthly Rent</span>
          <span className="font-bold text-emerald-400">{formatINR(currentTenant?.monthly_rent || 9500)}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-slate-400">Security Deposit Held</span>
          <span className="font-semibold text-indigo-400">{formatINR(currentTenant?.security_deposit || 19000)}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-slate-400">Move-in Date</span>
          <span className="font-medium text-white">{formatDate(currentTenant?.joining_date)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Rental Agreement</span>
          <span className="font-semibold text-emerald-400 capitalize">{currentTenant?.agreement_status || 'Signed'}</span>
        </div>
      </Card>

      {/* College & Academic Details (Used for Mess & Tiffin Batching) */}
      <Card className="glass-card p-4 space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
            Academic Information
          </span>
          <Badge variant="outline" className="text-[10px]">Tiffin Routing</Badge>
        </div>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
          <span className="text-slate-400">College / Institute</span>
          <span className="font-semibold text-white text-right max-w-[200px] truncate">
            {currentTenant?.college_name || 'BMS College of Engineering'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Course / Branch</span>
          <span className="font-medium text-slate-300">
            {currentTenant?.course || 'B.Tech CSE (3rd Year)'}
          </span>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="glass-card p-4 space-y-2 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Emergency Contact
        </span>
        <p className="font-semibold text-white">{currentTenant?.emergency_contact_name || 'Rajesh Sharma (Father)'}</p>
        <p className="text-slate-400">{formatPhone(currentTenant?.emergency_contact_phone || '9845112233')}</p>
      </Card>

      <div className="pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleLogout}
          className="w-full text-xs text-rose-400 hover:bg-rose-500/10 border-rose-500/20 gap-1.5"
        >
          <LogOut className="h-4 w-4" /> Sign Out from Resident Portal
        </Button>
      </div>
    </div>
  );
}
