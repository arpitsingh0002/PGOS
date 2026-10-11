import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold',
    secondary: 'bg-slate-100 text-slate-900 border-slate-300 font-bold',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    warning: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    danger: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
    outline: 'border border-slate-300 text-slate-900 font-bold bg-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

