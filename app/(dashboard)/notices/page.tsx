'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Plus, CheckCircle2, AlertTriangle, Eye, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatDate } from '@/lib/utils/format';

import { Modal } from '@/components/ui/modal';
import { Notice } from '@/types/database';

export default function NoticesPage() {
  const router = useRouter();
  const { notices, tenants } = usePGStore();
  const [selectedNoticeForReceipts, setSelectedNoticeForReceipts] = React.useState<Notice | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Notice Board & Broadcasts
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {notices.length} Published
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast emergency alerts, maintenance schedules and festive celebrations to residents
          </p>
        </div>

        <Link href="/notices/new">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
            <Plus className="h-4 w-4" /> Create Notice
          </Button>
        </Link>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="glass-card hover:border-indigo-500/40 transition-colors p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                {notice.is_urgent ? (
                  <Badge variant="danger" className="text-[10px] gap-1">
                    <AlertTriangle className="h-3 w-3" /> Urgent
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-[10px]">General Notice</Badge>
                )}
                <h3 className="text-base font-bold text-white">{notice.title}</h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="capitalize bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                  Target: {notice.target} Residents
                </span>
                <span>{formatDate(notice.created_at)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">{notice.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Eye className="h-3.5 w-3.5" /> {notice.read_count || tenants.length} Residents Read
              </span>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedNoticeForReceipts(notice)}
                className="h-7 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50"
              >
                Read Receipts &rarr;
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Read Receipts Modal */}
      {selectedNoticeForReceipts && (
        <Modal
          isOpen={!!selectedNoticeForReceipts}
          onClose={() => setSelectedNoticeForReceipts(null)}
          title="Notice Read Receipts"
          description={`Delivery & read audit for: "${selectedNoticeForReceipts.title}"`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Audited Broadcast:</span>
                <span className="font-bold text-slate-900">{selectedNoticeForReceipts.title}</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs">
                {Math.min(selectedNoticeForReceipts.read_count || tenants.length, tenants.length)} / {tenants.length} Confirmed
              </Badge>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
              {tenants.map((tenant, idx) => {
                const isRead = idx < (selectedNoticeForReceipts.read_count || tenants.length);
                return (
                  <div key={tenant.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{tenant.full_name}</p>
                      <p className="text-[11px] text-slate-500">
                        Room {tenant.room_number || '101'} • {tenant.phone}
                      </p>
                    </div>
                    {isRead ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Confirmed Read
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">
                        Pending View
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedNoticeForReceipts(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
