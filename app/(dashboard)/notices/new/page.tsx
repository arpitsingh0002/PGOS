'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export default function NewNoticePage() {
  const router = useRouter();
  const { properties, buildings, addNotice } = usePGStore();

  const [propertyId, setPropertyId] = React.useState(properties[0]?.id || 'prop-1');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [target, setTarget] = React.useState<'all' | 'building' | 'room'>('all');
  const [isUrgent, setIsUrgent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Please enter title and content');
      return;
    }

    addNotice({
      property_id: propertyId,
      title,
      content,
      target,
      is_urgent: isUrgent,
    });

    toast.success('Notice published to all target resident portals!');
    router.push('/notices');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/notices">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Publish Notice</h1>
          <p className="text-xs text-slate-400">Broadcast updates directly to resident mobile screens</p>
        </div>
      </div>

      <Card className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Notice Headline *</label>
            <Input
              required
              placeholder="e.g. Wi-Fi Router Firmware Upgrade at 2 AM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Audience Scope</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="all">All Residents Across All Blocks</option>
                <option value="building">Tower A Only</option>
                <option value="room">Specific Floor / Wing</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="urgentToggle"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="urgentToggle" className="text-xs text-rose-400 font-semibold cursor-pointer">
                Mark as High Priority Urgent Alert
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Notice Body *</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full announcement..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link href="/notices">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25">
              <Check className="h-4 w-4" /> Publish Broadcast
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
