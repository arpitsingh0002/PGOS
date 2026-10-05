'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Package,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Phone,
  MessageCircle,
  Check,
  Filter,
  ArrowLeft,
  Calendar,
  Building2,
  Sparkles,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  QrCode,
  MapPin,
  ChevronRight,
  Send,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabItem } from '@/components/ui/tabs';
import { usePGStore } from '@/lib/store';
import { formatPhone } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function StaffTiffinManagementPage() {
  const {
    tiffinOrders,
    todayTiffins,
    totalTiffinsOptedToday,
    tiffinsByCollege,
    pendingTiffinReturns,
    verifyReturnTiffin,
    staff,
  } = usePGStore();

  const [activeTab, setActiveTab] = React.useState<string>('college-batches');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedStaff, setSelectedStaff] = React.useState<string>('Ramesh Kumar (Mess Incharge)');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = React.useState<string>('all');
  const [recentlyVerified, setRecentlyVerified] = React.useState<
    Array<{ id: string; studentName: string; roomNumber: string; college: string; time: string }>
  >([]);

  // Format today's date
  const todayFormatted = React.useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  // Filtered pending returns
  const filteredPendingReturns = React.useMemo(() => {
    return pendingTiffinReturns.filter((order) => {
      const matchesSearch =
        order.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.room_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.college_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.phone && order.phone.includes(searchQuery));
      const matchesCollege =
        selectedCollegeFilter === 'all' || order.college_name === selectedCollegeFilter;
      return matchesSearch && matchesCollege;
    });
  }, [pendingTiffinReturns, searchQuery, selectedCollegeFilter]);

  // Handle Verify Return: Automatically clears/deletes data from pending queue
  const handleVerifyReturn = async (orderId: string, studentName: string, room: string, college: string) => {
    try {
      await verifyReturnTiffin(orderId, selectedStaff);
      // Track in local session log
      setRecentlyVerified((prev) => [
        {
          id: orderId,
          studentName,
          roomNumber: room,
          college,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.slice(0, 9), // keep last 10
      ]);

      toast.success(
        `🍱 Tiffin box for ${studentName} (Room ${room}) verified & cleared! Container returned.`,
        {
          description: `Verified by ${selectedStaff}. Record removed from pending list.`,
        }
      );
    } catch {
      toast.error('Failed to verify tiffin return. Please try again.');
    }
  };

  // WhatsApp reminder generator for overdue containers
  const sendWhatsAppReminder = (phone: string, studentName: string, room: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(
      `Hello ${studentName} (Room ${room}), this is a reminder from Royal Palms PG Mess. Our records show you haven't returned your lunch tiffin container. Please return the clean, washed container to the dining counter before 8:30 PM so staff can clear your entry. Thank you!`
    );
    window.open(`https://wa.me/${fullPhone}?text=${message}`, '_blank');
  };

  const tabs: TabItem[] = [
    {
      id: 'college-batches',
      label: 'College-Wise Packing Batches',
      count: tiffinsByCollege.length,
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      id: 'evening-returns',
      label: 'Evening Return Verification',
      count: pendingTiffinReturns.length,
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      id: 'pending-tracker',
      label: 'Unreturned Box Tracker',
      count: pendingTiffinReturns.length,
      icon: <AlertTriangle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/mess"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Mess Overview
            </Link>
            <span className="text-slate-600">&bull;</span>
            <Badge variant="success" className="text-[10px] gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Operations
            </Badge>
            <span className="text-slate-600">&bull;</span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 font-semibold gap-1">
              <ShieldCheck className="h-3 w-3" /> Exclusive Staff Verification Portal
            </Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            Student Daily Tiffin Hub & Box Return
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Route packaging categorized by student college (opt-in closes 9:00 AM) &bull; Evening container return verification &amp; auto-clear (staff only)
          </p>
        </div>

        {/* Date and Staff Selector */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold text-white">{todayFormatted}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Ramesh Kumar (Mess Incharge)" className="bg-slate-900">
                Ramesh (Mess Incharge)
              </option>
              <option value="Sunita Devi (Head Cook)" className="bg-slate-900">
                Sunita Devi (Cook)
              </option>
              <option value="Suresh Patil (Caretaker)" className="bg-slate-900">
                Suresh (Caretaker)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Opted Today */}
        <Card className="glass-card p-4 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">Total Opted Today</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalTiffinsOptedToday}</span>
            <span className="text-xs text-slate-400">Packed Lunches</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">Ready for campus dispatch</p>
        </Card>

        {/* Colleges Covered */}
        <Card className="glass-card p-4 border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300">Colleges Covered</span>
            <div className="h-8 w-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{tiffinsByCollege.length}</span>
            <span className="text-xs text-slate-400">Institutions</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Categorized batch routes</p>
        </Card>

        {/* Pending Box Returns */}
        <Card
          className={`glass-card p-4 border-amber-500/30 bg-gradient-to-br ${
            pendingTiffinReturns.length > 0 ? 'from-amber-950/40 to-slate-900' : 'from-slate-900 to-slate-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">Pending Box Returns</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">
              {pendingTiffinReturns.length}
            </span>
            <span className="text-xs text-slate-400">Boxes Out</span>
          </div>
          <p className="text-[10px] text-amber-400/90 mt-1">Due before 08:30 PM evening</p>
        </Card>

        {/* Verified & Cleared */}
        <Card className="glass-card p-4 border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Verified & Cleared</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">
              {recentlyVerified.length}
            </span>
            <span className="text-xs text-slate-400">Boxes Cleared</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Auto-removed upon verification</p>
        </Card>
      </div>

      {/* Operations Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: COLLEGE-WISE PACKING BATCHES */}
      {activeTab === 'college-batches' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Kitchen Batching by Student College</h3>
                <p className="text-xs text-slate-400">
                  Kitchen packs and groups boxes by college routes for orderly morning departure
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Printing college packaging slips for kitchen chef...')}
              className="text-xs gap-1 border-slate-700"
            >
              <Package className="h-3.5 w-3.5" /> Print Batch Labels
            </Button>
          </div>

          {tiffinsByCollege.length === 0 ? (
            <Card className="glass-card p-8 text-center space-y-2">
              <UtensilsCrossed className="h-10 w-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Tiffin Orders for Today</h3>
              <p className="text-xs text-slate-400">
                Residents haven&apos;t opted for packed tiffin yet. Orders appear here live as
                students submit from their mobile app.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {tiffinsByCollege.map((group, idx) => (
                <Card
                  key={group.college}
                  className="glass-card overflow-hidden border-slate-800 hover:border-indigo-500/40 transition-colors"
                >
                  {/* College Header */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          {group.college}
                          <Badge variant="default" className="text-[10px]">
                            {group.count} {group.count === 1 ? 'Student' : 'Students'}
                          </Badge>
                        </h4>
                        <p className="text-xs text-slate-400">
                          College Route Batch &bull; Packed for lunchtime campus delivery / early departure
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Slots:</span>
                      {Array.from(new Set(group.orders.map((o) => o.delivery_time))).map((time) => (
                        <span
                          key={time}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-mono text-emerald-300 font-semibold border border-slate-700"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Student Orders in this College */}
                  <div className="divide-y divide-slate-850">
                    {group.orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs mt-0.5">
                            {order.tenant_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">
                                {order.tenant_name}
                              </span>
                              <Badge variant="outline" className="text-[10px] font-mono">
                                Room {order.room_number} &bull; {order.bed_number || 'Bed A'}
                              </Badge>
                              {order.phone && (
                                <a
                                  href={`tel:${order.phone}`}
                                  className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-0.5"
                                >
                                  <Phone className="h-3 w-3" /> {formatPhone(order.phone)}
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1 text-amber-300 font-medium">
                                <Clock className="h-3.5 w-3.5" /> Slot: {order.delivery_time}
                              </span>
                              <span>&bull;</span>
                              <span className="capitalize">{order.meal_type} Box</span>
                              {order.notes && (
                                <>
                                  <span>&bull;</span>
                                  <span className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 text-[10px]">
                                    Note: {order.notes}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status / Quick Action */}
                        <div className="flex items-center gap-2 sm:self-center">
                          <Badge
                            variant={
                              order.status === 'dispatched'
                                ? 'success'
                                : order.status === 'prepared'
                                ? 'warning'
                                : 'default'
                            }
                            className="text-[10px] uppercase font-mono"
                          >
                            {order.status === 'requested' ? 'In Queue' : order.status}
                          </Badge>

                          <Button
                            size="sm"
                            onClick={() =>
                              handleVerifyReturn(
                                order.id,
                                order.tenant_name,
                                order.room_number || '101',
                                order.college_name
                              )
                            }
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <Check className="h-3.5 w-3.5" /> Return Box
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EVENING RETURN VERIFICATION */}
      {activeTab === 'evening-returns' && (
        <div className="space-y-4">
          {/* Instructions banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Evening Return Verification Mode</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  As residents return their clean tiffin container to the kitchen counter, click{' '}
                  <strong className="text-emerald-400 font-semibold">&ldquo;Verify Return &amp; Clear Box&rdquo;</strong>.
                  The resident&apos;s record will <strong>automatically delete</strong> from the active
                  pending queue. Students who have not returned remain visible until verified.
                </p>
              </div>
            </div>

            <Badge variant="success" className="whitespace-nowrap">
              Auto-Clear Active
            </Badge>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, room 101, college, or phone..."
                className="pl-9 h-10 text-xs bg-slate-900/80 border-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCollegeFilter}
                onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none"
              >
                <option value="all">All Colleges ({pendingTiffinReturns.length})</option>
                {tiffinsByCollege.map((c) => (
                  <option key={c.college} value={c.college}>
                    {c.college} ({c.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List of Pending Return Boxes */}
          {filteredPendingReturns.length === 0 ? (
            <Card className="glass-card p-10 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">All Tiffin Boxes Returned & Verified!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Zero outstanding lunch containers. All residents have returned their boxes and their
                data has been cleared from the queue.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredPendingReturns.map((order) => (
                <Card
                  key={order.id}
                  className="glass-card p-4 border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{order.tenant_name}</h4>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          Room {order.room_number} &bull; {order.bed_number || 'Bed A'}
                        </Badge>
                      </div>
                      <p className="text-xs text-indigo-300 flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{order.college_name}</span>
                      </p>
                    </div>

                    <Badge variant="warning" className="text-[10px] uppercase font-mono">
                      Box Out
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Slot: {order.delivery_time}</span>
                    </div>

                    {order.phone && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatPhone(order.phone)}
                      </span>
                    )}
                  </div>

                  {order.notes && (
                    <p className="text-[11px] text-slate-400 italic">
                      Special Note: &ldquo;{order.notes}&rdquo;
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center justify-between gap-2">
                    {order.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          sendWhatsAppReminder(order.phone || '', order.tenant_name, order.room_number || '101')
                        }
                        className="text-xs gap-1 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp Ping
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={() =>
                        handleVerifyReturn(
                          order.id,
                          order.tenant_name,
                          order.room_number || '101',
                          order.college_name
                        )
                      }
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Check className="h-4 w-4" /> Verify Return &amp; Clear
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Session Activity Log: Recently Verified & Cleared */}
          {recentlyVerified.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recently Verified Boxes (This Session)
                </h4>
                <span className="text-[10px] text-emerald-400">
                  {recentlyVerified.length} cleared
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {recentlyVerified.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold text-white">{item.studentName}</span>
                      <span className="text-slate-400 text-[11px]">(Room {item.roomNumber})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: UNRETURNED BOX TRACKER (PERSISTENT MONITOR) */}
      {activeTab === 'pending-tracker' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">Outstanding Container Retention Monitor</h3>
              <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                As per policy, students who opted for lunch but have not returned the tiffin box{' '}
                <strong>remain flagged here indefinitely</strong> until they physically submit the container
                and staff verifies it. Missing containers cause dinner prep shortages.
              </p>
            </div>
          </div>

          {pendingTiffinReturns.length === 0 ? (
            <Card className="glass-card p-10 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">All Kitchen Containers Accounted For</h3>
              <p className="text-xs text-slate-400">
                100% of tiffin boxes have been returned and cleared from the system.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  {pendingTiffinReturns.length} Pending Unreturned Containers
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    pendingTiffinReturns.forEach((order) => {
                      if (order.phone) {
                        sendWhatsAppReminder(order.phone, order.tenant_name, order.room_number || '101');
                      }
                    });
                    toast.success('Broadcasted WhatsApp reminders to all pending students!');
                  }}
                  className="text-xs gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                >
                  <Send className="h-3.5 w-3.5" /> Send WhatsApp to All Overdue
                </Button>
              </div>

              <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 glass-card overflow-hidden">
                {pendingTiffinReturns.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{order.tenant_name}</span>
                        <Badge variant="warning" className="text-[10px]">
                          Container Missing
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          Room {order.room_number || '101'} &bull; {order.bed_number || 'Bed A'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="text-indigo-300 flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" /> {order.college_name}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Clock className="h-3.5 w-3.5" /> Dispatched: {order.delivery_time}
                        </span>
                        {order.phone && (
                          <>
                            <span>&bull;</span>
                            <span className="font-mono">{formatPhone(order.phone)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            sendWhatsAppReminder(order.phone || '', order.tenant_name, order.room_number || '101')
                          }
                          className="text-xs gap-1 text-slate-300 border-slate-700 hover:border-emerald-500/40 hover:text-emerald-400"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> Ping
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={() =>
                          handleVerifyReturn(
                            order.id,
                            order.tenant_name,
                            order.room_number || '101',
                            order.college_name
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1 shadow-md shadow-emerald-600/20"
                      >
                        <Check className="h-3.5 w-3.5" /> Verify &amp; Clear Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
