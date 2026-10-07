'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Menu,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { cn } from '@/lib/utils';
import { usePGStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { pendingPayments } = usePGStore();

  const mobileNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Tenants', href: '/tenants', icon: Users },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      badge: pendingPayments.length > 0 ? `${pendingPayments.length}` : undefined,
    },
  ];

  return (
    <div className="flex min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-200 selection:text-slate-900">
      {/* Sidebar (with mobile slide drawer & desktop sticky navigation) */}
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Native Bottom Navigation Bar for phones */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-bold transition-colors relative min-w-[56px]',
                isActive ? 'text-indigo-600 font-black' : 'text-slate-600 hover:text-slate-950'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5 stroke-[2.2]', isActive ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-600')} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.name}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-bold text-slate-600 hover:text-slate-950 min-w-[56px]"
          aria-label="Open More Menus"
        >
          <Menu className="h-5 w-5 stroke-[2.2] text-slate-600" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>
    </div>
  );
}
