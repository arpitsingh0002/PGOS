'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Receipt, Plus, Search, Filter, TrendingDown, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate } from '@/lib/utils/format';

export default function ExpensesPage() {
  const router = useRouter();
  const { expenses, properties } = usePGStore();
  const [search, setSearch] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.vendor_name && e.vendor_name.toLowerCase().includes(search.toLowerCase())) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const totalExpenses = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            Operational Expenses
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
              {expenses.length} Records
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Track groceries, power utilities, staff payroll, Wi-Fi and repairs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/finance/reports">
            <Button size="sm" variant="secondary" className="text-xs font-bold text-slate-900 border border-slate-300 bg-slate-100 hover:bg-slate-200">
              P&L Reports
            </Button>
          </Link>
          <Link href="/expenses/new">
            <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold gap-1.5 text-xs shadow-sm">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Expense Metric */}
      <Card className="glass-card border-slate-300 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Total Filtered Operating Outflow</span>
          <TrendingDown className="h-4.5 w-4.5 text-rose-700 stroke-[2.5]" />
        </div>
        <p className="text-3xl font-black text-rose-800 mt-2">{formatINR(totalExpenses)}</p>
      </Card>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-700 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description, vendor or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-950 placeholder:text-slate-600 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="Groceries & Mess">Groceries & Mess</option>
          <option value="Electricity & Utilities">Electricity & Utilities</option>
          <option value="Staff Salaries">Staff Salaries</option>
          <option value="High-speed Internet">High-speed Internet</option>
          <option value="Maintenance & Plumbing">Maintenance & Plumbing</option>
        </select>
      </div>

      {/* Expenses Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-300 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-900">
              <tr>
                <th className="p-4 font-black">Category</th>
                <th className="p-4 font-black">Description</th>
                <th className="p-4 font-black">Vendor</th>
                <th className="p-4 font-black">Building</th>
                <th className="p-4 font-black">Date</th>
                <th className="p-4 font-black text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-indigo-700">{exp.category}</td>
                  <td className="p-4 font-bold text-slate-950">{exp.description}</td>
                  <td className="p-4 font-semibold text-slate-800">{exp.vendor_name || 'General Vendor'}</td>
                  <td className="p-4 font-semibold text-slate-700">{exp.building_name || 'All Buildings'}</td>
                  <td className="p-4 font-bold text-slate-800">{formatDate(exp.expense_date)}</td>
                  <td className="p-4 font-black text-rose-800 text-sm text-right">
                    {formatINR(exp.amount)}
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
