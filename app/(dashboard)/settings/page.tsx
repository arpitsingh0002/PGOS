'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Bell, Shield, Sparkles, CreditCard, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    </div>
  );
}
