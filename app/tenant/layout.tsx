'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CreditCard,
  AlertCircle,
  UtensilsCrossed,
  Bell,
  User,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login, do not show tenant navigation bar
  if (pathname === '/tenant/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Home', href: '/tenant/dashboard', icon: Home },
    { name: 'Pay Rent', href: '/tenant/payments', icon: CreditCard },
    { name: 'Meals', href: '/tenant/mess', icon: UtensilsCrossed },
    { name: 'Help', href: '/tenant/complaints', icon: AlertCircle },
    { name: 'Notices', href: '/tenant/notices', icon: Bell },
    { name: 'Profile', href: '/tenant/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between max-w-md mx-auto relative border-x border-slate-800 shadow-2xl">
      {/* Mobile Top App Bar */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            PG
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">Resident Portal</span>
            <span className="text-[10px] text-emerald-400 block -mt-0.5">Royal Palms Living</span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-[11px] font-semibold text-slate-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"
        >
          <ArrowLeft className="h-3 w-3" /> Owner Portal
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (PWA Style) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-2 flex items-center justify-around z-30">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-emerald-400' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
