'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
  UtensilsCrossed,
  Wifi,
  FileText,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/db';

export default function StudentLoginPage() {
  const router = useRouter();

  // Authentication mode: 'credentials' (Student ID/Email + Password) or 'otp' (Mobile + OTP)
  const [authMode, setAuthMode] = React.useState<'credentials' | 'otp'>('credentials');

  // Credentials state
  const [studentId, setStudentId] = React.useState('aarav.sharma@college.edu');
  const [password, setPassword] = React.useState('Student@1234');
  const [showPassword, setShowPassword] = React.useState(false);

  // OTP state
  const [phone, setPhone] = React.useState('9876543210');
  const [otp, setOtp] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);

  // Loading state
  const [isLoading, setIsLoading] = React.useState(false);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle Credentials Login (Email/Student ID + Password)
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!studentId.trim()) {
      toast.error('Please enter your Student ID or Registered Email');
      setIsLoading(false);
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      setIsLoading(false);
      return;
    }

    // Try Supabase auth if configured and an email format is provided
    if (isSupabaseConfigured() && studentId.includes('@')) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: studentId.trim(),
          password,
        });

        if (error) {
          // If credentials don't match live Supabase user, notify and fallback to demo profile
          toast.info(`Supabase Auth: ${error.message}. Connecting via Student Demo Profile...`);
        } else if (data?.user) {
          toast.success(`Welcome back, ${data.user.email}!`);
          router.push('/tenant/dashboard');
          return;
        }
      } catch (err: any) {
        console.warn('Supabase auth notice:', err);
      }
    }

    // Demo / Verified Student Resident session
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login Successful! Welcome to Student Portal.');
      router.push('/tenant/dashboard');
    }, 600);
  };

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setResendTimer(30);
    toast.success('OTP sent to +91 ' + phone + ' (Code: 1234)');
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter the 4-digit verification code');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Mobile verified! Welcome Aarav Sharma (Room 204)');
      router.push('/tenant/dashboard');
    }, 500);
  };

  // Quick 1-Click Demo Profiles for testing
  const handleQuickLogin = (name: string, room: string, id: string) => {
    toast.success(`Logged in as ${name} (${room})!`);
    router.push('/tenant/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Main Card */}
        <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">PGOS</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Student & Hostel Resident Portal
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">Student Login</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Access your hostel room, mess schedule, fee receipts, Wi-Fi & gate passes
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('credentials')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'credentials'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Student ID / Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'otp'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              Mobile OTP
            </button>
          </div>

          {/* Tab 1: Credentials Form */}
          {authMode === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Student ID or College Email</span>
                  <span className="text-[10px] text-slate-500">e.g. STU-2026-089</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="student.name@college.edu or Roll No"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">Hostel Portal Password</label>
                  <Link href="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-sm font-semibold gap-2 mt-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Student Portal'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Tab 2: Mobile OTP Form */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Registered Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-semibold">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold gap-2 shadow-lg shadow-cyan-600/25"
                  >
                    Send Verification Code <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300">
                        Enter 4-Digit OTP sent to +91 {phone}
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center tracking-widest text-xl font-bold py-2.5 rounded-xl border border-cyan-500/50 bg-slate-950 text-cyan-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none shadow-inner"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold gap-2 shadow-lg shadow-cyan-600/25"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP & Enter Portal'}
                    <ShieldCheck className="h-4 w-4" />
                  </Button>

                  <div className="text-center text-xs text-slate-500">
                    {resendTimer > 0 ? (
                      <span>Resend code in <strong className="text-slate-300">{resendTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setResendTimer(30);
                          toast.success('New OTP sent: 1234');
                        }}
                        className="text-cyan-400 hover:underline font-medium"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 1-Click Instant Demo Profiles Section */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                1-Click Quick Demo Access
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Aarav Sharma', 'Room 204', 'STU-001')}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                    Aarav Sharma
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                    Rm 204
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">B.Tech CSE • Royal Palms</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('Priya Patel', 'Room 102', 'STU-002')}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                    Priya Patel
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono">
                    Rm 102
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">MBA Finance • Block B</p>
              </button>
            </div>
          </div>

          {/* Student Perks Badge Strip */}
          <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/60 text-center">
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-medium">Daily Mess</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <FileText className="h-3.5 w-3.5 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-medium">Fee Receipts</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <Wifi className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-medium">Hostel Wi-Fi</span>
            </div>
          </div>

          {/* Cross Links */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2 text-center text-xs text-slate-400">
            <Link href="/login" className="hover:text-indigo-300 flex items-center justify-center gap-1 transition-colors">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              Are you a PG Owner or Warden? Sign in here &rarr;
            </Link>
            <Link href="/" className="text-[11px] text-slate-500 hover:text-slate-400 mt-1">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
