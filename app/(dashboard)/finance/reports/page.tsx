'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Building2,
  DollarSign,
  PieChart as PieIcon,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';

export default function FinancialReportsPage() {
  const { payments, expenses, properties, buildings } = usePGStore();

  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + p.amount, 0);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netIncome / totalRevenue) * 100) : 0;

  // Monthly Chart Data
  const chartData = [
    { month: 'Oct 24', revenue: 95000, expenses: 42000, profit: 53000 },
    { month: 'Nov 24', revenue: 110000, expenses: 48000, profit: 62000 },
    { month: 'Dec 24', revenue: 125000, expenses: 54000, profit: 71000 },
    { month: 'Jan 25', revenue: 130000, expenses: 58000, profit: 72000 },
    { month: 'Feb 25', revenue: 138000, expenses: 62000, profit: 76000 },
    { month: 'Mar 25 (Live)', revenue: totalRevenue, expenses: totalExpenses, profit: netIncome },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Type,ID,Party/Category,Amount,Date,Status\n' +
      payments.map((p) => `Revenue,${p.receipt_number},${p.tenant_name || 'Resident'},${p.amount},${p.payment_date},${p.status}`).join('\n') +
      '\n' +
      expenses.map((e) => `Expense,${e.id},${e.category} - ${e.description},${e.amount},${e.expense_date},Paid`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PGOS_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Financial Report CSV exported successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Financial Analytics & P&L Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revenue vs Expenses, profit margins, and branch-level cashflow analysis
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleExportCSV}
          className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20"
        >
          <Download className="h-4 w-4" /> Export CSV Statement
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card">
          <span className="text-xs text-slate-400">Total Collected Revenue</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{formatINR(totalRevenue)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active billing cycles</span>
        </Card>

        <Card className="glass-card">
          <span className="text-xs text-slate-400">Total Operating Expenses</span>
          <p className="text-2xl font-bold text-rose-400 mt-2">{formatINR(totalExpenses)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Groceries, power & salaries</span>
        </Card>

        <Card className="glass-card border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-slate-900">
          <span className="text-xs text-indigo-300">Net Operating Income (NOI)</span>
          <p className="text-2xl font-bold text-white mt-2">{formatINR(netIncome)}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> High Margin Operations
          </span>
        </Card>

        <Card className="glass-card">
          <span className="text-xs text-slate-400">Operating Profit Margin</span>
          <p className="text-2xl font-bold text-indigo-400 mt-2">{profitMargin}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Healthy PG benchmark (&gt;35%)</span>
        </Card>
      </div>

      {/* Recharts Bar Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Revenue vs Expense Trend (Last 6 Months)</CardTitle>
          <p className="text-xs text-slate-400">Historical performance in INR (₹)</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: number) => [formatINR(val), '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
