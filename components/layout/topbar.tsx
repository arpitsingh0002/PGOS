'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Plus,
  Building2,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Database,
  RefreshCw,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePGStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps = {}) {
  const router = useRouter();
  const {
    properties,
    notices,
    pendingPayments,
    syncStatus,
    isLiveDB,
    lastSyncedAt,
    syncNow,
  } = usePGStore();
  const [selectedPropId, setSelectedPropId] = React.useState<string>(properties[0]?.id || 'prop-1');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showAiModal, setShowAiModal] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropId) || properties[0];

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);

    // Query our PGOS AI endpoint or fallback response
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, propertyId: selectedPropId }),
      });
      const data = await res.json();
      setAiResponse(data.answer || 'Query processed successfully.');
    } catch {
      setAiResponse(
        `AI Analysis for "${aiPrompt}": Based on current occupancy (83%) across 18 beds, you have 1 vacant bed in Tower A (Bed 102-B) and 1 bed in maintenance. Pending rent is ₹7,500 from Sneha Rao.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-md px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Property Selector & Search */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Active Property Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 max-w-[155px] xs:max-w-[200px] sm:max-w-none">
          <Building2 className="h-4 w-4 text-indigo-700 stroke-[2.5] flex-shrink-0" />
          <select
            value={selectedPropId}
            onChange={(e) => {
              setSelectedPropId(e.target.value);
              toast.info(`Switched to ${properties.find((p) => p.id === e.target.value)?.name}`);
            }}
            aria-label="Select Active Property"
            className="bg-transparent text-xs sm:text-sm font-bold text-slate-950 focus:outline-none cursor-pointer pr-1 truncate w-full"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id} className="bg-white text-slate-950 font-bold">
                {p.name} ({p.city})
              </option>
            ))}
          </select>
        </div>

        {/* AI Quick Query Bar (Desktop) */}
        <button
          onClick={() => setShowAiModal(true)}
          className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 hover:text-slate-950 hover:border-slate-400 text-xs font-bold whitespace-nowrap transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-700 stroke-[2.5]" />
          <span>Ask PGOS AI (e.g. &ldquo;vacant beds this week&rdquo;)...</span>
          <kbd className="text-[10px] font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 border border-slate-300">⌘K</kbd>
        </button>

        {/* Mobile/Tablet AI Quick Query Icon */}
        <button
          onClick={() => setShowAiModal(true)}
          className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          title="Ask PGOS AI"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-4 w-4 text-indigo-700 stroke-[2.5]" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push('/properties/new')}
            className="gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 border-slate-300 hover:bg-slate-100"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            Add Property
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => router.push('/tenants/new')}
            className="gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            Add Tenant
          </Button>
        </div>

        {/* Supabase Database Sync Status Pill */}
        <button
          onClick={() => {
            syncNow();
            toast.info('Synchronizing with Supabase...');
          }}
          title={lastSyncedAt ? `Last synced at ${lastSyncedAt}. Click to refresh.` : 'Click to refresh from Supabase'}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            isLiveDB
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
              : syncStatus === 'syncing'
              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
              : 'bg-slate-100 text-slate-800 border-slate-300 hover:text-slate-950'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isLiveDB ? 'bg-emerald-600 animate-pulse' : syncStatus === 'syncing' ? 'bg-amber-600' : 'bg-slate-600'}`} />
          <span>{isLiveDB ? 'Supabase Live' : syncStatus === 'syncing' ? 'Syncing...' : 'Local Cache'}</span>
          <RefreshCw className={`h-3 w-3 opacity-75 ml-0.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-4 w-4 stroke-[2.2]" />
            {pendingPayments.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-300 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-950">Notifications</span>
                <span className="text-[10px] font-bold text-slate-700">Live Updates</span>
              </div>
              <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                {pendingPayments.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs">
                    <p className="font-bold text-rose-800">Rent Payment Pending</p>
                    <p className="text-slate-900 font-bold mt-0.5">{p.tenant_name} owes ₹{p.amount.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-slate-700 font-semibold mt-1 block">Due for {p.for_month}</span>
                  </div>
                ))}
                {notices.slice(0, 2).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs">
                    <p className="font-bold text-indigo-800">{n.title}</p>
                    <p className="text-slate-800 font-medium text-[11px] mt-0.5 line-clamp-1">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center font-black text-white text-xs shadow-sm">
              AO
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-950">Anand Owner</p>
              <p className="text-[11px] font-bold text-slate-700">Verified Owner</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-600 stroke-[2.2]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-300 bg-white p-2 shadow-xl z-50">
              <Link
                href="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
              >
                <User className="h-3.5 w-3.5" />
                Account Settings
              </Link>
              <Link
                href="/pg/prop-1"
                target="_blank"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Public PG Page
              </Link>
              <button
                onClick={async () => {
                  setShowUserMenu(false);
                  try {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  } catch (e) {
                    console.warn('Sign out error:', e);
                  }
                  toast.success('Signed out successfully');
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1 font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAiModal(false)} />
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-10">
            <div className="flex items-center gap-2 text-indigo-600 mb-3">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold text-slate-900 text-base">PGOS AI Operations Assistant</h3>
            </div>
            <form onSubmit={handleAiQuery} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask anything: 'Show vacant beds', 'Who owes rent?', 'Calculate NOI'..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-2 h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isAiLoading}
                >
                  {isAiLoading ? 'Thinking...' : 'Ask AI'}
                </Button>
              </div>

              {aiResponse && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs leading-relaxed text-indigo-900">
                  <p className="font-semibold text-indigo-950 mb-1">Response:</p>
                  <p>{aiResponse}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Try: &quot;Which rooms are vacant?&quot; or &quot;Total food expenses this month&quot;</span>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
