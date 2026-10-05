'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Shield,
  UserCheck,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Phone,
  DoorOpen,
  DollarSign,
  Plus,
  Send,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
  QrCode,
  LogOut,
  LogIn,
  Search,
  Wrench,
  CheckSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatPhone } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function ManagerDashboardPage() {
  const {
    properties,
    tenants,
    rooms,
    beds,
    staff,
    tasks,
    complaints,
    payments,
    pendingTiffinReturns,
  } = usePGStore();

  const [selectedBranchId, setSelectedBranchId] = React.useState('prop-1');
  const activeBranch = properties.find((p) => p.id === selectedBranchId) || properties[0];

  // Daily Shift Checklist State
  const [checklist, setChecklist] = React.useState([
    { id: 'c1', task: 'Morning water pump & overhead tank inspection', time: '07:30 AM', done: true },
    { id: 'c2', task: 'Audit mess breakfast buffet hygiene & head count', time: '08:30 AM', done: true },
    { id: 'c3', task: 'Verify student tiffin box departure batches', time: '09:00 AM', done: true },
    { id: 'c4', task: 'Common area & washroom sanitization round with Lata Devi', time: '11:00 AM', done: false },
    { id: 'c5', task: 'Log physical cash rent received into payments ledger', time: '03:00 PM', done: false },
    { id: 'c6', task: 'Evening mess tiffin container return audit counter', time: '08:30 PM', done: false },
    { id: 'c7', task: 'Main gate night lock & night guard biometric sign-in', time: '10:30 PM', done: false },
  ]);

  // Visitor & Walk-in Lead Form
  const [visitorName, setVisitorName] = React.useState('');
  const [visitorPhone, setVisitorPhone] = React.useState('');
  const [visitingRoom, setVisitingRoom] = React.useState('101');
  const [purpose, setPurpose] = React.useState('Room Inquiry / Visit');
  const [recentVisitors, setRecentVisitors] = React.useState([
    { id: 'v1', name: 'Manish Rawat', phone: '9845012345', room: '101 (Aarav Sharma)', time: '10:15 AM', status: 'Inside Premises' },
    { id: 'v2', name: 'Kavita Hegde (Parent)', phone: '9740112288', room: '201 (Pooja Hegde)', time: '11:30 AM', status: 'Checked Out' },
  ]);

  // Branch Specific Metrics
  const branchTenants = tenants.filter((t) => t.property_id === activeBranch.id && t.status === 'active');
  const branchRooms = rooms.filter((r) => r.property_id === activeBranch.id);
  const branchRoomIds = new Set(branchRooms.map((r) => r.id));
  const branchBeds = beds.filter((b) => b.property_id === activeBranch.id || branchRoomIds.has(b.room_id));
  const vacantBeds = branchBeds.filter((b) => b.status === 'available');
  const occupiedBeds = branchBeds.filter((b) => b.status === 'occupied');
  const occupancyPct = branchBeds.length > 0 ? Math.round((occupiedBeds.length / branchBeds.length) * 100) : 80;

  // Active Complaints for this property
  const branchComplaints = complaints.filter(
    (c) => c.property_id === activeBranch.id && c.status !== 'resolved'
  );

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
    toast.success('Duty checklist updated!');
  };

  // Log new visitor
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) {
      toast.error('Please enter visitor name and phone number');
      return;
    }
    const newEntry = {
      id: `v-${Date.now()}`,
      name: visitorName.trim(),
      phone: visitorPhone.trim(),
      room: visitingRoom,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Inside Premises',
    };
    setRecentVisitors([newEntry, ...recentVisitors]);
    setVisitorName('');
    setVisitorPhone('');
    toast.success(`Visitor pass generated for ${newEntry.name}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Persona Card */}
      <div className="p-6 rounded-3xl glass-card border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Property Manager Operations Command
                </h1>
                <Badge variant="success" className="text-[10px] gap-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Shift: Active On-Duty
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>Manager: <strong className="text-white">Suresh Gowda</strong></span>
                <span>&bull;</span>
                <span className="text-indigo-300 font-medium">Duty Window: 08:00 AM &ndash; 08:00 PM</span>
              </p>
            </div>
          </div>

          {/* Branch Switcher */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Operations Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Branch Occupancy</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{occupancyPct}%</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {branchTenants.length} Active Residents &bull; {vacantBeds.length} Vacant Beds
          </span>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Open Breakdowns</span>
            <Wrench className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-1">{branchComplaints.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {branchComplaints.filter((c) => c.priority === 'urgent' || c.priority === 'high').length} High Priority
          </span>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Tiffins Pending Return</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{pendingTiffinReturns.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Evening kitchen return deadline 8:30 PM
          </span>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Staff On Duty</span>
            <UserCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{staff.length}</p>
          <span className="text-[11px] text-emerald-400 mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Full attendance today
          </span>
        </Card>
      </div>

      {/* Main Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Manager Daily Shift Checklist (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Shift Checklist */}
          <Card className="glass-card p-5 border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Daily Manager Standard Operating Procedures (SOP)</h3>
              </div>
              <span className="text-[11px] text-indigo-300 font-mono">
                {checklist.filter((c) => c.done).length} / {checklist.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.done
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                        item.done
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {item.done && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.done ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {item.task}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-3 w-3 text-slate-500" /> {item.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Staff Roster & Task Assignment */}
          <Card className="glass-card p-5 border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Subordinate Staff Roster &amp; Active Tasks</h3>
              </div>
              <Link href="/tasks">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-slate-700 text-slate-300">
                  Full Kanban <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {staff.map((s) => {
                const assignedTasks = tasks.filter((t) => t.assigned_to === s.id && t.status !== 'done');
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{s.name}</h4>
                        <span className="text-[10px] text-indigo-400 uppercase font-mono font-semibold">
                          {s.role}
                        </span>
                      </div>
                      <Badge variant="success" className="text-[9px]">
                        On Duty
                      </Badge>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <a href={`tel:${s.phone}`} className="flex items-center gap-1 hover:text-white">
                        <Phone className="h-3 w-3 text-emerald-400" /> {formatPhone(s.phone)}
                      </a>
                      <span>{assignedTasks.length} pending tasks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Gate Entry & Visitor Log (1 Col) */}
        <div className="space-y-6">
          {/* Visitor Pass Generation Form */}
          <Card className="glass-card p-5 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <DoorOpen className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Instant Visitor Entry Log</h3>
            </div>

            <form onSubmit={handleAddVisitor} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Visitor Full Name
                </label>
                <Input
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="h-8 text-xs bg-slate-900 border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Mobile Number
                </label>
                <Input
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="e.g. 9845012345"
                  className="h-8 text-xs bg-slate-900 border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Visiting Resident / Room
                </label>
                <select
                  value={visitingRoom}
                  onChange={(e) => setVisitingRoom(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="101 (Aarav Sharma)">Room 101 — Aarav Sharma</option>
                  <option value="102 (Sneha Rao)">Room 102 — Sneha Rao</option>
                  <option value="201 (Pooja Hegde)">Room 201 — Pooja Hegde</option>
                  <option value="General Inquiry (Manager Office)">General Inquiry — Manager Office</option>
                </select>
              </div>

              <Button
                type="submit"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1 shadow-md shadow-emerald-600/20"
              >
                <Plus className="h-3.5 w-3.5" /> Log Visitor Entry
              </Button>
            </form>
          </Card>

          {/* Today's Gate Log */}
          <Card className="glass-card p-5 border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Today&apos;s Gate Log ({recentVisitors.length})
            </h4>

            <div className="space-y-2.5">
              {recentVisitors.map((v) => (
                <div
                  key={v.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-white">{v.name}</strong>
                    <Badge variant={v.status === 'Inside Premises' ? 'warning' : 'outline'} className="text-[9px]">
                      {v.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{v.room}</span>
                    <span className="font-mono">{v.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Direct Jump Links */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link href="/mess/tiffin">
              <Button size="sm" variant="outline" className="w-full h-9 border-slate-700 text-slate-300 text-xs gap-1">
                Tiffin Hub &rarr;
              </Button>
            </Link>
            <Link href="/complaints">
              <Button size="sm" variant="outline" className="w-full h-9 border-slate-700 text-slate-300 text-xs gap-1">
                Complaints &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
