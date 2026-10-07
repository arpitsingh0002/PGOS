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
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
    },
    { name: 'Expenses', href: '/expenses', icon: Receipt },
    {
      name: 'Complaints',
      href: '/complaints',
      icon: AlertCircle,
      badge: openComplaintsCount > 0 ? `${openComplaintsCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
    },
    {
      name: 'Mess & Food',
      href: '/mess',
      icon: UtensilsCrossed,
      badge: pendingTiffinsCount > 0 ? `${pendingTiffinsCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
    },
    { name: 'Manager Ops', href: '/manager', icon: Shield },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
    },
    { name: 'Staff', href: '/staff', icon: UserCheck },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Notices', href: '/notices', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-300 bg-white h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-slate-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-black tracking-tighter text-lg">PG</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-slate-950 tracking-tight">PGOS</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded border border-slate-300">Pro</span>
            </div>
            <p className="text-xs text-slate-700 font-bold">Hostel & Coliving OS</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-700 px-3 pb-2">
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
                'flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all group',
                isActive
                  ? 'bg-slate-950 text-white shadow-sm font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 stroke-[2.2] transition-colors',
                    isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-950'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-xs font-black px-2 py-0.5 rounded-full',
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Portals & Quick Switch */}
      <div className="p-3 border-t border-slate-300 space-y-2">
        <Link
          href="/tenant/dashboard"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-700 stroke-[2.5]" />
            <span>Tenant App PWA</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-600 group-hover:text-emerald-700 transition-colors" />
        </Link>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-950">
            <Sparkles className="h-3.5 w-3.5 text-indigo-700 stroke-[2.5]" />
            <span>AI PG Assistant</span>
          </div>
          <p className="text-xs text-slate-700 font-semibold mt-1">Smart queries & revenue optimization active</p>
        </div>
      </div>
    </aside>
  );
}
