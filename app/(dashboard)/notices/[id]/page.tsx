'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Bell, Eye, CheckCircle2, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatDate } from '@/lib/utils/format';

export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = (params?.id as string) || 'not-1';

  const { notices, tenants } = usePGStore();
  const notice = notices.find((n) => n.id === noticeId) || notices[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <Link href="/notices">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{notice?.title}</h1>
          <p className="text-xs text-slate-400">Published on {formatDate(notice?.created_at)}</p>
        </div>
      </div>

      <Card className="glass-card">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {notice?.is_urgent && <Badge variant="danger">Urgent Alert</Badge>}
            <Badge variant="secondary">Target: {notice?.target} Residents</Badge>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
            {notice?.content}
          </p>
        </div>
      </Card>

      {/* Read Receipts Table */}
      <Card className="glass-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-400" />
            Resident Read Receipts
          </CardTitle>
          <span className="text-xs text-emerald-400 font-bold">14 of 15 Confirmed Read</span>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-800/80">
            {tenants.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{t.full_name}</p>
                  <p className="text-[11px] text-slate-400">{t.room_number || 'Room 101'}</p>
                </div>
                <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Read
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
