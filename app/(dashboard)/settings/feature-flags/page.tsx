'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, ToggleLeft, Check, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePGStore } from '@/lib/store';
import { PropertyFeatures } from '@/types/database';
import { toast } from 'sonner';

export default function FeatureFlagsPage() {
  const { properties, featureFlags, updateFeatureFlag } = usePGStore();
  const [selectedPropId, setSelectedPropId] = React.useState(properties[0]?.id || 'prop-1');

  const selectedProperty = properties.find((p) => p.id === selectedPropId) || properties[0];
  const features = featureFlags[selectedPropId] || {
    id: `feat-${selectedPropId}`,
    property_id: selectedPropId,
    mess_enabled: true,
    electricity_billing_enabled: true,
    staff_management_enabled: true,
    biometric_sync_enabled: false,
    visitor_qr_enabled: false,
    whatsapp_reminders_enabled: true,
  };

  const handleToggle = (key: keyof PropertyFeatures, val: boolean) => {
    updateFeatureFlag(selectedPropId, key, val);
    toast.success(`Feature "${key.replace(/_/g, ' ')}" updated for ${selectedProperty?.name}`);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Feature Flags per Property</h1>
        <p className="text-xs text-slate-400 mt-1">
          Turn operational modules on or off on a per-branch basis
        </p>
      </div>

      {/* Submenu */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Link href="/settings" className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
          Profile Settings
        </Link>
        <Link href="/settings/feature-flags" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
          Feature Flags per Property
        </Link>
        <Link href="/settings/billing" className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
          Subscription & Billing
        </Link>
      </div>

      {/* Property Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-300">Select Property Branch:</span>
        <select
          value={selectedPropId}
          onChange={(e) => setSelectedPropId(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
          ))}
        </select>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white">
            Module Toggles for {selectedProperty?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Mess & Dining Management</p>
              <p className="text-[11px] text-slate-400">Weekly menus, grocery expenses and meal attendance tracking</p>
            </div>
            <input
              type="checkbox"
              checked={features.mess_enabled}
              onChange={(e) => handleToggle('mess_enabled', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Electricity Submeter Billing</p>
              <p className="text-[11px] text-slate-400">Record room units and append directly to rent invoice</p>
            </div>
            <input
              type="checkbox"
              checked={features.electricity_billing_enabled}
              onChange={(e) => handleToggle('electricity_billing_enabled', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Staff Task Delegation Board</p>
              <p className="text-[11px] text-slate-400">Enable Kanban task workflow for wardens and maintenance team</p>
            </div>
            <input
              type="checkbox"
              checked={features.staff_management_enabled}
              onChange={(e) => handleToggle('staff_management_enabled', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Automated WhatsApp Rent Alerts</p>
              <p className="text-[11px] text-slate-400">One-click UPI payment links and PDF receipt delivery via WhatsApp</p>
            </div>
            <input
              type="checkbox"
              checked={features.whatsapp_reminders_enabled}
              onChange={(e) => handleToggle('whatsapp_reminders_enabled', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
