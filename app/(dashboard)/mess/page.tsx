'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Calendar,
  Users,
  Receipt,
  Building2,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Package,
  GraduationCap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';

export default function MessOverviewPage() {
  const {
    buildings,
    properties,
    messMenus,
    totalTiffinsOptedToday,
    tiffinsByCollege,
    pendingTiffinReturns,
  } = usePGStore();
  const messBuildings = buildings.filter((b) => b.has_mess);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaysMenu = messMenus.find((m) => m.day_of_week === todayDay) || messMenus[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            Per-Building Mess & Dining System
            <Badge variant="success">Kitchen Live</Badge>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Weekly 4-meal cycle planner, daily resident attendance and grocery cost analytics
          </p>
        </div>

        <Link href="/mess/tiffin">
          <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs gap-1.5 shadow-sm">
            <Package className="h-4 w-4 stroke-[2.5]" /> Tiffin Hub &amp; Returns
          </Button>
        </Link>
      </div>

      {/* Daily Student Tiffin Hub Spotlight Banner */}
      <Card className="glass-card border-amber-300 bg-gradient-to-r from-amber-50/80 via-white to-indigo-50/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Package className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-950">Daily Student Tiffin Service</h3>
                <Badge variant="warning" className="text-[10px]">
                  {totalTiffinsOptedToday} Opted In Today
                </Badge>
                {pendingTiffinReturns.length > 0 && (
                  <Badge variant="danger" className="text-[10px]">
                    {pendingTiffinReturns.length} Pending Return
                  </Badge>
                )}
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 max-w-xl">
                Lunches categorized by student college routes • Evening container return verification with auto-clear and overdue reminders
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-800 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-indigo-700 stroke-[2.5]" />
                  <strong className="text-slate-950 font-black">{tiffinsByCollege.length}</strong> Colleges Covered
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-700 stroke-[2.5]" />
                  Evening Return Deadline: <strong className="text-amber-900 font-black">8:30 PM</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <Link href="/mess/tiffin">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 shadow-sm">
                Manage Tiffins &amp; Returns <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Today's Live Menu Spotlight Banner */}
      <Card className="glass-card border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <UtensilsCrossed className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-950">Today&apos;s Menu — {todayDay}</h3>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                  Serving Now
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700">Synced across resident mobile portals</p>
            </div>
          </div>

          <Link href={`/mess/${messBuildings[0]?.id || 'bld-1'}`}>
            <Button size="sm" variant="secondary" className="text-xs font-bold gap-1 text-slate-900 border border-slate-300 bg-white hover:bg-slate-100">
              Edit Weekly Schedule <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] text-amber-900 font-black uppercase tracking-wider block mb-1">
              Breakfast (07:30 - 10:00)
            </span>
            <p className="text-xs text-slate-950 font-bold">{todaysMenu?.breakfast}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] text-emerald-900 font-black uppercase tracking-wider block mb-1">
              Lunch (12:30 - 14:30)
            </span>
            <p className="text-xs text-slate-950 font-bold">{todaysMenu?.lunch}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-[10px] text-indigo-900 font-black uppercase tracking-wider block mb-1">
              Evening Snacks (17:00 - 18:30)
            </span>
            <p className="text-xs text-slate-950 font-bold">{todaysMenu?.snacks || 'Tea & Biscuits'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200">
            <span className="text-[10px] text-cyan-900 font-black uppercase tracking-wider block mb-1">
              Dinner (20:00 - 22:30)
            </span>
            <p className="text-xs text-slate-950 font-bold">{todaysMenu?.dinner}</p>
          </div>
        </div>

        {todaysMenu?.special_notes && (
          <div className="mt-4 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-950 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-700 flex-shrink-0 stroke-[2.5]" />
            <span>{todaysMenu.special_notes}</span>
          </div>
        )}
      </Card>

      {/* Buildings with Active Mess */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-950">Operational Mess Kitchens by Building</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messBuildings.map((bld) => {
            const prop = properties.find((p) => p.id === bld.property_id);
            return (
              <Card key={bld.id} className="glass-card border-slate-300 hover:border-indigo-400 transition-colors shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-base font-black text-slate-950">{bld.name}</h4>
                    <p className="text-xs font-bold text-slate-700">{prop?.name} &bull; {prop?.city}</p>
                  </div>
                  <Badge variant="success">Mess Active</Badge>
                </div>

                <div className="py-3 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Daily Capacity: ~{bld.beds_count || 10} Meals/sitting</span>
                  <span className="text-emerald-800 font-black">Chef On Duty</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                  <Link href={`/mess/${bld.id}`} className="flex-1">
                    <Button size="sm" variant="secondary" className="w-full text-xs font-bold border border-slate-300 text-slate-900 bg-white hover:bg-slate-100">
                      Weekly Menu
                    </Button>
                  </Link>

                  <Link href={`/mess/${bld.id}/attendance`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full text-xs font-bold border-slate-300 text-slate-900 hover:bg-slate-100">
                      Attendance
                    </Button>
                  </Link>

                  <Link href={`/mess/${bld.id}/expenses`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full text-xs font-bold border-slate-300 text-slate-900 hover:bg-slate-100">
                      Food Cost
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
