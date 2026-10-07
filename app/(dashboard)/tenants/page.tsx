'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Search,
  Phone,
  BedDouble,
  ChevronRight,
  ExternalLink,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, formatPhone } from '@/lib/utils/format';

export default function TenantsPage() {
  const router = useRouter();
  const { tenants, properties } = usePGStore();
  const [search, setSearch] = React.useState('');
  const [filterProperty, setFilterProperty] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filtered = tenants.filter((t) => {
    const matchesSearch =
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) ||
      (t.room_number && t.room_number.includes(search));
    const matchesProp = filterProperty === 'all' || t.property_id === filterProperty;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesProp && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            Tenant Directory
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
              {tenants.filter((t) => t.status === 'active').length} Active Residents
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Manage onboarding, rent contracts, security deposits and checkout settlements
          </p>
        </div>

        <Link href="/tenants/new">
          <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold gap-1.5 shadow-sm">
            <Plus className="h-4 w-4 stroke-[2.5]" /> Onboard Tenant
          </Button>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-700 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or room..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-950 placeholder:text-slate-600 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer"
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="checked_out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-300 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-900">
              <tr>
                <th className="p-4 font-black">Tenant</th>
                <th className="p-4 font-black">Contact</th>
                <th className="p-4 font-black">Room & Bed</th>
                <th className="p-4 font-black">Monthly Rent</th>
                <th className="p-4 font-black">Joining Date</th>
                <th className="p-4 font-black">Agreement</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
              {filtered.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                        {tenant.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/tenants/${tenant.id}`} className="font-bold text-slate-950 hover:text-indigo-700">
                          {tenant.full_name}
                        </Link>
                        <p className="text-[11px] font-semibold text-slate-700">{tenant.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-950">{formatPhone(tenant.phone)}</p>
                    <span className="text-[10px] font-semibold text-slate-700">Emerg: {tenant.emergency_contact_phone || 'None'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-950">
                      <BedDouble className="h-3.5 w-3.5 text-indigo-700 stroke-[2.5]" />
                      <span>{tenant.room_number || 'Room 101'}</span>
                      <span className="text-slate-700 text-[11px]">({tenant.bed_number || 'Bed A'})</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">{tenant.building_name || 'Tower A'}</span>
                  </td>
                  <td className="p-4 font-black text-emerald-800">
                    {formatINR(tenant.monthly_rent)}
                    <span className="block text-[10px] text-slate-700 font-bold">Dep: {formatINR(tenant.security_deposit)}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{formatDate(tenant.joining_date)}</td>
                  <td className="p-4">
                    <Badge variant={tenant.agreement_status === 'signed' ? 'success' : 'warning'} className="capitalize text-[10px]">
                      {tenant.agreement_status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'} className="capitalize text-[10px]">
                      {tenant.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/tenants/${tenant.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-slate-100">
                          View &rarr;
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
