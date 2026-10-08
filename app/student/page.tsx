'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Building2,
  CreditCard,
  UtensilsCrossed,
  QrCode,
  Wrench,
  Wifi,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  LogOut,
  ChevronRight,
  ChevronDown,
  MapPin,
  ExternalLink,
  HelpCircle,
  FileText,
  AlertCircle,
  ArrowLeft,
  Flame,
  User,
  Phone,
  Mail,
  X,
  Shield,
  HeartPulse,
  Key,
  Bell,
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils/format';

export default function StudentDashboardPage() {
  const router = useRouter();

  // Student Profile State
  const student = {
    name: 'Aarav Sharma',
    studentId: 'STU-BLR-2024-049',
    college: 'RV College of Engineering, Bengaluru',
    course: 'B.Tech CSE (3rd Year, Semester 5)',
    pgName: 'Royal Palms Student Residency',
    room: 'Room 304',
    bed: 'Bed B (Window Side, AC Double Sharing)',
    address: '14th Main, 4th Cross, Koramangala 4th Block, Bengaluru, Karnataka - 560034',
    city: 'Koramangala, Bengaluru',
    monthlyRent: 9500,
    rentStatus: 'Paid for Current Month',
    nextDue: '05 Nov 2026',
    wifiSSID: 'RoyalPalms_Student_5G',
    wifiPass: 'palms@study2026',
    wardenName: 'Mr. Suresh Nair',
    wardenPhone: '+91 98765 43210',
    guardianName: 'Rajesh Sharma (Father)',
    guardianPhone: '+91 98111 22334',
    bloodGroup: 'O+',
    curfewTime: '10:30 PM (Biometric Turnstile #2)',
  };

  // Profile Drawer State (Side Window)
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = React.useState(false);
  const [profileDrawerTab, setProfileDrawerTab] = React.useState<'student' | 'gatepass' | 'pg'>('student');

  // Drawers State (Side Windows for Mobile Button Views)
  const [isMessRoutineDrawerOpen, setIsMessRoutineDrawerOpen] = React.useState(false);
  const [isAmenitiesDrawerOpen, setIsAmenitiesDrawerOpen] = React.useState(false);
  const [isNoticeBoardDrawerOpen, setIsNoticeBoardDrawerOpen] = React.useState(false);
  const [isTicketsDrawerOpen, setIsTicketsDrawerOpen] = React.useState(false);
  const [copiedWifiPass, setCopiedWifiPass] = React.useState(false);

  // Active Tab for Main Desk
  const [activeTab, setActiveTab] = React.useState<'overview' | 'mess' | 'complaints' | 'receipts'>('overview');

  // Gate Pass Interactive Generator State
  const [passReason, setPassReason] = React.useState('Library & Late Project Work');
  const [expectedReturn, setExpectedReturn] = React.useState('10:00 PM');
  const [gatePassCode, setGatePassCode] = React.useState('GP-9482-BLR');
  const [copiedCode, setCopiedCode] = React.useState(false);

  // Mess Selection
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = React.useState<string>(days[todayDayIndex]);
  const [isTiffinOpted, setIsTiffinOpted] = React.useState(true);

  // Maintenance Ticket Generator
  const [complaintCategory, setComplaintCategory] = React.useState('Wi-Fi & Internet');
  const [complaintDesc, setComplaintDesc] = React.useState('');
  const [complaintsList, setComplaintsList] = React.useState([
    {
      id: 'TKT-108',
      title: 'Wi-Fi Speed Dropping in 3rd Floor Wing',
      category: 'Wi-Fi',
      status: 'Assigned to Technician Ravi',
      date: 'Today, 11:20 AM',
      priority: 'High',
    },
    {
      id: 'TKT-094',
      title: 'AC Filter Cleaning in Room 304',
      category: 'Electrical',
      status: 'Resolved & Closed',
      date: '02 Oct 2026',
      priority: 'Medium',
    },
  ]);

  // Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);

  const handleCopyPassCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(gatePassCode);
    }
    setCopiedCode(true);
    toast.success('Gate Pass Token copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyWifiPass = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(student.wifiPass);
    }
    setCopiedWifiPass(true);
    toast.success('Wi-Fi Password copied to clipboard!');
    setTimeout(() => setCopiedWifiPass(false), 2000);
  };

  const handleRegenerateGatePass = () => {
    const randomCode = `GP-${Math.floor(1000 + Math.random() * 9000)}-BLR`;
    setGatePassCode(randomCode);
    toast.success('Generated New Contactless QR Gate Pass Token!');
  };

  const handleLogComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) {
      toast.error('Please describe the issue briefly');
      return;
    }
    const newTkt = {
      id: `TKT-${Math.floor(110 + Math.random() * 890)}`,
      title: `${complaintCategory}: ${complaintDesc}`,
      category: complaintCategory,
      status: 'Under Review by Warden',
      date: 'Just now',
      priority: 'High',
    };
    setComplaintsList([newTkt, ...complaintsList]);
    setComplaintDesc('');
    toast.success('Complaint ticket logged! Warden notified via SMS.');
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('pgos_active_role');
    } catch (e) {}
    toast.success('Signed out of Student Portal');
    router.push('/login');
  };

  const openDrawerWithTab = (tab: 'student' | 'gatepass' | 'pg') => {
    setProfileDrawerTab(tab);
    setIsProfileDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-orange-500/20 selection:text-orange-900 pb-24 md:pb-16">
      {/* ========================================================= */}
      {/* 1. TOP APP BAR (With New Right Profile Section) */}
      {/* ========================================================= */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-sm">PG</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-slate-900 tracking-tight">PGOS</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                    Student
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block truncate max-w-[140px] md:max-w-none">
                  {student.pgName}
                </p>
              </div>
            </Link>
          </div>

          {/* Student Status Strip (Fingerprint Health Pill) */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Room 304 Active &bull; No Dues</span>
            </div>
            <div className="text-slate-500 text-xs">
              Next Due: <strong className="text-slate-800 font-bold">{student.nextDue}</strong>
            </div>
          </div>

          {/* Right Controls: Manager Jump + PROFILE SECTION */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors hidden md:flex items-center gap-1"
            >
              <Building2 className="h-3.5 w-3.5 text-orange-600" />
              <span>Manager Portal</span>
            </Link>

            {/* ========================================================= */}
            {/* 1. PROFILE SECTION ON RIGHT SIDE OF NAV BAR (With Animations) */}
            {/* ========================================================= */}
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(!isProfileDrawerOpen)}
              className={`flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-xl border transition-all duration-300 shadow-xs group cursor-pointer active:scale-95 select-none relative ${
                isProfileDrawerOpen
                  ? 'border-orange-500 bg-orange-50/80 shadow-md ring-4 ring-orange-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-400 hover:shadow-xs'
              }`}
              title="Toggle Student Profile & Residence Passport"
            >
              {/* Avatar circle with animated online pulse indicator */}
              <div className="relative">
                <div
                  className={`h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs transition-transform duration-300 ${
                    isProfileDrawerOpen
                      ? 'scale-110 rotate-6 shadow-md shadow-orange-500/30 ring-2 ring-orange-300'
                      : 'group-hover:scale-105'
                  }`}
                >
                  AS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>

              {/* Student Name & Room badge */}
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-none">Aarav Sharma</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                    Rm 304
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Passport & QR</span>
              </div>

              {/* Mobile Only Room Pill */}
              <span className="sm:hidden text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                304
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ease-in-out ${
                  isProfileDrawerOpen ? 'rotate-180 text-orange-600' : 'text-slate-400 group-hover:text-slate-700'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN STUDENT CONTAINER */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Resident Hero Profile Strip */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <button
              onClick={() => openDrawerWithTab('student')}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-xs flex-shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Click to view full passport"
            >
              AS
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => openDrawerWithTab('student')}
                  className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight hover:text-orange-600 transition-colors text-left truncate"
                >
                  {student.name}
                </button>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] sm:text-[11px] font-bold">
                  Verified Resident
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {student.college} &bull; ID: <span className="font-mono text-slate-700">{student.studentId}</span>
              </p>
              <p className="text-xs text-slate-700 font-medium mt-1 flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
                <span>{student.room} ({student.bed}) &bull; {student.pgName}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <Button
              size="sm"
              onClick={() => setIsPayModalOpen(true)}
              className="col-span-2 sm:col-auto bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-1.5 shadow-xs h-9"
            >
              <CreditCard className="h-4 w-4" />
              <span>Pay Rent & Dues</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('complaints')}
              className="col-span-1 sm:col-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold gap-1.5 h-9"
            >
              <Wrench className="h-4 w-4 text-orange-600" />
              <span>Raise Ticket</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('mess')}
              className="col-span-1 sm:col-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold gap-1.5 h-9"
            >
              <UtensilsCrossed className="h-4 w-4 text-amber-600" />
              <span>Mess Menu</span>
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. FOUR KPI INSIGHT CARDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Card 1: Monthly Rent Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs hover:border-orange-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Monthly Rent</span>
              <CreditCard className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(student.monthlyRent)}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] gap-0.5">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold truncate">
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Paid Oct &apos;26
              </span>
              <span className="text-slate-400">Due Nov 5</span>
            </div>
          </div>

          {/* Card 2: Daily Mess Plan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs hover:border-orange-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Student Mess</span>
              <UtensilsCrossed className="h-4 w-4 text-orange-600 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              3 Meals Incl.
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] gap-0.5">
              <span className="text-slate-600 font-medium truncate">
                Dinner: Paneer
              </span>
              <span className="text-orange-600 font-bold">Tiffin Active</span>
            </div>
          </div>

          {/* Card 3: Room Care & Housekeeping */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs hover:border-orange-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Housekeeping</span>
              <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Room Cleaned
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] gap-0.5">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold truncate">
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Sanitized
              </span>
              <span className="text-slate-400">11:30 AM</span>
            </div>
          </div>

          {/* Card 4: Wi-Fi High-Speed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs hover:border-orange-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Hostel Wi-Fi</span>
              <Wifi className="h-4 w-4 text-cyan-600 flex-shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
              150 Mbps
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] gap-0.5">
              <span className="text-slate-600 font-mono text-[9px] sm:text-[10px] truncate">{student.wifiPass}</span>
              <span className="text-emerald-600 font-bold">Connected</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. MAIN DESK TABS (Horizontal Scrollable for Mobile & Desktop) */}
        {/* ========================================================= */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'overview', label: 'Command Desk', icon: Sparkles },
            { id: 'mess', label: 'Daily Mess & Tiffin', icon: UtensilsCrossed },
            { id: 'complaints', label: 'Maintenance Helpdesk', icon: Wrench },
            { id: 'receipts', label: 'Rent Receipts & HRA', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 5. TAB CONTENT AREAS */}
        {/* ========================================================= */}

        {/* TAB 1: OVERVIEW COMMAND DESK */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* ========================================================= */}
            {/* 1. MOBILE VIEW (md:hidden): ALL 4 SECTIONS CONVERTED TO BUTTONS */}
            {/* Each button slides open a dedicated full-details side window */}
            {/* ========================================================= */}
            <div className="md:hidden space-y-3">
              {/* Mobile Button 1: Today's Food & Mess Routine */}
              <button
                type="button"
                onClick={() => setIsMessRoutineDrawerOpen(true)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-400 p-4 shadow-xs hover:shadow-md transition-all group cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xs">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                        Today&apos;s Food & Mess Routine
                      </h3>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 whitespace-nowrap">
                        Live Menu
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                      <span>Breakfast</span> &bull; <span>Lunch</span> &bull; <span>Snacks</span> &bull; <span>Dinner</span>
                    </p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-orange-50 text-slate-400 group-hover:text-orange-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              {/* Mobile Button 2: Hostel Amenities & Room Access */}
              <button
                type="button"
                onClick={() => setIsAmenitiesDrawerOpen(true)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-cyan-400 p-4 shadow-xs hover:shadow-md transition-all group cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-xs">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                        Hostel Amenities & Room Access
                      </h3>
                      <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 whitespace-nowrap">
                        Room 304
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                      <span>Wi-Fi (150 Mbps)</span> &bull; <span>Laundry</span> &bull; <span>Warden Desk</span>
                    </p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-cyan-50 text-slate-400 group-hover:text-cyan-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              {/* Mobile Button 3: Notice Board & Warden Desk */}
              <button
                type="button"
                onClick={() => setIsNoticeBoardDrawerOpen(true)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-amber-400 p-4 shadow-xs hover:shadow-md transition-all group cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                        Notice Board & Warden Desk
                      </h3>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                        3 Updates
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                      <span>RO Filter</span> &bull; <span>Diwali Leave Form</span> &bull; <span>Reading Hall</span>
                    </p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-amber-50 text-slate-400 group-hover:text-amber-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              {/* Mobile Button 4: Recent Tickets & Helpdesk */}
              <button
                type="button"
                onClick={() => setIsTicketsDrawerOpen(true)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-400 p-4 shadow-xs hover:shadow-md transition-all group cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        Maintenance Tickets & Helpdesk
                      </h3>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 whitespace-nowrap">
                        {complaintsList.length} Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                      <span>Wi-Fi speed</span> &bull; <span>AC filter cleaning</span> &bull; <span>+ Log New</span>
                    </p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            </div>

            {/* ========================================================= */}
            {/* 2. LAPTOP / DESKTOP VIEW (hidden md:grid): FULL CARDS UNCHANGED */}
            {/* Exactly as requested: Don't change in laptop view */}
            {/* ========================================================= */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Today's Schedule & Amenities */}
              <div className="lg:col-span-2 space-y-6">
                {/* Daily Schedule Banner */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        Today&apos;s Hostel Food & Mess Routine
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Healthy 3-meal hygienic student kitchen schedule ({selectedDay})
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                      Live Menu
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Breakfast (07:30 - 09:30 AM)
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1">Idli, Medu Vada & Sambar</p>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Served in Dining Hall</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
                        Lunch (12:30 - 02:30 PM)
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1">Dal Tadka, Jeera Rice, Curd</p>
                      <span className="text-[10px] text-orange-600 font-semibold block mt-1">
                        {isTiffinOpted ? 'Packed in College Tiffin' : 'Dining Hall'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Snacks (05:00 - 06:15 PM)
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1">Veg Cutlet & Masala Chai</p>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-1">Common Area</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Dinner (08:00 - 10:00 PM)
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1">Paneer Butter Masala & Phulkas</p>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Dining Hall</span>
                    </div>
                  </div>

                  {/* College Tiffin Switcher */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900">Campus Lunch Tiffin Delivery</span>
                        <p className="text-[11px] text-slate-500">
                          Packed stainless steel tiffin delivered to RV College gate by 12:15 PM.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTiffinOpted(!isTiffinOpted);
                        toast.success(
                          isTiffinOpted ? 'Opted for Dining Hall lunch' : 'Packed College Tiffin requested!'
                        );
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isTiffinOpted
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isTiffinOpted ? 'Tiffin Active (Box #04)' : 'Opt-in for College Tiffin'}
                    </button>
                  </div>
                </div>

                {/* Quick Wi-Fi & Amenities Box on Laptop */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-cyan-600" />
                      Hostel Amenities & Room Access
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAmenitiesDrawerOpen(true)}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Details & Rules</span> &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Wi-Fi Network</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{student.wifiSSID}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">Password: {student.wifiPass}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Laundry Schedule</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">Tue & Fri (5 kg/wk)</p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">Included in Fee</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Floor Warden</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{student.wardenName}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">{student.wardenPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hostel Notice Board & Recent Tickets */}
              <div className="space-y-6">
                {/* Hostel Notice Board & Warden Desk */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          Hostel Updates
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        Notice Board & Warden Desk
                      </h3>
                    </div>
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>

                  {/* Notices List */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/70 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">RO Water Filter Servicing</span>
                        <span className="text-[10px] text-orange-700 font-medium">Tomorrow</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Purifier on 3rd floor wing scheduled for filter overhaul from 10:00 AM - 11:30 AM.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Diwali Vacation Leave Form</span>
                        <span className="text-[10px] text-slate-400 font-medium">Admin Office</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Students traveling home must register out-station dates at the warden desk before 25th Oct.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">24/7 Reading Hall Open</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Common study library on 1st floor available all night during semester midterms.
                      </p>
                    </div>
                  </div>

                  {/* Warden Helpline Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Floor Warden: {student.wardenName}</span>
                      <span className="text-xs font-mono font-bold text-slate-800">{student.wardenPhone}</span>
                    </div>
                    <a
                      href={`tel:${student.wardenPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-orange-600" />
                      <span>Call Warden</span>
                    </a>
                  </div>
                </div>

                {/* Maintenance Ticket Status Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Recent Tickets
                    </h3>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="text-xs text-orange-600 hover:underline font-semibold cursor-pointer"
                    >
                      + Log New
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {complaintsList.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{c.category}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-orange-100 text-orange-800">
                            {c.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{c.title}</p>
                        <span className="text-[10px] text-emerald-600 font-bold block mt-1">{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DAILY MESS & TIFFIN HUB */}
        {activeTab === 'mess' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                Hostel Mess Menu & Student Tiffin Box Hub
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your days to preview meals or schedule packed tiffin box deliveries for college hours.
              </p>
            </div>

            {/* Day Selector Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Detailed Meal Grid for Selected Day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Breakfast &bull; 07:30 - 09:30 AM
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">South Indian Breakfast</h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1">
                  <li>&bull; Steamed Idlis & Crispy Medu Vada</li>
                  <li>&bull; Drumstick & Vegetable Sambar</li>
                  <li>&bull; Fresh Coconut Chutney & Tomato Dip</li>
                  <li>&bull; Filter Coffee & Masala Tea</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                    Lunch &bull; 12:30 - 02:30 PM
                  </span>
                  <Badge className="bg-orange-600 text-white text-[9px]">Tiffin Option</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">North & South Thali</h4>
                <ul className="text-xs text-slate-700 mt-2 space-y-1">
                  <li>&bull; Dal Tadka & Jeera Rice</li>
                  <li>&bull; Aloo Gobhi Dry & Phulkas</li>
                  <li>&bull; Sweet Gulab Jamun (1 pc)</li>
                  <li>&bull; Curd & Fresh Cucumber Salad</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Evening Snacks &bull; 05:00 - 06:15 PM
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">Tea & Refreshments</h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1">
                  <li>&bull; Vegetable Cutlet / Onion Pakodas</li>
                  <li>&bull; Green Mint & Tamarind Chutney</li>
                  <li>&bull; Hot Masala Ginger Chai</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Dinner &bull; 08:00 - 10:00 PM
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">Special Dinner</h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1">
                  <li>&bull; Paneer Butter Masala</li>
                  <li>&bull; Whole Wheat Butter Rotis</li>
                  <li>&bull; Vegetable Biryani / Pulao</li>
                  <li>&bull; Boondi Raita & Roasted Papad</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MAINTENANCE & WI-FI HELPDESK */}
        {activeTab === 'complaints' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                Room Maintenance & Wi-Fi Helpdesk
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Report electrical, plumbing, AC, Wi-Fi or housekeeping issues for rapid in-house resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Form */}
              <form onSubmit={handleLogComplaint} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Issue Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Wi-Fi & Internet', 'Air Conditioner / Fan', 'Plumbing & Washroom', 'Carpentry / Furniture'].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setComplaintCategory(cat)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                          complaintCategory === cat
                            ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Describe Problem
                  </label>
                  <textarea
                    rows={3}
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="e.g. Wi-Fi router on 3rd floor red light blinking, or geyser not heating water..."
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Submit Maintenance Ticket
                </Button>
              </form>

              {/* Active Tickets List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Ticket Tracking
                </h3>
                {complaintsList.map((tkt) => (
                  <div key={tkt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{tkt.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                        {tkt.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{tkt.date}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {tkt.status}
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">{tkt.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RENT RECEIPTS & HRA */}
        {activeTab === 'receipts' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Digital Rent Receipts & HRA Invoices
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Download certified tax-compliant rent payment receipts with Landlord PAN and GSTIN.
                </p>
              </div>

              <Button
                onClick={() => {
                  toast.success('Downloaded Combined Annual HRA Certificate for FY 2026-27!');
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-1.5 shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Annual HRA Certificate</span>
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { month: 'October 2026', amount: 9500, receiptNo: 'REC-2026-10-049', date: '03 Oct 2026', mode: 'UPI (Google Pay)' },
                { month: 'September 2026', amount: 9500, receiptNo: 'REC-2026-09-049', date: '02 Sep 2026', mode: 'UPI (PhonePe)' },
                { month: 'August 2026', amount: 9500, receiptNo: 'REC-2026-08-049', date: '04 Aug 2026', mode: 'Bank IMPS' },
              ].map((r) => (
                <div
                  key={r.receiptNo}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900">{r.month} Rent Receipt</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {r.receiptNo} &bull; Paid on {r.date} via {r.mode}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900">{formatINR(r.amount)}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast.success(`Downloaded Receipt: ${r.receiptNo}.pdf`);
                      }}
                      className="border-slate-200 text-xs gap-1.5 text-slate-700"
                    >
                      <Download className="h-3.5 w-3.5 text-orange-600" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 6. PROFILE SIDE WINDOW (DRAWER) - WITH SMOOTH ANIMATIONS */}
      {/* Options: student detail, gate pass qr, biometric token, pg details, log out */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isProfileDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop Blur Overlay with Smooth Fade Animation */}
        <div
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isProfileDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsProfileDrawerOpen(false)}
        />

        {/* Right Slide-Over Window Container with Smooth Slide Animation */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
          <div
            className={`w-full max-w-full sm:max-w-md sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-out ${
              isProfileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform hover:scale-105">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900">Student Residence Passport</h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {student.studentId} &bull; {student.room}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 hover:rotate-90 transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Close Profile Window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

              {/* Drawer Category Switcher Tabs */}
              <div className="p-3 border-b border-slate-100 bg-white grid grid-cols-3 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setProfileDrawerTab('student')}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    profileDrawerTab === 'student'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Student Detail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileDrawerTab('gatepass')}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all relative ${
                    profileDrawerTab === 'gatepass'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Gate Pass QR</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setProfileDrawerTab('pg')}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    profileDrawerTab === 'pg'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>PG Details</span>
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* ------------------------------------------------------------- */}
                {/* OPTION 1: STUDENT DETAIL */}
                {/* ------------------------------------------------------------- */}
                {profileDrawerTab === 'student' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Identity Hero Card */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30">
                      <div className="flex items-center gap-3.5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
                          AS
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-slate-900">{student.name}</h4>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              KYC Verified
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">{student.course}</p>
                          <p className="text-[11px] text-slate-400">{student.college}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Fields List */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 divide-y divide-slate-100 text-xs">
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-orange-600" /> Student / Roll ID
                        </span>
                        <span className="font-mono font-bold text-slate-900">{student.studentId}</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-orange-600" /> Mobile Number
                        </span>
                        <span className="font-mono font-bold text-slate-900">+91 98765 43210</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-orange-600" /> College Email
                        </span>
                        <span className="font-medium text-slate-900 truncate max-w-[200px]">
                          aarav.sharma@college.edu
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-orange-600" /> Guardian / Parent
                        </span>
                        <span className="font-bold text-slate-900">{student.guardianName}</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-orange-600" /> Guardian Emergency No
                        </span>
                        <span className="font-mono font-bold text-slate-900">{student.guardianPhone}</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <HeartPulse className="h-3.5 w-3.5 text-rose-600" /> Blood Group
                        </span>
                        <span className="font-bold text-rose-600">{student.bloodGroup}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Agreement Status
                        </span>
                        <span className="font-bold text-emerald-600">Digital Signed (FY 26-27)</span>
                      </div>
                    </div>

                    {/* Quick Button to Jump to Gate Pass */}
                    <button
                      type="button"
                      onClick={() => setProfileDrawerTab('gatepass')}
                      className="w-full p-3 rounded-xl bg-orange-50 hover:bg-orange-100/70 border border-orange-200 text-xs font-bold text-orange-800 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-orange-600" />
                        View Biometric Gate Pass Token & QR
                      </span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* OPTION 2: GATE PASS QR & BIOMETRIC TOKEN (Placed here from page) */}
                {/* ------------------------------------------------------------- */}
                {profileDrawerTab === 'gatepass' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/50 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
                        Live Contactless Security Token
                      </span>
                      <h4 className="text-lg font-black font-mono text-slate-900 mt-1 tracking-tight">
                        {gatePassCode}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Synced with Royal Palms Turnstile Reader #02 (East Gate)
                      </p>
                    </div>

                    {/* Live Scannable QR Code with Animated Scanner Effect */}
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white text-center shadow-xs">
                      <div className="h-44 w-44 mx-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative shadow-inner overflow-hidden group">
                        {/* Interactive scan beam line */}
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/70 to-transparent animate-pulse -translate-y-6" />
                        <QrCode className="h-32 w-32 text-slate-900 group-hover:scale-105 transition-transform duration-300" />
                        <span className="text-[9px] font-mono font-bold text-orange-600 mt-1">
                          {gatePassCode}
                        </span>
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyPassCode}
                          className="border-slate-200 text-xs gap-1.5 h-8 text-slate-700"
                        >
                          {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedCode ? 'Token Copied!' : 'Copy Code'}</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={handleRegenerateGatePass}
                          className="bg-orange-600 hover:bg-orange-500 text-white text-xs gap-1.5 h-8 shadow-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Generate New QR</span>
                        </Button>
                      </div>
                    </div>

                    {/* Out-Pass Purpose & Return Curfew Setup */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 text-xs">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Reason / Destination
                        </label>
                        <select
                          value={passReason}
                          onChange={(e) => setPassReason(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:border-orange-500 focus:outline-none"
                        >
                          <option value="Library & Late Project Work">Library & Late Project Work</option>
                          <option value="Tuition / Coaching Classes">Tuition / Coaching Classes</option>
                          <option value="Market & Grocery Visit">Market & Grocery Visit</option>
                          <option value="Home Visit (Weekend Leave)">Home Visit (Weekend Leave)</option>
                          <option value="Medical / Pharmacy Emergency">Medical / Pharmacy Emergency</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Expected Return Time (Hostel Curfew: 10:30 PM)
                        </label>
                        <select
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:border-orange-500 focus:outline-none"
                        >
                          <option value="08:30 PM">08:30 PM</option>
                          <option value="09:30 PM">09:30 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                          <option value="10:30 PM (Curfew Limit)">10:30 PM (Curfew Limit)</option>
                          <option value="Next Day Morning (Overnight Leave)">Next Day Morning (Overnight Leave)</option>
                        </select>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                        <strong className="text-slate-900">Biometric Rule:</strong> Please punch your enrolled thumb or scan this QR at turnstile #2 upon re-entry.
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* OPTION 3: PG DETAILS */}
                {/* ------------------------------------------------------------- */}
                {profileDrawerTab === 'pg' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        Residency Profile
                      </span>
                      <h4 className="text-base font-black text-slate-900">{student.pgName}</h4>
                      <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1 leading-snug">
                        <MapPin className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>{student.address}</span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 divide-y divide-slate-100 text-xs">
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-slate-400 font-semibold">Allocated Room</span>
                        <span className="font-bold text-slate-900">{student.room}</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold">Bed Position</span>
                        <span className="font-bold text-slate-900">{student.bed}</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold">Floor Warden</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{student.wardenName}</span>
                          <span className="text-[10px] text-orange-600 font-mono">{student.wardenPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold">Night Curfew Rule</span>
                        <span className="font-bold text-slate-900">{student.curfewTime}</span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold">Hostel Wi-Fi Network</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{student.wifiSSID}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Pass: {student.wifiPass}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-400 font-semibold">Monthly Rent</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{formatINR(student.monthlyRent)}/mo</span>
                          <span className="text-[10px] text-emerald-600 font-bold">&check; Paid for Oct 2026</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center justify-between">
                      <div>
                        <span className="font-bold block">Need Room Maintenance?</span>
                        <span className="text-[11px] text-orange-700">Warden and technician available 24/7.</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsProfileDrawerOpen(false);
                          setActiveTab('complaints');
                        }}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold h-7"
                      >
                        Raise Ticket
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* DRAWER FOOTER: LOG OUT & MANAGER PORTAL LINK */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold gap-2 h-10 shadow-xs"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out of Student Portal</span>
                </Button>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileDrawerOpen(false)}
                    className="hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    <Building2 className="h-3 w-3 text-orange-600" />
                    Open PG Owner & Manager OS &rarr;
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsProfileDrawerOpen(false)}
                    className="hover:text-slate-800 font-medium"
                  >
                    Close Passport &times;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* ========================================================= */}
      {/* 7. HOSTEL AMENITIES & ROOM ACCESS - SIDE DRAWER WINDOW */}
      {/* Smooth Slide-In Window containing all details for student amenities */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isAmenitiesDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop Blur Overlay with Smooth Fade */}
        <div
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isAmenitiesDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsAmenitiesDrawerOpen(false)}
        />

        {/* Right Slide-Over Window Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
          <div
            className={`w-full max-w-full sm:max-w-md sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-out ${
              isAmenitiesDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900">Hostel Amenities & Room Access</h3>
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">
                      Room 304
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {student.pgName} &bull; All Included In Rent
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAmenitiesDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 hover:rotate-90 transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Close Amenities Window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Detail 1: High Speed Wi-Fi Credentials */}
              <div className="p-4 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/60 via-white to-blue-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <Wifi className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 block">
                        High-Speed Wi-Fi
                      </span>
                      <h4 className="text-xs font-black text-slate-900">150 Mbps Dual-Band Fiber</h4>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Connected
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Network SSID:</span>
                    <span className="font-mono font-bold text-slate-900">{student.wifiSSID}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-400 font-semibold">Password:</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {student.wifiPass}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyWifiPass}
                        className="h-7 px-2 text-[10px] gap-1 border-slate-200 text-slate-700 cursor-pointer"
                      >
                        {copiedWifiPass ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedWifiPass ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Dual mesh routers installed on 3rd floor. Dedicated student bandwidth with 99.8% uptime SLA.
                </p>
              </div>

              {/* Detail 2: Laundry Schedule */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Laundry Service
                      </span>
                      <h4 className="text-xs font-black text-slate-900">Tuesday & Friday Wash Cycles</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Included in Fee
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Weight Allowance:</span>
                    <span className="font-bold text-slate-800">5 kg per resident / week</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Collection Point:</span>
                    <span className="font-medium text-slate-800">Utility Desk (Ground Floor, 10 AM)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Delivery:</span>
                    <span className="font-medium text-slate-800">Next Evening (Washed, Dried & Folded)</span>
                  </div>
                </div>
              </div>

              {/* Detail 3: Floor Warden & Help Desk */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Resident Assistance
                      </span>
                      <h4 className="text-xs font-black text-slate-900">Floor Warden & Help Desk</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    24/7 On-Duty
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Warden Name:</span>
                    <span className="font-bold text-slate-900">{student.wardenName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact Number:</span>
                    <span className="font-mono font-bold text-orange-600">{student.wardenPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Office Location:</span>
                    <span className="font-medium text-slate-800">Ground Floor Reception Suite #01</span>
                  </div>
                </div>

                <a
                  href={`tel:${student.wardenPhone}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-orange-600" />
                  <span>Call Warden Directly (+91 98765 43210)</span>
                </a>
              </div>

              {/* Detail 4: Security, Curfew & Utilities Matrix */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Room Access & Building Rules
                </h4>

                <div className="divide-y divide-slate-100 space-y-2">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-orange-600" /> Turnstile Gate Access
                    </span>
                    <span className="font-bold text-slate-900">Biometric & QR Scanners (East Gate)</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-orange-600" /> Night Curfew Deadline
                    </span>
                    <span className="font-bold text-rose-600">{student.curfewTime}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-orange-600" /> Hot Water Timings
                    </span>
                    <span className="font-bold text-slate-900">06:00 - 11:00 AM & 06:30 - 09:30 PM</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Drinking Water
                    </span>
                    <span className="font-bold text-emerald-700">3-Stage RO Purifier on Floor Corridor</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" /> 100% DG Power Backup
                    </span>
                    <span className="font-bold text-slate-900">Lights, Fans & Wi-Fi Always Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Button
                onClick={() => {
                  setIsAmenitiesDrawerOpen(false);
                  setActiveTab('complaints');
                }}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-2 h-10 shadow-xs cursor-pointer"
              >
                <Wrench className="h-4 w-4" />
                <span>Report Issue or Request Room Repair</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsAmenitiesDrawerOpen(false)}
                className="w-full py-1 text-center text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close Window &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8. TODAY'S FOOD & MESS ROUTINE - SIDE DRAWER WINDOW */}
      {/* Smooth Slide-In Window containing full 4-meal routine & tiffin delivery */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isMessRoutineDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop Blur Overlay */}
        <div
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isMessRoutineDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMessRoutineDrawerOpen(false)}
        />

        {/* Right Slide-Over Window Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
          <div
            className={`w-full max-w-full sm:max-w-md sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-out ${
              isMessRoutineDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-orange-50/60">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900">Today&apos;s Food &amp; Mess Routine</h3>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded border border-orange-200">
                      Live Menu
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Healthy 3-Meal Hygienic Kitchen &bull; {selectedDay}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMessRoutineDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 hover:rotate-90 transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Close Mess Routine Window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Day Selector Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedDay === day
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* 4 Daily Meal Cards */}
              <div className="space-y-3">
                {/* 1. Breakfast */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-500" /> Breakfast (07:30 - 09:30 AM)
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Served in Dining Hall
                    </Badge>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Idli, Medu Vada &amp; Sambar</h4>
                  <p className="text-[11px] text-slate-500">
                    Served with Fresh Coconut Chutney, Tomato Chutney &amp; Fresh Filter Coffee / Chai
                  </p>
                </div>

                {/* 2. Lunch */}
                <div className="p-3.5 rounded-2xl border border-orange-200 bg-orange-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-600" /> Lunch (12:30 - 02:30 PM)
                    </span>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-[10px]">
                      {isTiffinOpted ? 'Packed in College Tiffin' : 'Dining Hall'}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Dal Tadka, Jeera Rice, Curd &amp; Salad</h4>
                  <p className="text-[11px] text-slate-600">
                    Warm Phulkas (3 pcs), Seasonal Aloo Gobhi Subzi, Pickle &amp; Roasted Papad
                  </p>
                </div>

                {/* 3. Snacks */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" /> Evening Snacks (05:00 - 06:15 PM)
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Common Area
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Veg Cutlet &amp; Ginger Masala Chai</h4>
                  <p className="text-[11px] text-slate-500">
                    Served hot with Green Mint Chutney and Sweet Tomato Sauce
                  </p>
                </div>

                {/* 4. Dinner */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-500" /> Dinner (08:00 - 10:00 PM)
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Dining Hall
                    </Badge>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Paneer Butter Masala &amp; Phulkas</h4>
                  <p className="text-[11px] text-slate-500">
                    Fragrant Steamed Rice, Mix Veg Korma, Hot Rasam &amp; Gulab Jamun
                  </p>
                </div>
              </div>

              {/* Campus Lunch Tiffin Delivery Switcher */}
              <div className="p-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Campus Lunch Tiffin Delivery</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Delivered to RV College gate by 12:15 PM
                      </p>
                    </div>
                  </div>
                  <Badge className={isTiffinOpted ? 'bg-orange-500 text-white border-transparent' : 'bg-slate-100 text-slate-600'}>
                    {isTiffinOpted ? 'Box #04 Active' : 'Off'}
                  </Badge>
                </div>

                <Button
                  onClick={() => {
                    setIsTiffinOpted(!isTiffinOpted);
                    toast.success(
                      isTiffinOpted ? 'Switched to Dining Hall lunch' : 'Packed College Tiffin requested!'
                    );
                  }}
                  className={`w-full text-xs font-bold h-9 transition-all cursor-pointer ${
                    isTiffinOpted
                      ? 'bg-orange-600 hover:bg-orange-500 text-white'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                  }`}
                >
                  {isTiffinOpted ? 'Tiffin Active (Box #04) • Tap to Pause' : 'Opt-in for College Tiffin Delivery'}
                </Button>
              </div>

              {/* Kitchen Hygiene & Quality Matrix */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Mess Hygiene Standards
                </h4>
                <div className="divide-y divide-slate-100 space-y-2">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600">FSSAI Certified Kitchen</span>
                    <span className="font-bold text-slate-900">License #112233440055</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-600">Drinking &amp; Cooking Water</span>
                    <span className="font-bold text-emerald-700">Commercial 5-Stage RO</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-600">Dietary Options</span>
                    <span className="font-bold text-slate-900">Separate Jain &amp; Veg Counters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Button
                onClick={() => {
                  setIsMessRoutineDrawerOpen(false);
                  setActiveTab('mess');
                }}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold gap-2 h-10 shadow-xs cursor-pointer"
              >
                <UtensilsCrossed className="h-4 w-4" />
                <span>View Full Weekly Mess Schedule</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsMessRoutineDrawerOpen(false)}
                className="w-full py-1 text-center text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close Window &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 9. NOTICE BOARD & WARDEN DESK - SIDE DRAWER WINDOW */}
      {/* Smooth Slide-In Window containing all updates & warden actions */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isNoticeBoardDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop Blur Overlay */}
        <div
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isNoticeBoardDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsNoticeBoardDrawerOpen(false)}
        />

        {/* Right Slide-Over Window Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
          <div
            className={`w-full max-w-full sm:max-w-md sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-out ${
              isNoticeBoardDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900">Notice Board &amp; Warden Desk</h3>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                      3 Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {student.pgName} &bull; Resident Announcements
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNoticeBoardDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 hover:rotate-90 transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Close Notice Board Window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Notice 1: RO Filter Servicing */}
              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">RO Water Filter Servicing</span>
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                    Tomorrow (10:00 AM)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Purifier on 3rd floor wing scheduled for quarterly filter overhaul from 10:00 AM - 11:30 AM. Residents may use the 2nd floor corridor dispenser during this downtime.
                </p>
              </div>

              {/* Notice 2: Diwali Vacation Leave Form */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">Diwali Vacation Leave Form</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Admin Office
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Students traveling home for Diwali must register their out-station travel dates and parent acknowledgment at the warden desk before 25th October for mess rebate.
                </p>
              </div>

              {/* Notice 3: 24/7 Reading Hall Open */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">24/7 Reading Hall Open</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Active &bull; 1st Floor
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Common study library on 1st floor available all night during semester midterms. Air conditioning, high-speed Wi-Fi, and individual charging sockets available.
                </p>
              </div>

              {/* Notice 4: Night Turnstile Safety */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">Night Entry &amp; Turnstile Discipline</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Curfew 10:30 PM
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Turnstiles lock at 10:30 PM sharp. Any late entry requires prior emergency gate pass generated via PGOS and approved by floor warden.
                </p>
              </div>

              {/* Floor Warden Contact Card */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Assigned Floor Warden
                    </span>
                    <h4 className="text-xs font-black text-slate-900">{student.wardenName}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{student.wardenPhone}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Office Location:</span>
                    <span className="font-bold text-slate-800">Ground Floor Reception Suite #01</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Availability:</span>
                    <span className="font-bold text-emerald-700">24/7 On-Premises Duty</span>
                  </div>
                </div>

                <a
                  href={`tel:${student.wardenPhone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Warden Directly ({student.wardenPhone})</span>
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <a
                href={`tel:${student.wardenPhone}`}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-orange-600" />
                <span>Call Warden Office</span>
              </a>

              <button
                type="button"
                onClick={() => setIsNoticeBoardDrawerOpen(false)}
                className="w-full py-1 text-center text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close Window &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 10. MAINTENANCE TICKETS & HELPDESK - SIDE DRAWER WINDOW */}
      {/* Smooth Slide-In Window containing active tickets & log form */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isTicketsDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop Blur Overlay */}
        <div
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isTicketsDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsTicketsDrawerOpen(false)}
        />

        {/* Right Slide-Over Window Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
          <div
            className={`w-full max-w-full sm:max-w-md sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-out ${
              isTicketsDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900">Maintenance &amp; Helpdesk</h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200">
                      {complaintsList.length} Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Room 304 &bull; 4-Hour Rapid Response SLA
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTicketsDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 hover:rotate-90 transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Close Helpdesk Window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Active Tickets List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active &amp; Past Tickets
                  </h4>
                  <span className="text-[11px] text-slate-500">{complaintsList.length} Total</span>
                </div>

                {complaintsList.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5 text-xs shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.category}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold bg-orange-100 text-orange-800">
                          {c.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.title}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {c.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Priority: {c.priority}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Issue Logger Form Inside Drawer */}
              <form onSubmit={handleLogComplaint} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/30 space-y-3">
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-blue-600" />
                    Log New Complaint or Repair
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned immediately to hostel maintenance staff.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Issue Category
                  </label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Wi-Fi & Internet">Wi-Fi &amp; Internet</option>
                    <option value="Electrical & AC">Electrical &amp; AC</option>
                    <option value="Plumbing & Washroom">Plumbing &amp; Washroom</option>
                    <option value="Carpentry / Furniture">Carpentry &amp; Furniture</option>
                    <option value="Housekeeping / Cleaning">Housekeeping &amp; Cleaning</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Describe The Issue
                  </label>
                  <textarea
                    rows={2}
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="E.g. Hot water pressure low in bathroom..."
                    className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold h-9 shadow-xs cursor-pointer"
                >
                  Submit Ticket &amp; Notify Staff
                </Button>
              </form>

              {/* SLA Guarantee Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Service Level Commitment
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Urgent Electrical / Plumbing</span>
                  <span className="font-bold text-orange-600">Under 2 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">General Housekeeping</span>
                  <span className="font-bold text-slate-900">Same Day (By 5 PM)</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Button
                onClick={() => {
                  setIsTicketsDrawerOpen(false);
                  setActiveTab('complaints');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 h-10 shadow-xs cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>Go to Dedicated Helpdesk Tab</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsTicketsDrawerOpen(false)}
                className="w-full py-1 text-center text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close Window &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Modal Simulator */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsPayModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-10">
            <h3 className="text-base font-bold text-slate-900 mb-1">Pay Monthly Rent via UPI</h3>
            <p className="text-xs text-slate-500 mb-4">
              Instant zero-brokerage settlement to {student.pgName} Bank Escrow.
            </p>

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center mb-4">
              <span className="text-xs font-semibold text-orange-950">Current Outstanding</span>
              <p className="text-2xl font-black text-orange-600 mt-0.5">₹0.00 (Fully Settled)</p>
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">Next Cycle: ₹9,500 due 05 Nov 2026</span>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => {
                  toast.success('Simulated Advance Rent Payment Received! Digital Receipt Generated.');
                  setIsPayModalOpen(false);
                }}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
              >
                Simulate Advance Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsPayModalOpen(false)}
                className="w-full text-xs text-slate-600 border-slate-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. STUDENT RESIDENT STICKY MOBILE BOTTOM BAR */}
      {/* Fast 1-Tap Thumb Navigation for Residents on Phones (OLX-style) */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 items-center justify-items-center text-[10px] font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform cursor-pointer ${
              activeTab === 'overview' ? 'text-orange-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>Desk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('mess');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform cursor-pointer ${
              activeTab === 'mess' ? 'text-orange-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="h-5 w-5" />
            <span>Mess</span>
          </button>

          {/* Central Highlighted Button: Instant Turnstile Gate Pass QR */}
          <button
            type="button"
            onClick={() => openDrawerWithTab('gatepass')}
            className="-mt-5 flex flex-col items-center active:scale-95 transition-transform cursor-pointer"
            title="Open Turnstile Gate Pass QR"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-white">
              <QrCode className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900 mt-0.5">QR Pass</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('complaints');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform cursor-pointer ${
              activeTab === 'complaints' ? 'text-orange-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <Wrench className="h-5 w-5" />
            <span>Helpdesk</span>
          </button>

          <button
            type="button"
            onClick={() => openDrawerWithTab('student')}
            className="flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform hover:text-slate-900 cursor-pointer"
          >
            <div className="relative">
              <User className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <span>Passport</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
