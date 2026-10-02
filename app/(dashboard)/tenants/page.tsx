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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Tenant Directory
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {tenants.filter((t) => t.status === 'active').length} Active Residents
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage onboarding, rent contracts, security deposits and checkout settlements
          </p>
        </div>

        <Link href="/tenants/new">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-md shadow-indigo-600/20">
            <Plus className="h-4 w-4" /> Onboard Tenant
          </Button>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or room..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="checked_out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Tenant</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Room & Bed</th>
                <th className="p-4 font-semibold">Monthly Rent</th>
                <th className="p-4 font-semibold">Joining Date</th>
                <th className="p-4 font-semibold">Agreement</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                        {tenant.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/tenants/${tenant.id}`} className="font-semibold text-white hover:text-indigo-300">
                          {tenant.full_name}
                        </Link>
                        <p className="text-[11px] text-slate-400">{tenant.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{formatPhone(tenant.phone)}</p>
                    <span className="text-[10px] text-slate-400">Emerg: {tenant.emergency_contact_phone || 'None'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <BedDouble className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{tenant.room_number || 'Room 101'}</span>
                      <span className="text-slate-400 text-[11px]">({tenant.bed_number || 'Bed A'})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{tenant.building_name || 'Tower A'}</span>
                  </td>
                  <td className="p-4 font-bold text-emerald-400">
                    {formatINR(tenant.monthly_rent)}
                    <span className="block text-[10px] text-slate-400 font-normal">Dep: {formatINR(tenant.security_deposit)}</span>
                  </td>
                  <td className="p-4 text-slate-300">{formatDate(tenant.joining_date)}</td>
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
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-indigo-400">
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
