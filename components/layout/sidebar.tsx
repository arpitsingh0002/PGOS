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
  Shield,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export function Sidebar() {
  const pathname = usePathname();
  const { pendingPayments, complaints, pendingTiffinReturns, inventory } = usePGStore();
  const openComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;
  const pendingRentCount = pendingPayments.length;
  const pendingTiffinsCount = pendingTiffinReturns.length;
  const lowStockCount = (inventory || []).filter((i) => i.quantity <= i.min_threshold).length;

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
    {
      name: 'Mess & Food',
      href: '/mess',
      icon: UtensilsCrossed,
      badge: pendingTiffinsCount > 0 ? `${pendingTiffinsCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    { name: 'Manager Ops', href: '/manager', icon: Shield },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    { name: 'Staff', href: '/staff', icon: UserCheck },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Notices', href: '/notices', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-200 bg-white h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-black tracking-tighter text-base">PG</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">PGOS</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Trial</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Hostel & Coliving OS</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
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
                'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', item.badgeColor)}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Trial & Quick Switch (Inspired by Fingerprint screenshot) */}
      <div className="p-3 border-t border-slate-100 space-y-2.5">
        {/* Trial Upgrade Card */}
        <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-900">Trial <span className="text-orange-600 font-bold">14 days left</span></span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug mb-2">
            You are exploring PGOS Pro Plus. Upgrade now to avoid interruption.
          </p>
          <button
            onClick={() => toast.success('Redirecting to Pro Plus checkout...')}
            className="w-full py-1.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Upgrade now
          </button>
        </div>

        <Link
          href="/tenant/dashboard"
          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-orange-500" />
            <span>Student & Resident Portal</span>
          </div>
          <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
