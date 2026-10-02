'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TenantLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = React.useState('9876543210');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState<'phone' | 'otp'>('phone');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    toast.success('OTP sent: 1234');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Logged in as Aarav Sharma!');
    router.push('/tenant/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25">
              <span className="text-white font-extrabold text-xl">PG</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">Resident Portal Login</h1>
            <p className="text-xs text-slate-400 mt-1">Access your room rent, mess menu & maintenance</p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Registered Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold gap-2 shadow-lg shadow-emerald-600/20">
                Get Verification Code <ArrowRight className="h-4 w-4" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  toast.success('Instant Resident Access Granted!');
                  router.push('/tenant/dashboard');
                }}
                className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 border border-emerald-500/20"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> 1-Click Instant Demo Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Enter OTP sent to +91 {phone}</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 1234"
                  className="w-full text-center tracking-widest text-lg font-bold py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold gap-2">
                Verify & Enter Portal <ShieldCheck className="h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            <Link href="/login" className="hover:text-slate-300">
              Are you a PG Owner? Sign in here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
