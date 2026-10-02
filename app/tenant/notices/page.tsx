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
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-tight">Hostel Notice Board</h1>
        <p className="text-xs text-slate-400 mt-0.5">Official communications from management</p>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <Card key={n.id} className="glass-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              {n.is_urgent ? (
                <Badge variant="danger" className="text-[10px] gap-1">
                  <AlertTriangle className="h-3 w-3" /> Urgent Alert
                </Badge>
              ) : (
                <Badge variant="default" className="text-[10px]">Notice</Badge>
              )}
              <span className="text-[10px] text-slate-400">{formatDate(n.created_at)}</span>
            </div>

            <h3 className="text-sm font-bold text-white">{n.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Target: All Residents</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" /> Confirmed Read
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
