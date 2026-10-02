'use client';

import * as React from 'react';
import { UtensilsCrossed, Sparkles, Check, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';

export default function TenantMessPage() {
  const { messMenus } = usePGStore();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const [selectedDay, setSelectedDay] = React.useState(todayDay);
  const currentMenu = messMenus.find((m) => m.day_of_week === selectedDay) || messMenus[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-tight">Mess & Meal Timetable</h1>
        <p className="text-xs text-slate-400 mt-0.5">Freshly prepared buffet schedule</p>
      </div>

      {/* Days Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDay === d
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {d} {d === todayDay && '• Today'}
          </button>
        ))}
      </div>

      {/* Day Menu Card */}
      <Card className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
            {selectedDay}&apos;s Menu
          </h2>
          <Badge variant="success">Chef Special</Badge>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-amber-400">Breakfast</span>
              <span className="text-[10px] text-slate-500">07:30 - 10:00</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">{currentMenu?.breakfast}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-emerald-400">Lunch</span>
              <span className="text-[10px] text-slate-500">12:30 - 14:30</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">{currentMenu?.lunch}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-indigo-400">Evening Snacks & Chai</span>
              <span className="text-[10px] text-slate-500">17:00 - 18:30</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">{currentMenu?.snacks || 'Samosa / Biscuit with Chai'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-cyan-400">Dinner</span>
              <span className="text-[10px] text-slate-500">20:00 - 22:30</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">{currentMenu?.dinner}</p>
          </div>
        </div>

        {currentMenu?.special_notes && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400 flex-shrink-0" />
            <span>{currentMenu.special_notes}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
