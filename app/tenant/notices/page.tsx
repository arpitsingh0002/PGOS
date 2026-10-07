'use client';

import * as React from 'react';
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatDate } from '@/lib/utils/format';

export default function TenantNoticesPage() {
  const { notices } = usePGStore();

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-12">
      <div className="pb-2 border-b border-slate-300">
        <h1 className="text-lg font-bold text-slate-950 tracking-tight">Hostel Notice Board</h1>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">Official communications from management</p>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <Card key={n.id} className="bg-white border-slate-300 p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              {n.is_urgent ? (
                <Badge variant="danger" className="text-[10px] gap-1 font-bold">
                  <AlertTriangle className="h-3 w-3" /> Urgent Alert
                </Badge>
              ) : (
                <Badge variant="default" className="text-[10px] font-bold">Notice</Badge>
              )}
              <span className="text-[10px] font-bold text-slate-600">{formatDate(n.created_at)}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-950">{n.title}</h3>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">{n.content}</p>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-bold">
              <span>Target: All Residents</span>
              <span className="text-emerald-800 flex items-center gap-1 font-bold">
                <CheckCircle2 className="h-3 w-3 text-emerald-700" /> Confirmed Read
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
