'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, UtensilsCrossed, Check, Sparkles, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export default function BuildingMessDetailPage() {
  const params = useParams();
  const bldId = (params?.buildingId as string) || 'bld-1';

  const { buildings, messMenus } = usePGStore();
  const building = buildings.find((b) => b.id === bldId) || buildings[0];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = React.useState('Monday');

  const [menus, setMenus] = React.useState(messMenus);
  const currentMenu = menus.find((m) => m.day_of_week === activeDay) || menus[0];

  const handleUpdate = (field: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'special_notes', val: string) => {
    const updated = menus.map((m) => (m.day_of_week === activeDay ? { ...m, [field]: val } : m));
    setMenus(updated);
  };

  const handleSave = () => {
    toast.success(`${activeDay} menu updated and published to residents!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/mess">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Weekly Mess Menu Editor: {building?.name}
            </h1>
            <p className="text-xs text-slate-400">
              Customize 4 daily meals for Monday through Sunday
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/mess/${building?.id}/attendance`}>
            <Button size="sm" variant="outline" className="text-xs">
              Meal Attendance
            </Button>
          </Link>
          <Link href={`/mess/${building?.id}/expenses`}>
            <Button size="sm" variant="outline" className="text-xs">
              Food Expenses
            </Button>
          </Link>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeDay === d
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Day Menu Editor Card */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
              {activeDay}&apos;s Meal Items
            </CardTitle>
            <p className="text-xs text-slate-400">Updates reflect live immediately on Tenant App</p>
          </div>

          <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
            <Check className="h-4 w-4" /> Save {activeDay} Menu
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-amber-400">Breakfast (07:30 - 10:00)</label>
            <Input
              value={currentMenu?.breakfast || ''}
              onChange={(e) => handleUpdate('breakfast', e.target.value)}
              placeholder="e.g. Masala Idli, Vada, Chutney, Tea & Coffee"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-emerald-400">Lunch (12:30 - 14:30)</label>
            <Input
              value={currentMenu?.lunch || ''}
              onChange={(e) => handleUpdate('lunch', e.target.value)}
              placeholder="e.g. Rajma Masala, Steamed Rice, Tawa Roti, Salad"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-400">Evening Snacks & High Tea (17:00 - 18:30)</label>
            <Input
              value={currentMenu?.snacks || ''}
              onChange={(e) => handleUpdate('snacks', e.target.value)}
              placeholder="e.g. Samosa / Pakoda with Masala Chai"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-cyan-400">Dinner (20:00 - 22:30)</label>
            <Input
              value={currentMenu?.dinner || ''}
              onChange={(e) => handleUpdate('dinner', e.target.value)}
              placeholder="e.g. Paneer Butter Masala, Dal Tadka, Phulkas, Rice, Dessert"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Special Feast or Chef Note</label>
            <Input
              value={currentMenu?.special_notes || ''}
              onChange={(e) => handleUpdate('special_notes', e.target.value)}
              placeholder="e.g. Wednesday Special Chicken / Shahi Paneer Feast!"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
