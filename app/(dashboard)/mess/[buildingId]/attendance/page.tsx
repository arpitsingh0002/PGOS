'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Calendar, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export default function MessAttendancePage() {
  const params = useParams();
  const bldId = (params?.buildingId as string) || 'bld-1';

  const { buildings, tenants } = usePGStore();
  const building = buildings.find((b) => b.id === bldId) || buildings[0];
  const bldTenants = tenants.filter((t) => t.building_id === bldId && t.status === 'active');

  const [date, setDate] = React.useState(() => new Date().toISOString().split('T')[0]);

  // Attendance state: { [tenantId]: { breakfast: boolean, lunch: boolean, dinner: boolean } }
  const [attendance, setAttendance] = React.useState<Record<string, { breakfast: boolean; lunch: boolean; dinner: boolean }>>(() => {
    const init: Record<string, { breakfast: boolean; lunch: boolean; dinner: boolean }> = {};
    bldTenants.forEach((t) => {
      init[t.id] = { breakfast: true, lunch: true, dinner: true };
    });
    return init;
  });

  const toggleMeal = (tenantId: string, meal: 'breakfast' | 'lunch' | 'dinner') => {
    setAttendance((prev) => ({
      ...prev,
      [tenantId]: {
        ...prev[tenantId],
        [meal]: !prev[tenantId]?.[meal],
      },
    }));
  };

  const handleSave = () => {
    toast.success(`Mess attendance saved for ${date}!`);
  };

  const breakfastCount = Object.values(attendance).filter((a) => a.breakfast).length;
  const lunchCount = Object.values(attendance).filter((a) => a.lunch).length;
  const dinnerCount = Object.values(attendance).filter((a) => a.dinner).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/mess/${building?.id}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Daily Mess Attendance — {building?.name}
            </h1>
            <p className="text-xs text-slate-400">Headcount tracking to minimize kitchen food wastage</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
          />
          <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
            <Check className="h-4 w-4" /> Save Attendance
          </Button>
        </div>
      </div>

      {/* Headcount Metrics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <Card className="glass-card">
          <span className="text-xs text-amber-400 font-semibold uppercase">Breakfast Count</span>
          <p className="text-2xl font-bold text-white mt-1">{breakfastCount} / {bldTenants.length}</p>
        </Card>
        <Card className="glass-card">
          <span className="text-xs text-emerald-400 font-semibold uppercase">Lunch Count</span>
          <p className="text-2xl font-bold text-white mt-1">{lunchCount} / {bldTenants.length}</p>
        </Card>
        <Card className="glass-card">
          <span className="text-xs text-cyan-400 font-semibold uppercase">Dinner Count</span>
          <p className="text-2xl font-bold text-white mt-1">{dinnerCount} / {bldTenants.length}</p>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <tr>
                <th className="p-4">Resident</th>
                <th className="p-4">Room & Bed</th>
                <th className="p-4 text-center">Breakfast</th>
                <th className="p-4 text-center">Lunch</th>
                <th className="p-4 text-center">Dinner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {bldTenants.map((t) => {
                const state = attendance[t.id] || { breakfast: true, lunch: true, dinner: true };
                return (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-white">{t.full_name}</td>
                    <td className="p-4 text-slate-400">{t.room_number || 'Room 101'} ({t.bed_number || 'Bed A'})</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleMeal(t.id, 'breakfast')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          state.breakfast
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {state.breakfast ? 'Present' : 'Opted Out'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleMeal(t.id, 'lunch')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          state.lunch
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {state.lunch ? 'Present' : 'Opted Out'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleMeal(t.id, 'dinner')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          state.dinner
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {state.dinner ? 'Present' : 'Opted Out'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
