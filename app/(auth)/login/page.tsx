'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/db';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('owner@pgos.com');
  const [password, setPassword] = React.useState('Password@123456');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('Email not confirmed in Supabase yet. Please check your inbox or use 1-Click Demo Access.');
          } else {
            toast.error(error.message || 'Invalid email or password.');
          }
          setIsLoading(false);
          return;
        }

        if (data?.user) {
          toast.success(`Welcome back, ${data.user.email}!`);
          router.push('/dashboard');
          return;
        }
      } catch (err: any) {
        toast.error(err.message || 'Error communicating with Supabase');
        setIsLoading(false);
        return;
      }
    }

    // Fallback simulation
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Welcome back, Owner (Demo Mode)!');
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card */}
        <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl">PG</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">PGOS</span>
            </Link>
            <h1 className="text-xl font-bold text-white tracking-tight">Owner Portal Login</h1>
            <p className="text-xs text-slate-400 mt-1">Manage your properties, tenants, mess and rent in one place</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold gap-2 mt-2 shadow-lg shadow-indigo-600/25">
              {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Quick Demo Access Bar */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success('Loaded Instant Demo Account!');
                  router.push('/dashboard');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                1-Click Instant Demo Access (No password required)
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have an owner account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create an account
            </Link>
          </div>
        </div>

        {/* Tenant / Student Portal Links */}
        <div className="text-center mt-6 flex flex-col items-center gap-2">
          <Link href="/student-login" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1.5 transition-colors">
            🎓 Are you a student or resident? Open Student Portal &rarr;
          </Link>
          <Link href="/tenant/login" className="text-[11px] text-slate-500 hover:text-emerald-400 inline-flex items-center gap-1.5 transition-colors">
            Mobile OTP Quick Access &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
