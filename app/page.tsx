'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  BedDouble,
  Users,
  CreditCard,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Smartphone,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-xl">PG</span>
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">PGOS</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block -mt-1">
              Hostel & Co-living OS
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#bed-grid" className="hover:text-white transition-colors">Visual Bed Grid</a>
          <a href="#mess" className="hover:text-white transition-colors">Mess System</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/student-login">
            <Button variant="outline" size="sm" className="text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 hover:text-cyan-200 gap-1.5 shadow-sm">
              🎓 Student Login
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" variant="outline" className="text-xs">
              Owner Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs shadow-lg shadow-indigo-600/25">
              Launch Live App &rarr;
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          The Operating System for Modern Indian PG & Hostel Chains
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Manage 10 to 1,000+ Beds with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Zero Friction</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
          From visual bed allocations and automated WhatsApp rent receipts to per-building mess management, staff task boards, and tenant PWAs.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-sm font-bold shadow-xl shadow-indigo-600/30 gap-2">
              <LayoutDashboard className="h-4 w-4" /> Open Owner Dashboard Demo
            </Button>
          </Link>
          <Link href="/tenant/dashboard">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-sm font-semibold gap-2 border-slate-700">
              <Smartphone className="h-4 w-4 text-emerald-400" /> Try Mobile Tenant PWA
            </Button>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Multi-Property RLS</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Visual Bed Matrix</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Submeter Electricity</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Per-Building Mess System</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1-Click Render Deploy</span>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Architected for Scale</h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Engineered Specifically for the Indian PG Ecosystem
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            No generic rental templates. Built around sharing models (Single, Double, Triple), meal timings, and on-ground caretaker workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Bed Grid */}
          <Card className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BedDouble className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Visual Bed Grid Matrix</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Color-coded status across every bed in every room (🟢 Available, 🔴 Occupied, 🟡 Reserved, ⚫ Maintenance). Onboard a resident into a specific bed in under 30 seconds.
            </p>
          </Card>

          {/* Feature 2: Mess & Dining */}
          <Card className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Per-Building Mess Management</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure 4-meal daily schedules (Breakfast, Lunch, Evening Chai & Snacks, Dinner) per wing. Track boarder meal attendance and analyze food cost per tenant.
            </p>
          </Card>

          {/* Feature 3: Bulk Invoicing & UPI */}
          <Card className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">1-Click Bulk Rent Invoicing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate dues across hundreds of beds simultaneously on the 1st of each month. Generate printable digital receipts with automated numbering and UTR verification.
            </p>
          </Card>

          {/* Feature 4: Staff & Tasks */}
          <Card className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Staff RBAC & Task Board</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage salaries and roles for managers, wardens, chefs, and cleaners. Kanban task board ensures tank cleanings, filter replacements, and checkouts never slip.
            </p>
          </Card>

          {/* Feature 5: Kanban Complaints */}
          <Card className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Maintenance Ticket SLA</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tenants file issues via their mobile app. Caretakers receive real-time push alerts, update progress on the Kanban board, and close with resolution notes.
            </p>
          </Card>

          {/* Feature 6: Tenant PWA */}
          <Card className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Mobile Tenant App (PWA)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Residents can view today&apos;s menu, pay rent via UPI, download tax-ready rent receipts, inspect agreement terms, and read broadcast notices.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/80 text-center">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Simple, Transparent Pricing</h2>
        <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">Scale as Your Beds Grow</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          {/* Tier 1 */}
          <Card className="glass-card p-6 space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">Starter Hostels</h4>
              <p className="text-xs text-slate-400">Single property up to 25 beds</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">₹999</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Visual Bed Matrix</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Rent receipts & ledger</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Tenant portal</li>
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-xs">Start 14-Day Free Trial</Button>
            </Link>
          </Card>

          {/* Tier 2 */}
          <Card className="glass-card p-6 space-y-4 border-indigo-500/50 bg-gradient-to-b from-indigo-950/30 to-slate-900 shadow-2xl relative">
            <span className="absolute -top-3 right-6 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-3 py-0.5 rounded-full">
              Most Popular
            </span>
            <div>
              <h4 className="text-base font-bold text-white">Multi-Branch Pro</h4>
              <p className="text-xs text-slate-400">Up to 3 properties / 150 beds</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">₹2,499</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Everything in Starter</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Per-Building Mess system</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Staff task delegation board</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Submeter electricity billing</li>
            </ul>
            <Link href="/dashboard">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs shadow-md shadow-indigo-600/25">
                Launch PGOS Pro &rarr;
              </Button>
            </Link>
          </Card>

          {/* Tier 3 */}
          <Card className="glass-card p-6 space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">Co-living Enterprise</h4>
              <p className="text-xs text-slate-400">Unlimited properties & beds</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">₹5,999</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Custom branding & domain</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Dedicated database & RLS</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Automated WhatsApp Bot API</li>
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-xs">Contact Enterprise Sales</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">PG</div>
          <span className="font-semibold text-slate-300">PGOS &copy; {new Date().getFullYear()}</span>
          <span>&bull; Modern PG & Hostel Management Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-slate-300">Owner Portal</Link>
          <Link href="/tenant/login" className="hover:text-slate-300">Resident Portal</Link>
          <Link href="/properties" className="hover:text-slate-300">Branches</Link>
        </div>
      </footer>
    </div>
  );
}
