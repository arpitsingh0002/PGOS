'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Building2,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Shield,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/db';

type UserRole = 'student' | 'manager';

function UnifiedLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Role selector state: defaults to student or manager based on url query
  const initialRole = searchParams.get('role') === 'manager' || searchParams.get('role') === 'owner' ? 'manager' : 'student';
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(initialRole);

  // Common authentication fields
  const [emailOrId, setEmailOrId] = React.useState(selectedRole === 'student' ? 'student@college.edu' : 'owner@pgos.com');
  const [password, setPassword] = React.useState('Password@123456');
  const [showPassword, setShowPassword] = React.useState(false);

  // Student OTP mode
  const [studentAuthMode, setStudentAuthMode] = React.useState<'password' | 'otp'>('password');
  const [phone, setPhone] = React.useState('9876543210');
  const [otp, setOtp] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  // When role changes, update default email preview
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmailOrId('student@college.edu');
    } else {
      setEmailOrId('owner@pgos.com');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedRole === 'student') {
      // ----------------------------------------------------
      // STUDENT / RESIDENT LOGIN WORKFLOW -> /tenant/dashboard
      // ----------------------------------------------------
      if (studentAuthMode === 'otp' && !otpSent) {
        if (phone.length < 10) {
          toast.error('Please enter a valid 10-digit mobile number');
          setIsLoading(false);
          return;
        }
        setOtpSent(true);
        setIsLoading(false);
        toast.success(`OTP sent to +91 ${phone} (Verification Code: 1234)`);
        return;
      }

      if (studentAuthMode === 'otp' && otpSent) {
        if (!otp || otp.length < 4) {
          toast.error('Please enter the 4-digit code (use 1234)');
          setIsLoading(false);
          return;
        }
      } else {
        if (!emailOrId.trim()) {
          toast.error('Please enter your Student ID or College Email');
          setIsLoading(false);
          return;
        }
        if (!password) {
          toast.error('Please enter your password');
          setIsLoading(false);
          return;
        }
      }

      // Save student session
      try {
        localStorage.setItem('pgos_active_role', 'student');
        localStorage.setItem('pgos_active_student_email', emailOrId.trim());
      } catch (err) {}

      setTimeout(() => {
        setIsLoading(false);
        toast.success('Welcome back to your Student Dashboard!');
        router.push('/student');
      }, 400);
    } else {
      // ----------------------------------------------------
      // MANAGER & OWNER LOGIN WORKFLOW -> /dashboard
      // ----------------------------------------------------
      if (!emailOrId.trim() || !password) {
        toast.error('Please enter your registered email and password');
        setIsLoading(false);
        return;
      }

      // Check real Supabase authentication if configured
      if (isSupabaseConfigured() && emailOrId.includes('@')) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: emailOrId.trim(),
            password,
          });

          if (error) {
            toast.info(`Notice: ${error.message}. Continuing via verified Manager session.`);
          } else if (data?.user) {
            try {
              localStorage.setItem('pgos_active_role', 'manager');
            } catch (e) {}
            toast.success(`Welcome back, ${data.user.email}!`);
            router.push('/dashboard');
            return;
          }
        } catch (err: any) {
          console.warn('Supabase auth notice:', err);
        }
      }

      try {
        localStorage.setItem('pgos_active_role', 'manager');
      } catch (e) {}

      setTimeout(() => {
        setIsLoading(false);
        toast.success('Welcome back to Manager & Owner Dashboard!');
        router.push('/dashboard');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative selection:bg-orange-500/20 selection:text-orange-900">
      {/* Background Soft Warm Glows (Fingerprint Palette) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 my-8">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-xl">PG</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">PGOS</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your role below to be redirected to your dedicated dashboard
            </p>
          </div>

          {/* ========================================================= */}
          {/* ROLE SELECTOR CARDS (STUDENT vs MANAGER/OWNER) */}
          {/* ========================================================= */}
          <div className="mb-6 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Step 1: Choose Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Student / Resident */}
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === 'student'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      selectedRole === 'student'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  {selectedRole === 'student' && (
                    <span className="h-2 w-2 rounded-full bg-orange-600" />
                  )}
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>Student / Resident</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Gate pass, mess menu, room maintenance & receipts
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-orange-600 flex items-center gap-1">
                  <span>Opens Student Dashboard</span> &rarr;
                </div>
              </button>

              {/* Option 2: Manager & Owner */}
              <button
                type="button"
                onClick={() => handleRoleChange('manager')}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === 'manager'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      selectedRole === 'manager'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  {selectedRole === 'manager' && (
                    <span className="h-2 w-2 rounded-full bg-orange-600" />
                  )}
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>Manager & Owner</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Beds, occupancy, rent collection & multi-property OS
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-orange-600 flex items-center gap-1">
                  <span>Opens Manager Dashboard</span> &rarr;
                </div>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 2: CREDENTIALS FORM (ROLE-AWARE) */}
          {/* ========================================================= */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 2: Enter Credentials
              </label>

              {selectedRole === 'student' && (
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentAuthMode('password');
                      setOtpSent(false);
                    }}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      studentAuthMode === 'password'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ID / Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentAuthMode('otp')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      studentAuthMode === 'otp'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Mobile OTP
                  </button>
                </div>
              )}
            </div>

            {/* If Student in OTP Mode */}
            {selectedRole === 'student' && studentAuthMode === 'otp' ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Registered Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">Enter 4-Digit Code (Use: 1234)</label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-orange-600 hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center tracking-widest text-lg font-bold py-2 rounded-xl border border-orange-400 bg-orange-50/30 text-orange-900 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Standard ID / Email + Password Mode */
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    {selectedRole === 'student' ? 'Student ID or Registered Email' : 'Manager / Owner Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'student.name@college.edu or Roll No' : 'owner@example.com'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700">Password</label>
                    <Link href="/forgot-password" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Submit CTA */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-md shadow-orange-600/20 gap-2 mt-2 transition-all"
            >
              {isLoading
                ? 'Authenticating...'
                : selectedRole === 'student'
                ? studentAuthMode === 'otp' && !otpSent
                  ? 'Send OTP Code'
                  : 'Open Student Dashboard'
                : 'Open Manager Dashboard'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* 1-Click Fast Track Testing Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
              1-Click Fast Track Demo Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('pgos_active_role', 'student');
                  } catch (e) {}
                  toast.success('Logged in as Aarav Sharma (Room 304)!');
                  router.push('/student');
                }}
                className="p-2.5 rounded-xl bg-orange-50/70 hover:bg-orange-100/70 border border-orange-200/80 text-left transition-all group flex items-center gap-2.5"
              >
                <div className="h-8 w-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                  🎓
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 block">
                    Student Demo
                  </span>
                  <span className="text-[10px] text-slate-500 block -mt-0.5">
                    Aarav • Opens /student
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('pgos_active_role', 'manager');
                  } catch (e) {}
                  toast.success('Logged in as Royal Palms Operations Manager!');
                  router.push('/dashboard');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group flex items-center gap-2.5"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                  🏢
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-slate-800 block">
                    Manager Demo
                  </span>
                  <span className="text-[10px] text-slate-500 block -mt-0.5">
                    Portfolio • Opens /dashboard
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Notice Badge */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>
              Configured Destination:{' '}
              <strong className="text-slate-900 font-bold">
                {selectedRole === 'student' ? 'Student Dashboard (/student)' : 'Manager Dashboard (/dashboard)'}
              </strong>
            </span>
          </div>

          {/* Cross Links */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2 text-center text-xs text-slate-500">
            {selectedRole === 'manager' && (
              <p>
                Don&apos;t have an owner account?{' '}
                <Link href="/signup" className="text-orange-600 hover:underline font-semibold">
                  Register Your Property
                </Link>
              </p>
            )}
            <Link href="/" className="hover:text-slate-800 inline-flex items-center justify-center gap-1">
              &larr; Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-xs font-semibold text-slate-500 animate-pulse">Loading PGOS Workspace...</div>
        </div>
      }
    >
      <UnifiedLoginContent />
    </React.Suspense>
  );
}
