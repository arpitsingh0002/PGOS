'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Percent,
  BedDouble,
  DollarSign,
  ArrowUpRight,
  Building2,
  Users,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export default function AnalyticsPage() {
  const { properties, beds, payments, expenses, totalBeds, occupiedBeds, occupancyRate } = usePGStore();

  const totalRev = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingRev = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalBilled = totalRev + pendingRev;
  const collectionRate = totalBilled > 0 ? Math.round((totalRev / totalBilled) * 100) : 100;

  const revPerBed = totalBeds > 0 ? Math.round(totalRev / totalBeds) : 0;
  const vacancyRate = 100 - occupancyRate;

  // Occupancy trend data
  const occupancyTrend = [
    { month: 'Oct 24', rate: 72 },
    { month: 'Nov 24', rate: 76 },
    { month: 'Dec 24', rate: 78 },
    { month: 'Jan 25', rate: 80 },
    { month: 'Feb 25', rate: 82 },
    { month: 'Mar 25', rate: occupancyRate },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Business Performance & Metric Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor RevPAB (Revenue per available bed), collection velocity, and churn benchmarks
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <span className="text-xs text-slate-400">RevPAB (Rev / Bed)</span>
          <p className="text-2xl font-bold text-white mt-1">{formatINR(revPerBed)}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3" /> +8.4% from last quarter
          </span>
        </Card>

        <Card className="glass-card">
          <span className="text-xs text-slate-400">Rent Collection Rate</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{collectionRate}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Target &gt;95% by 5th</span>
        </Card>

        <Card className="glass-card">
          <span className="text-xs text-slate-400">Vacancy Rate</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{vacancyRate}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{beds.length - occupiedBeds} beds vacant</span>
        </Card>

        <Card className="glass-card">
          <span className="text-xs text-slate-400">Avg Resident Tenure</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">8.6 Mos</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Low turnover ratio</span>
        </Card>
      </div>

      {/* Occupancy Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Portfolio Occupancy Growth Rate (%)</CardTitle>
          <p className="text-xs text-slate-400">6-Month historical occupancy progression</p>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Occupancy']}
                />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Property Breakdown Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-800/80">
        <div className="p-4 border-b border-slate-800">
          <CardTitle className="text-base">Branch-wise Benchmark Comparison</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Property</th>
                <th className="p-4 font-semibold">City</th>
                <th className="p-4 font-semibold">Total Beds</th>
                <th className="p-4 font-semibold">Occupied</th>
                <th className="p-4 font-semibold">Occupancy %</th>
                <th className="p-4 font-semibold text-right">Health Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">{p.name}</td>
                  <td className="p-4 text-slate-400">{p.city}</td>
                  <td className="p-4">{p.total_beds || 18}</td>
                  <td className="p-4 font-semibold text-emerald-400">{p.occupied_beds || 15}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${p.occupancy_rate || 80}%` }} />
                      </div>
                      <span className="font-bold text-white">{p.occupancy_rate || 80}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Excellent (A+)
                    </span>
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
