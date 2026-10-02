'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  Plus,
  Phone,
  Shield,
  Search,
  CheckSquare,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatPhone, formatDate } from '@/lib/utils/format';

export default function StaffPage() {
  const router = useRouter();
  const { staff, tasks } = usePGStore();
  const [search, setSearch] = React.useState('');

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Staff & Workforce Directory
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {staff.length} Team Members
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managers, cooks, caretakers, security guards, cleaners and maintenance technicians
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/tasks">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
              <CheckSquare className="h-4 w-4 text-indigo-400" /> Task Board
            </Button>
          </Link>
          <Link href="/staff/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
              <Plus className="h-4 w-4" /> Add Staff Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, role or phone..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((member) => {
          const assignedTasksCount = tasks.filter((t) => t.assigned_to === member.id && t.status !== 'done').length;

          const roleColors: Record<string, string> = {
            manager: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            caretaker: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            cook: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            security: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            cleaner: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            maintenance: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          };

          return (
            <Card key={member.id} className="glass-card hover:border-indigo-500/40 transition-colors p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-sm">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleColors[member.role] || 'bg-slate-800 text-slate-300'}`}>
                    {member.role}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{member.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <Phone className="h-3 w-3 text-slate-500" /> {formatPhone(member.phone)}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Monthly Salary:</span>
                    <span className="font-semibold text-white">{formatINR(member.salary)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Open Tasks:</span>
                    <span className="font-semibold text-amber-400">{assignedTasksCount} Pending</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <Link href={`/staff/${member.id}`}>
                  <Button size="sm" variant="secondary" className="w-full text-xs">
                    View Profile &rarr;
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
