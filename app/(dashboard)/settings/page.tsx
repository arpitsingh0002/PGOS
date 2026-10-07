'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Bell, Shield, Sparkles, CreditCard, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [name, setName] = React.useState('Anand Owner');
  const [email, setEmail] = React.useState('anand@royalpalmspg.com');
  const [phone, setPhone] = React.useState('+91 98765 43210');
  const [businessName, setBusinessName] = React.useState('Royal Palms Co-living LLP');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Owner profile preferences updated!');
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Owner Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details, business branding, notification preferences and feature flags
        </p>
      </div>

      {/* Navigation Submenu */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Link href="/settings" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
          Profile Settings
        </Link>
        <Link href="/settings/feature-flags" className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
          Feature Flags per Property
        </Link>
        <Link href="/settings/billing" className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
          Subscription & Billing
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-400" />
            Personal & Enterprise Identity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Owner Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Business / Entity Legal Name</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Registered Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mobile Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-md shadow-indigo-600/20">
                <Check className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Supabase Live Database Connection Card */}
      <SupabaseSettingsCard />
    </div>
  );
}

function SupabaseSettingsCard() {
  const { syncStatus, isLiveDB, dataMode, lastSyncedAt, syncNow } = usePGStore();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncNow();
    setIsSyncing(false);
    toast.success('Database synchronization finished!');
  };

  return (
    <Card className="glass-card border border-slate-800 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dataMode === 'live' ? 'bg-emerald-400 animate-pulse' : dataMode === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`} />
            <span>Supabase Cloud PostgreSQL Database</span>
          </div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
            dataMode === 'live'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : dataMode === 'loading'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
          }`}>
            {dataMode === 'live' ? 'Connected & Synced' : dataMode === 'loading' ? 'Syncing...' : 'Demo data (Seed active)'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Supabase Endpoint:</span>
            <span className="font-mono text-slate-200">https://dvmohlgshystkzwttqvx.supabase.co</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Database Tables:</span>
            <span className="text-emerald-400 font-medium">27 Schema Tables Active</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Sync Mode:</span>
            <span className="text-slate-200">{dataMode === 'live' ? 'Real-time PostgreSQL Live' : 'Demo data / Local Seed Mode'}</span>
          </div>
          {lastSyncedAt && (
            <div className="flex items-center justify-between text-slate-400">
              <span>Last Synced:</span>
              <span className="text-indigo-300">{lastSyncedAt}</span>
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
          <h4 className="text-xs font-semibold text-indigo-300">How to populate your live Supabase database:</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All 27 tables and RLS security policies exist in your Supabase project. To insert realistic starter properties, rooms, beds, and tenants directly into PostgreSQL, open your{' '}
            <a
              href="https://supabase.com/dashboard/project/dvmohlgshystkzwttqvx/sql"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 underline font-semibold hover:text-indigo-300"
            >
              Supabase SQL Editor
            </a>{' '}
            and run the seed script located at <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">supabase/seed.sql</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold gap-1.5"
          >
            {isSyncing ? 'Syncing...' : 'Sync Database Now'}
          </Button>

          <a
            href="https://supabase.com/dashboard/project/dvmohlgshystkzwttqvx"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            Open Supabase Dashboard &rarr;
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
