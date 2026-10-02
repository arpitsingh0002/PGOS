'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
            <h1 className="text-xl font-bold text-white tracking-tight">Reset Password</h1>
            <p className="text-xs text-slate-400 mt-1">We will send a password reset link to your registered email</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-base font-semibold text-white">Reset Link Sent</h2>
              <p className="text-xs text-slate-400">
                Check your inbox at <span className="text-white font-medium">{email}</span> for instructions.
              </p>
              <Link href="/login">
                <Button variant="outline" className="mt-4 text-xs">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Registered Email</label>
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

              <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold gap-2 shadow-lg shadow-indigo-600/25">
                Send Reset Link <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
