'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Receipt,
  AlertCircle,
  UtensilsCrossed,
  UserCheck,
  CheckSquare,
  Bell,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePGStore } from '@/lib/store';

export function Sidebar() {
  const pathname = usePathname();
  const { pendingPayments, complaints } = usePGStore();
  const openComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;
  const pendingRentCount = pendingPayments.length;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Tenants', href: '/tenants', icon: Users },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      badge: pendingRentCount > 0 ? `${pendingRentCount}` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300',
    },
    { name: 'Expenses', href: '/expenses', icon: Receipt },
    {
      name: 'Complaints',
      href: '/complaints',
      icon: AlertCircle,
      badge: openComplaintsCount > 0 ? `${openComplaintsCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    { name: 'Mess & Food', href: '/mess', icon: UtensilsCrossed },
    { name: 'Staff', href: '/staff', icon: UserCheck },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Notices', href: '/notices', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-800 bg-slate-950/90 backdrop-blur-xl h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold tracking-tighter text-lg">PG</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">PGOS</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Hostel & Coliving OS</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 pb-2">
          Management
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', item.badgeColor)}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Portals & Quick Switch */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <Link
          href="/tenant/dashboard"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-300 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-400" />
            <span>Tenant App PWA</span>
          </div>
          <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>AI PG Assistant</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Smart queries & revenue optimization active</p>
        </div>
      </div>
    </aside>
  );
}
