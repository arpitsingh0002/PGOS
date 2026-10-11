'use client';

import * as React from 'react';
import { UtensilsCrossed, Sparkles, Check, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { TiffinHubCard } from '@/components/tenant/tiffin-hub-card';

export default function TenantMessPage() {
  const { messMenus } = usePGStore();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const [selectedDay, setSelectedDay] = React.useState(todayDay);
  const currentMenu = messMenus.find((m) => m.day_of_week === selectedDay) || messMenus[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-300">
        <h1 className="text-lg font-bold text-slate-950 tracking-tight">Mess & Meal Timetable</h1>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">Freshly prepared buffet schedule</p>
      </div>

      {/* Daily Packed Tiffin Service Opt-In */}
      <TiffinHubCard />

      {/* Days Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedDay === d
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white text-slate-800 hover:text-slate-950 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {d} {d === todayDay && '• Today'}
          </button>
        ))}
      </div>

      {/* Day Menu Card */}
      <Card className="bg-white border-slate-300 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-emerald-700" />
            {selectedDay}&apos;s Menu
          </h2>
          <Badge variant="success" className="font-bold">Chef Special</Badge>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-amber-900">Breakfast</span>
              <span className="text-[10px] font-semibold text-slate-600">07:30 - 10:00</span>
            </div>
            <p className="text-xs text-slate-950 font-bold">{currentMenu?.breakfast}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-emerald-900">Lunch</span>
              <span className="text-[10px] font-semibold text-slate-600">12:30 - 14:30</span>
            </div>
            <p className="text-xs text-slate-950 font-bold">{currentMenu?.lunch}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-indigo-900">Evening Snacks & Chai</span>
              <span className="text-[10px] font-semibold text-slate-600">17:00 - 18:30</span>
            </div>
            <p className="text-xs text-slate-950 font-bold">{currentMenu?.snacks || 'Samosa / Biscuit with Chai'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-cyan-900">Dinner</span>
              <span className="text-[10px] font-semibold text-slate-600">20:00 - 22:30</span>
            </div>
            <p className="text-xs text-slate-950 font-bold">{currentMenu?.dinner}</p>
          </div>
        </div>

        {currentMenu?.special_notes && (
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-950 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-700 flex-shrink-0" />
            <span>{currentMenu.special_notes}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
