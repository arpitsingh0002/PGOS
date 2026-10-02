'use client';

import * as React from 'react';
import Link from 'next/link';
import { CreditCard, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BillingSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Subscription & Plan</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your PGOS enterprise tier and active property licenses</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Link href="/settings" className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
          Profile Settings
        </Link>
        <Link href="/settings/feature-flags" className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
          Feature Flags per Property
        </Link>
        <Link href="/settings/billing" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
          Subscription & Billing
        </Link>
      </div>

      {/* Current Plan Card */}
      <Card className="glass-card border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">PGOS Enterprise Founder Tier</h3>
              <Badge variant="success">Active Plan</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">Unlimited properties, unlimited beds, and full Supabase RLS security</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-white">₹2,499</span>
            <span className="text-xs text-slate-400"> / month</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" /> Multi-Property & Multi-Building Hierarchy
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" /> Interactive Visual Bed Grid Matrix
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" /> Building Mess Management & 4-Meal Cycles
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" /> Mobile Tenant PWA Portal
          </div>
        </div>

        <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Next renewal date: April 1, 2025</span>
          <Button
            size="sm"
            onClick={() => toast.info('Payment Gateway is in Sandbox / Demo mode.')}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs shadow-md shadow-indigo-600/20"
          >
            Manage Billing Card
          </Button>
        </div>
      </Card>
    </div>
  );
}
