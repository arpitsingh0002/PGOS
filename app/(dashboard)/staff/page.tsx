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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
            Staff & Workforce Directory
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 border border-indigo-300">
              {staff.length} Team Members
            </span>
          </h1>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            Managers, cooks, caretakers, security guards, cleaners and maintenance technicians
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/tasks">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-bold border border-slate-300 text-slate-900 hover:bg-slate-100">
              <CheckSquare className="h-4 w-4 text-indigo-700" /> Task Board
            </Button>
          </Link>
          <Link href="/staff/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 text-xs shadow-md shadow-indigo-600/20">
              <Plus className="h-4 w-4" /> Add Staff Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, role or phone..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-950 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none shadow-sm"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((member) => {
          const assignedTasksCount = tasks.filter((t) => t.assigned_to === member.id && t.status !== 'done').length;

          const roleColors: Record<string, string> = {
            manager: 'bg-purple-100 text-purple-950 border-purple-300',
            caretaker: 'bg-indigo-100 text-indigo-950 border-indigo-300',
            cook: 'bg-amber-100 text-amber-950 border-amber-300',
            security: 'bg-blue-100 text-blue-950 border-blue-300',
            cleaner: 'bg-cyan-100 text-cyan-950 border-cyan-300',
            maintenance: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          };

          return (
            <Card key={member.id} className="bg-white border-slate-300 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-950 text-sm shadow-xs">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleColors[member.role] || 'bg-slate-100 text-slate-950 border-slate-300'}`}>
                    {member.role}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-950">{member.name}</h3>
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-1">
                  <Phone className="h-3 w-3 text-slate-500" /> {formatPhone(member.phone)}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Monthly Salary:</span>
                    <span className="font-bold text-slate-950">{formatINR(member.salary)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Open Tasks:</span>
                    <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{assignedTasksCount} Pending</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <Link href={`/staff/${member.id}`}>
                  <Button size="sm" variant="secondary" className="w-full text-xs font-bold border border-slate-300 text-slate-900 hover:bg-slate-100">
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
