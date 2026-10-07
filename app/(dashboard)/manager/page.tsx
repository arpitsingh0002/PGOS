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
  Package,
  Layers,
  GraduationCap,
  CreditCard,
  ClipboardList,
  AlertCircle,
  Eye,
  RefreshCw,
  MessageSquare,
  FileText,
  Boxes,
  Minus,
  XCircle,
  UserX,
  PhoneCall,
  Flame,
  Truck,
  ShoppingCart,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatPhone, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  StaffAttendanceStatus,
  InventoryCategory,
  ComplaintPriority,
  ComplaintStatus,
  InventoryNeedPriority,
  InventoryRequestStatus,
} from '@/types/database';

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
    staffAttendance,
    markStaffAttendance,
    inventory,
    updateInventoryStock,
    addInventoryItem,
    inventoryRequests,
    addInventoryRequest,
    updateInventoryRequestStatus,
    addPayment,
    updateComplaintStatus,
    addComplaint,
    addStaff,
  } = usePGStore();

  const [selectedBranchId, setSelectedBranchId] = React.useState('prop-1');
  const activeBranch = properties.find((p) => p.id === selectedBranchId) || properties[0] || {
    id: 'prop-1',
    name: 'Royal Palms Luxury Living',
    city: 'Bengaluru',
  };

  // Active navigation tab within Manager Portal
  const [activeTab, setActiveTab] = React.useState<
    'attendance' | 'complaints' | 'inventory' | 'students' | 'rent' | 'sop'
  >('inventory');

  // Search queries for various tabs
  const [studentSearch, setStudentSearch] = React.useState('');
  const [inventorySearch, setInventorySearch] = React.useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = React.useState<string>('all');
  const [complaintStatusFilter, setComplaintStatusFilter] = React.useState<string>('all');
  const [inventorySubTab, setInventorySubTab] = React.useState<'required' | 'stock'>('required');
  const [reqPriorityFilter, setReqPriorityFilter] = React.useState<'all' | 'urgent' | 'normal'>('all');

  // Quick modals / forms states
  const [showAddStaffModal, setShowAddStaffModal] = React.useState(false);
  const [newStaffName, setNewStaffName] = React.useState('');
  const [newStaffRole, setNewStaffRole] = React.useState<'cleaner' | 'security' | 'cook' | 'maintenance' | 'caretaker'>('cleaner');
  const [newStaffPhone, setNewStaffPhone] = React.useState('');
  const [newStaffSalary, setNewStaffSalary] = React.useState('15000');

  // New Complaint modal state
  const [showNewComplaintModal, setShowNewComplaintModal] = React.useState(false);
  const [compTitle, setCompTitle] = React.useState('');
  const [compTenantId, setCompTenantId] = React.useState('');
  const [compCategory, setCompCategory] = React.useState('Plumbing');
  const [compPriority, setCompPriority] = React.useState<ComplaintPriority>('medium');
  const [compDesc, setCompDesc] = React.useState('');

  // Collect Rent modal state
  const [showCollectRentModal, setShowCollectRentModal] = React.useState(false);
  const [rentTenantId, setRentTenantId] = React.useState('');
  const [rentAmount, setRentAmount] = React.useState('');
  const [rentPaymentMode, setRentPaymentMode] = React.useState('UPI');
  const [rentTxnRef, setRentTxnRef] = React.useState('');

  // New Inventory Item modal state
  const [showAddInventoryModal, setShowAddInventoryModal] = React.useState(false);
  const [invName, setInvName] = React.useState('');
  const [invCategory, setInvCategory] = React.useState<InventoryCategory>('cleaning');
  const [invQty, setInvQty] = React.useState('10');
  const [invUnit, setInvUnit] = React.useState('pcs');
  const [invMinThreshold, setInvMinThreshold] = React.useState('5');
  const [invCost, setInvCost] = React.useState('150');

  // Required Inventory Requisition Modal state
  const [showAddRequestModal, setShowAddRequestModal] = React.useState(false);
  const [reqItemName, setReqItemName] = React.useState('');
  const [reqCategory, setReqCategory] = React.useState<InventoryCategory>('kitchen');
  const [reqQty, setReqQty] = React.useState('2');
  const [reqUnit, setReqUnit] = React.useState('cylinders');
  const [reqPriority, setReqPriority] = React.useState<InventoryNeedPriority>('urgent');
  const [reqReason, setReqReason] = React.useState('');
  const [reqEstimatedCost, setReqEstimatedCost] = React.useState('1800');

  // Resolution note dialog
  const [resolvingComplaintId, setResolvingComplaintId] = React.useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = React.useState('');

  // Daily Shift Checklist State
  const [checklist, setChecklist] = React.useState([
    { id: 'c1', task: 'Morning water pump & overhead tank inspection', time: '07:30 AM', done: true },
    { id: 'c2', task: 'Audit mess breakfast buffet hygiene & head count', time: '08:30 AM', done: true },
    { id: 'c3', task: 'Verify student tiffin box departure batches', time: '09:00 AM', done: true },
    { id: 'c4', task: 'Common area & washroom sanitization round with cleaning crew', time: '11:00 AM', done: false },
    { id: 'c5', task: 'Log physical cash rent received into owner payment ledger', time: '03:00 PM', done: false },
    { id: 'c6', task: 'Evening mess tiffin container return audit counter', time: '08:30 PM', done: false },
    { id: 'c7', task: 'Main gate night lock & night guard biometric sign-in', time: '10:30 PM', done: false },
  ]);

  // Visitor & Walk-in Lead Form
  const [visitorName, setVisitorName] = React.useState('');
  const [visitorPhone, setVisitorPhone] = React.useState('');
  const [visitingRoom, setVisitingRoom] = React.useState('101');
  const [recentVisitors, setRecentVisitors] = React.useState([
    { id: 'v1', name: 'Manish Rawat', phone: '9845012345', room: '101 (Aarav Sharma)', time: '10:15 AM', status: 'Inside Premises' },
    { id: 'v2', name: 'Kavita Hegde (Parent)', phone: '9740112288', room: '201 (Pooja Hegde)', time: '11:30 AM', status: 'Checked Out' },
  ]);

  // -------------------------------------------------------------
  // BRANCH COMPUTED METRICS
  // -------------------------------------------------------------
  const branchTenants = tenants.filter(
    (t) => (t.property_id === activeBranch.id || !t.property_id) && t.status === 'active'
  );
  const branchRooms = rooms.filter((r) => r.property_id === activeBranch.id);
  const branchRoomIds = new Set(branchRooms.map((r) => r.id));
  const branchBeds = beds.filter((b) => b.property_id === activeBranch.id || branchRoomIds.has(b.room_id));
  const vacantBeds = branchBeds.filter((b) => b.status === 'available');
  const occupiedBeds = branchBeds.filter((b) => b.status === 'occupied');
  const occupancyPct = branchBeds.length > 0 ? Math.round((occupiedBeds.length / branchBeds.length) * 100) : 80;

  // Branch Complaints
  const branchComplaints = complaints.filter(
    (c) => c.property_id === activeBranch.id || !c.property_id
  );
  const openComplaints = branchComplaints.filter((c) => c.status !== 'resolved');

  // Branch Staff
  const branchStaff = staff.filter(
    (s) => s.property_id === activeBranch.id || !s.property_id
  );

  // Today Staff Attendance for this branch
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendanceRecords = staffAttendance.filter(
    (a) => a.date === todayStr && (a.property_id === activeBranch.id || !a.property_id)
  );
  const branchStaffWithAttendance = branchStaff.map((member) => {
    const record = todayAttendanceRecords.find((a) => a.staff_id === member.id);
    const status: StaffAttendanceStatus = record?.status || 'present';
    return { member, record, status };
  });
  const presentCount = branchStaffWithAttendance.filter((s) => s.status === 'present').length;
  const absentCount = branchStaffWithAttendance.filter((s) => s.status === 'absent' || s.status === 'leave').length;
  const totalStaffCount = branchStaff.length;

  // Branch Inventory
  const branchInventory = (inventory || []).filter(
    (item) => item.property_id === activeBranch.id || !item.property_id
  );
  const lowStockItems = branchInventory.filter((item) => item.quantity <= item.min_threshold);

  // Branch Inventory Requests (Required Supplies)
  const branchRequests = (inventoryRequests || []).filter(
    (r) => r.property_id === activeBranch.id || !r.property_id
  );
  const urgentRequests = branchRequests.filter(
    (r) => r.priority === 'urgent' && r.status !== 'procured'
  );
  const pendingRequests = branchRequests.filter((r) => r.status === 'pending');

  // Branch Rent Overview
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const branchPayments = payments.filter(
    (p) => p.property_id === activeBranch.id || !p.property_id
  );
  const branchPaidPayments = branchPayments.filter(
    (p) => p.status === 'paid' && p.payment_type === 'rent'
  );
  const totalRentCollected = branchPaidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpectedRent = branchTenants.reduce((sum, t) => sum + (t.monthly_rent || 8500), 0);
  const pendingRentAmount = Math.max(0, totalExpectedRent - totalRentCollected);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
    toast.success('Duty SOP checklist item updated!');
  };

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) {
      toast.error('Please enter visitor name and phone number');
      return;
    }
    const newV = {
      id: `v-${Date.now()}`,
      name: visitorName,
      phone: visitorPhone,
      room: visitingRoom,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Inside Premises',
    };
    setRecentVisitors([newV, ...recentVisitors]);
    setVisitorName('');
    setVisitorPhone('');
    toast.success(`Visitor pass issued for ${newV.name}`);
  };

  const handleCheckoutVisitor = (id: string) => {
    setRecentVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Checked Out' } : v))
    );
    toast.info('Visitor marked as checked out at the security gate.');
  };

  // Staff Attendance Status Update
  const handleAttendanceChange = (staffId: string, status: StaffAttendanceStatus) => {
    markStaffAttendance(staffId, activeBranch.id, status);
    toast.success(`Attendance updated to "${status.toUpperCase()}"! Synced to Owner HQ.`);
  };

  // Complaint Status Change
  const handleComplaintStatusChange = (id: string, newStatus: ComplaintStatus) => {
    if (newStatus === 'resolved') {
      setResolvingComplaintId(id);
      setResolutionNote('Fixed and verified on-site by property manager.');
    } else {
      updateComplaintStatus(id, newStatus);
      toast.success(`Complaint status set to ${newStatus}. Synced with Owner.`);
    }
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaintId) return;
    updateComplaintStatus(resolvingComplaintId, 'resolved', resolutionNote);
    toast.success('Complaint resolved and closed in database!');
    setResolvingComplaintId(null);
    setResolutionNote('');
  };

  // Create Complaint
  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim()) {
      toast.error('Please enter a complaint title');
      return;
    }
    const selectedTenant = branchTenants.find((t) => t.id === compTenantId) || branchTenants[0];
    addComplaint({
      property_id: activeBranch.id,
      tenant_id: selectedTenant?.id || 'ten-1',
      title: compTitle,
      description: compDesc || 'Reported verbally at manager reception desk.',
      category: compCategory,
      priority: compPriority,
      tenant_name: selectedTenant?.full_name || 'Resident',
      room_number: selectedTenant?.room_number || 'Room 101',
    });
    toast.success('New complaint logged! Available to Owner & Maintenance.');
    setShowNewComplaintModal(false);
    setCompTitle('');
    setCompDesc('');
  };

  // Record Rent Payment
  const handleRecordRentPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(rentAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }
    const tenantObj = branchTenants.find((t) => t.id === rentTenantId) || branchTenants[0];
    addPayment({
      property_id: activeBranch.id,
      tenant_id: tenantObj?.id || 'ten-1',
      amount: amt,
      payment_type: 'rent',
      for_month: currentMonth,
      payment_date: todayStr,
      status: 'paid',
      payment_mode: rentPaymentMode,
      transaction_ref: rentTxnRef || `CASH-${Date.now().toString().slice(-6)}`,
      notes: `Collected in person at manager front desk (${rentPaymentMode})`,
      tenant_name: tenantObj?.full_name || 'Resident',
      room_number: tenantObj?.room_number || 'Room 101',
    });
    toast.success(`Rent of ${formatINR(amt)} collected for ${tenantObj?.full_name}! Owner ledger updated.`);
    setShowCollectRentModal(false);
    setRentAmount('');
    setRentTxnRef('');
  };

  // Add Inventory Item directly to stock
  const handleCreateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim()) {
      toast.error('Please specify an item name');
      return;
    }
    addInventoryItem({
      property_id: activeBranch.id,
      name: invName,
      category: invCategory,
      quantity: parseInt(invQty) || 1,
      unit: invUnit,
      min_threshold: parseInt(invMinThreshold) || 2,
      cost_per_unit: parseFloat(invCost) || 0,
      notes: 'Added from Manager Supplies Desk',
    });
    toast.success(`Added ${invName} to property inventory!`);
    setShowAddInventoryModal(false);
    setInvName('');
  };

  // Add Required Inventory Request (with Priority: Urgent vs Normal)
  const handleCreateInventoryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqItemName.trim()) {
      toast.error('Please specify the required item name');
      return;
    }
    addInventoryRequest({
      property_id: activeBranch.id,
      item_name: reqItemName,
      category: reqCategory,
      quantity: parseInt(reqQty) || 1,
      unit: reqUnit,
      priority: reqPriority,
      requested_by: 'Suresh Gowda (Manager)',
      reason: reqReason || 'Required for property operations',
      estimated_cost: parseFloat(reqEstimatedCost) || undefined,
      property_name: activeBranch.name,
    });
    toast.success(
      `Requisition for ${reqItemName} (${reqPriority.toUpperCase()} PRIORITY) submitted! Visible to Owner.`
    );
    setShowAddRequestModal(false);
    setReqItemName('');
    setReqReason('');
  };

  // Add Staff Member
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) {
      toast.error('Please provide staff name and contact number');
      return;
    }
    addStaff({
      property_id: activeBranch.id,
      name: newStaffName,
      role: newStaffRole,
      phone: newStaffPhone,
      salary: parseFloat(newStaffSalary) || 15000,
      joining_date: todayStr,
      status: 'active',
    });
    toast.success(`${newStaffName} added to branch staff roster! Synced with Owner.`);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffPhone('');
  };

  const completedChecklistCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* -------------------------------------------------------------
          TOP BAR: BRANCH SWITCHER, MANAGER PROFILE & HQ SYNC BANNER
      ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300">
              <Shield className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
              Manager Operations Command Portal
            </h1>
            <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-xs px-2.5 py-0.5 flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              HQ Live Sync: Connected to Owner
            </Badge>
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            Real-time branch control: Staff attendance, complaints resolution, supply inventory & indents, student directory & rent collection.
          </p>
        </div>

        {/* Branch Selector & Active Shift Info */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-bold shadow-xs">
            <Building2 className="h-3.5 w-3.5 text-indigo-700" />
            <span className="text-slate-600 font-semibold">Branch:</span>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent text-slate-950 font-bold outline-none cursor-pointer"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-950">
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-slate-950 shadow-xs">
            <UserCheck className="h-3.5 w-3.5 text-indigo-700" />
            <div>
              <span className="text-slate-950 font-bold">Suresh Gowda</span>
              <span className="text-[11px] text-slate-600 font-semibold ml-1.5">On Duty (08:00 AM - 08:00 PM)</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          KEY OPERATIONAL KPI CARDS
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-white p-3 border-slate-300 shadow-sm hover:border-indigo-400 transition-colors">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-[11px] uppercase tracking-wider">Occupancy</span>
            <Users className="h-3.5 w-3.5 text-indigo-700" />
          </div>
          <div className="text-xl font-black text-slate-950">{occupancyPct}%</div>
          <p className="text-[10px] text-slate-700 font-semibold mt-0.5">{vacantBeds.length} vacant beds ready</p>
        </Card>

        <Card className="bg-white p-3 border-slate-300 shadow-sm hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-[11px] uppercase tracking-wider">Staff Attendance</span>
            <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
          </div>
          <div className="text-xl font-black text-slate-950">
            {presentCount}/{totalStaffCount || 4}
          </div>
          <p className="text-[10px] text-emerald-800 font-bold mt-0.5">
            {absentCount > 0 ? `${absentCount} absent/leave` : '100% on duty today'}
          </p>
        </Card>

        <Card className="bg-white p-3 border-slate-300 shadow-sm hover:border-rose-400 transition-colors">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-[11px] uppercase tracking-wider">Open Complaints</span>
            <Wrench className="h-3.5 w-3.5 text-rose-700" />
          </div>
          <div className="text-xl font-black text-slate-950">{openComplaints.length}</div>
          <p className="text-[10px] text-rose-800 font-bold mt-0.5">
            {openComplaints.filter((c) => c.priority === 'urgent' || c.priority === 'high').length} urgent tickets
          </p>
        </Card>

        {/* Required Inventory KPI with Urgent Alert */}
        <Card className={`p-3 transition-colors bg-white shadow-sm ${
          urgentRequests.length > 0 ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
        }`}>
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-[11px] uppercase tracking-wider">Supplies Requisitions</span>
            <ShoppingCart className={`h-3.5 w-3.5 ${urgentRequests.length > 0 ? 'text-rose-700' : 'text-amber-700'}`} />
          </div>
          <div className="text-xl font-black text-slate-950 flex items-center gap-1.5">
            {branchRequests.length}
            {urgentRequests.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-950 border border-rose-300 animate-pulse">
                {urgentRequests.length} URGENT
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-700 font-semibold mt-0.5">
            {pendingRequests.length} pending owner approval
          </p>
        </Card>

        <Card className="bg-white p-3 border-slate-300 shadow-sm hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-[11px] uppercase tracking-wider">Branch Rent</span>
            <CreditCard className="h-3.5 w-3.5 text-blue-700" />
          </div>
          <div className="text-xl font-black text-slate-950">{formatINR(totalRentCollected)}</div>
          <p className="text-[10px] text-blue-900 font-bold mt-0.5">{formatINR(pendingRentAmount)} pending</p>
        </Card>

        <Card className="bg-white p-3 border-slate-300 shadow-sm hover:border-purple-400 transition-colors">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-[11px] uppercase tracking-wider">Daily SOP</span>
            <CheckSquare className="h-3.5 w-3.5 text-purple-700" />
          </div>
          <div className="text-xl font-black text-slate-950">
            {completedChecklistCount}/{checklist.length}
          </div>
          <p className="text-[10px] text-purple-900 font-bold mt-0.5">
            {Math.round((completedChecklistCount / checklist.length) * 100)}% shift routine completed
          </p>
        </Card>
      </div>

      {/* -------------------------------------------------------------
          PORTAL NAVIGATION TABS
      ------------------------------------------------------------- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-300">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Boxes className="h-4 w-4" />
          Inventory & Supplies
          {urgentRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold text-[10px] animate-pulse">
              {urgentRequests.length} URGENT
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Staff Attendance ({presentCount}/{branchStaff.length || 4})
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'complaints'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Complaints Desk
          {openComplaints.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              {openComplaints.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Student Directory ({branchTenants.length})
        </button>

        <button
          onClick={() => setActiveTab('rent')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'rent'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Rent Management
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'sop'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Daily SOP & Gate Pass
        </button>
      </div>

      {/* -------------------------------------------------------------
          TAB 1: INVENTORY & SUPPLIES (WITH REQUIRED SUPPLIES & NEED PRIORITY)
      ------------------------------------------------------------- */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Sub-Header with Dual Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-indigo-400" />
                  Branch Consumables, Property Supplies & Procurement Requisitions
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Track on-site stock buffers and request required inventory with <strong>Urgent</strong> or <strong>Normal</strong> need priority.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Switch between Required Requisitions and Current Stock */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setInventorySubTab('required')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    inventorySubTab === 'required'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Required Supplies ({branchRequests.length})
                  {urgentRequests.length > 0 && (
                    <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setInventorySubTab('stock')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    inventorySubTab === 'stock'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Boxes className="h-3.5 w-3.5" />
                  Current Stock ({branchInventory.length})
                </button>
              </div>

              {/* Action Button: Add Required Inventory (Priority: Urgent / Normal) */}
              <Button
                size="sm"
                onClick={() => setShowAddRequestModal(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1.5 shadow-md shadow-rose-600/20 font-bold"
              >
                <Plus className="h-3.5 w-3.5" /> Request Required Supplies
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAddInventoryModal(true)}
                className="text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-indigo-400" /> New Stock SKU
              </Button>
            </div>
          </div>

          {/* Urgent Need Emergency Alert Banner if any pending urgent requests */}
          {urgentRequests.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  <Flame className="h-4 w-4 animate-bounce" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white block">
                    {urgentRequests.length} Urgent Inventory Requirement{urgentRequests.length > 1 ? 's' : ''} Active!
                  </span>
                  <span className="text-[11px] text-rose-300/90">
                    Items required urgently for branch operations:{' '}
                    <strong>{urgentRequests.map((r) => `${r.item_name} (${r.quantity} ${r.unit})`).join(', ')}</strong>.
                    Shared live with Owner procurement.
                  </span>
                </div>
              </div>
              <Badge className="bg-rose-600 text-white font-bold text-[11px] px-2.5 py-1">
                URGENT ATTENTION
              </Badge>
            </div>
          )}

          {/* -------------------------------------------------------------
              SUB-TAB 1: REQUIRED SUPPLIES & PROCUREMENT INDENTS (WITH PRIORITY)
          ------------------------------------------------------------- */}
          {inventorySubTab === 'required' && (
            <div className="space-y-4">
              {/* Priority Filter Bar */}
              <div className="flex items-center justify-between gap-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Filter Priority:</span>
                  {(['all', 'urgent', 'normal'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setReqPriorityFilter(p)}
                      className={`px-3 py-1 rounded-lg capitalize font-semibold transition-all ${
                        reqPriorityFilter === p
                          ? p === 'urgent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white bg-slate-950/60'
                      }`}
                    >
                      {p === 'urgent' ? '🚨 Urgent Priority' : p === 'normal' ? '📦 Normal Priority' : 'All Requests'}
                    </button>
                  ))}
                </div>

                <span className="text-slate-400">
                  Showing{' '}
                  {
                    branchRequests.filter((r) =>
                      reqPriorityFilter === 'all' ? true : r.priority === reqPriorityFilter
                    ).length
                  }{' '}
                  requisitions
                </span>
              </div>

              {/* Requisitions Grid / Table */}
              <div className="glass-card overflow-hidden border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-medium">
                      <tr>
                        <th className="py-3 px-4">Required Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Quantity Needed</th>
                        <th className="py-3 px-4">Need Priority</th>
                        <th className="py-3 px-4">Reason & Justification</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {branchRequests
                        .filter((r) =>
                          reqPriorityFilter === 'all' ? true : r.priority === reqPriorityFilter
                        )
                        .map((req) => {
                          const isUrgent = req.priority === 'urgent';
                          const isProcured = req.status === 'procured';

                          return (
                            <tr
                              key={req.id}
                              className={`transition-colors ${
                                isUrgent && !isProcured
                                  ? 'bg-rose-950/20 hover:bg-rose-950/30'
                                  : 'hover:bg-slate-900/40'
                              }`}
                            >
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-white block text-sm">
                                  {req.item_name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Requested by {req.requested_by} • {formatDate(req.created_at)}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                  {req.category}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                                {req.quantity} <span className="text-xs font-normal text-slate-400">{req.unit}</span>
                              </td>

                              {/* Priority Column */}
                              <td className="py-3.5 px-4">
                                {isUrgent ? (
                                  <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-xs font-bold animate-pulse px-2.5 py-1 flex items-center gap-1.5 w-fit">
                                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                                    URGENT NEED
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 w-fit">
                                    <Package className="h-3.5 w-3.5 text-blue-400" />
                                    NORMAL NEED
                                  </Badge>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-slate-300 text-xs max-w-sm">
                                <span>{req.reason || 'Regular branch requirement'}</span>
                                {req.estimated_cost && (
                                  <span className="block text-[11px] text-slate-400 mt-0.5">
                                    Est. Budget: <strong className="text-white">{formatINR(req.estimated_cost)}</strong>
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <Badge
                                  className={`text-[10px] capitalize px-2.5 py-0.5 ${
                                    req.status === 'procured'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : req.status === 'approved'
                                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  }`}
                                >
                                  {req.status === 'procured'
                                    ? '✓ Procured & Added'
                                    : req.status === 'approved'
                                    ? 'Approved by Owner'
                                    : 'Pending Owner Review'}
                                </Badge>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                {req.status !== 'procured' ? (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      updateInventoryRequestStatus(req.id, 'procured');
                                      toast.success(
                                        `Requisition marked as Procured! Added ${req.quantity} ${req.unit} to active stock.`
                                      );
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-7 px-2.5"
                                  >
                                    <Check className="h-3 w-3 mr-1" /> Mark Received
                                  </Button>
                                ) : (
                                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Stock Updated
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              SUB-TAB 2: CURRENT ON-SITE STOCK GRID
          ------------------------------------------------------------- */}
          {inventorySubTab === 'stock' && (
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search stock item..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-56"
                  />
                </div>

                <select
                  value={inventoryCategoryFilter}
                  onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="kitchen">Kitchen / Mess</option>
                  <option value="linen">Linen & Bedsheets</option>
                  <option value="safety">Safety & Medical</option>
                </select>
              </div>

              {/* Low Stock Warning Banner if any */}
              {lowStockItems.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span>
                      <strong>{lowStockItems.length} items below minimum buffer!</strong> Restock required for:{' '}
                      {lowStockItems.map((i) => i.name).join(', ')}.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setReqItemName(lowStockItems[0]?.name || '');
                      setReqCategory(lowStockItems[0]?.category || 'cleaning');
                      setReqUnit(lowStockItems[0]?.unit || 'pcs');
                      setReqPriority('urgent');
                      setShowAddRequestModal(true);
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs h-7"
                  >
                    Raise Urgent Indent
                  </Button>
                </div>
              )}

              {/* Stock Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {branchInventory
                  .filter((item) => {
                    const matchSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase());
                    const matchCategory =
                      inventoryCategoryFilter === 'all' || item.category === inventoryCategoryFilter;
                    return matchSearch && matchCategory;
                  })
                  .map((item) => {
                    const isLow = item.quantity <= item.min_threshold;

                    return (
                      <Card
                        key={item.id}
                        className={`glass-card p-4 transition-all flex flex-col justify-between ${
                          isLow ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {item.category}
                            </span>
                            {isLow ? (
                              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">
                                Low Stock
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                In Stock
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                          <p className="text-[11px] text-slate-400 mb-3">{item.notes || 'General property store'}</p>

                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Available Stock:</span>
                              <span className="font-bold text-lg text-white">
                                {item.quantity} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>Min Buffer:</span>
                              <span>{item.min_threshold} {item.unit}</span>
                            </div>
                            {item.cost_per_unit && (
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>Cost / unit:</span>
                                <span className="text-slate-300 font-semibold">{formatINR(item.cost_per_unit)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stock Increment / Decrement actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={item.quantity <= 0}
                            onClick={() => {
                              updateInventoryStock(item.id, -1);
                              toast.info(`Dispensed 1 ${item.unit} of ${item.name}`);
                            }}
                            className="flex-1 text-xs h-8 gap-1"
                          >
                            <Minus className="h-3 w-3" /> Dispense 1
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => {
                              updateInventoryStock(item.id, 5);
                              toast.success(`Restocked +5 ${item.unit} to ${item.name}`);
                            }}
                            className="flex-1 text-xs h-8 bg-indigo-600 hover:bg-indigo-500 gap-1"
                          >
                            <Plus className="h-3 w-3" /> Restock +5
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: STAFF ATTENDANCE
      ------------------------------------------------------------- */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-400" />
                Daily Employee Attendance Tracker — {todayStr}
              </h2>
              <p className="text-xs text-slate-400">
                Mark check-ins for Housekeeping, Security, Cooks, Caretakers. Automatically syncs with Owner payroll ledger.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setShowAddStaffModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Staff Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchStaff.map((member) => {
              const attendanceRecord = todayAttendanceRecords.find((a) => a.staff_id === member.id);
              const currentStatus: StaffAttendanceStatus = attendanceRecord?.status || 'present';
              const memberTasks = tasks.filter((t) => t.assigned_to === member.id && t.status !== 'done');

              return (
                <Card
                  key={member.id}
                  className="glass-card p-4 border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{member.name}</h3>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      <Badge
                        className={`text-[10px] capitalize px-2 py-0.5 ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : currentStatus === 'half_day'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {currentStatus === 'present' && '✓ Present'}
                        {currentStatus === 'half_day' && '½ Half Day'}
                        {currentStatus === 'absent' && '✕ Absent'}
                        {currentStatus === 'leave' && '🏖 On Leave'}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 py-2 border-y border-slate-800/80 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Shift In / Out:</span>
                        <span className="font-mono text-slate-200">
                          {attendanceRecord?.check_in_time || '08:00 AM'} -{' '}
                          {attendanceRecord?.check_out_time || '06:00 PM'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Active Tasks:</span>
                        <span className="text-indigo-400 font-semibold">{memberTasks.length} pending duties</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Monthly Salary:</span>
                        <span className="text-slate-200 font-semibold">{formatINR(member.salary)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Mark Today's Status:
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        onClick={() => handleAttendanceChange(member.id, 'present')}
                        className={`text-[11px] py-1.5 rounded-lg font-semibold transition-all border ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-600/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Present
                      </button>

                      <button
                        onClick={() => handleAttendanceChange(member.id, 'half_day')}
                        className={`text-[11px] py-1.5 rounded-lg font-semibold transition-all border ${
                          currentStatus === 'half_day'
                            ? 'bg-amber-600 text-white border-amber-500 shadow-sm shadow-amber-600/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Half
                      </button>

                      <button
                        onClick={() => handleAttendanceChange(member.id, 'absent')}
                        className={`text-[11px] py-1.5 rounded-lg font-semibold transition-all border ${
                          currentStatus === 'absent'
                            ? 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-600/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Absent
                      </button>

                      <button
                        onClick={() => handleAttendanceChange(member.id, 'leave')}
                        className={`text-[11px] py-1.5 rounded-lg font-semibold transition-all border ${
                          currentStatus === 'leave'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-sm shadow-purple-600/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Leave
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`tel:${member.phone}`}
                        className="flex-1 text-center py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="h-3 w-3 text-indigo-400" /> Call {formatPhone(member.phone)}
                      </a>
                      <a
                        href={`https://wa.me/91${member.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/20 transition-colors"
                        title="WhatsApp Staff"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: COMPLAINTS DESK
      ------------------------------------------------------------- */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-indigo-400" />
                Branch Complaints Desk & Maintenance Dispatch
              </h2>
              <p className="text-xs text-slate-400">
                Log reception complaints, dispatch on-site plumbers/electricians, and close resolved tickets.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['all', 'new', 'in_progress', 'resolved'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setComplaintStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      complaintStatusFilter === filter
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => setShowNewComplaintModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Log Complaint
              </Button>
            </div>
          </div>

          <div className="glass-card overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Resident & Room</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Resolution Note</th>
                    <th className="py-3 px-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {branchComplaints
                    .filter((c) =>
                      complaintStatusFilter === 'all' ? true : c.status === complaintStatusFilter
                    )
                    .map((comp) => {
                      const priorityColors: Record<string, string> = {
                        urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                        high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                      };

                      return (
                        <tr key={comp.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white block">{comp.title}</span>
                            <span className="text-[11px] text-slate-400">{comp.description}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-white font-medium block">
                              {comp.tenant_name || 'Resident'}
                            </span>
                            <span className="text-[11px] text-indigo-400">
                              {comp.room_number || 'Room 101'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">{comp.category}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                priorityColors[comp.priority] || 'text-slate-400'
                              }`}
                            >
                              {comp.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              className={`text-[10px] capitalize px-2 py-0.5 ${
                                comp.status === 'resolved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : comp.status === 'in_progress'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {comp.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                            {comp.resolution_notes || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {comp.status !== 'in_progress' && comp.status !== 'resolved' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleComplaintStatusChange(comp.id, 'in_progress')}
                                  className="text-[11px] h-7 px-2"
                                >
                                  In-Progress
                                </Button>
                              )}
                              {comp.status !== 'resolved' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleComplaintStatusChange(comp.id, 'resolved')}
                                  className="text-[11px] h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                                >
                                  <Check className="h-3 w-3 mr-1" /> Resolve
                                </Button>
                              )}
                              {comp.status === 'resolved' && (
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Closed
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: STUDENT DETAILS & KYC
      ------------------------------------------------------------- */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-400" />
                Branch Student Directory & Parent Emergency Contacts
              </h2>
              <p className="text-xs text-slate-400">
                View room allocations, institutions, emergency guardian contacts, and lease compliance.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search student, room or college..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>
          </div>

          <div className="glass-card overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="py-3 px-4">Resident</th>
                    <th className="py-3 px-4">Room & Bed</th>
                    <th className="py-3 px-4">Institution / Workplace</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Parent / Guardian Contact</th>
                    <th className="py-3 px-4">Monthly Rent</th>
                    <th className="py-3 px-4 text-right">Quick Connect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {branchTenants
                    .filter((t) => {
                      const q = studentSearch.toLowerCase();
                      return (
                        t.full_name.toLowerCase().includes(q) ||
                        (t.college_name && t.college_name.toLowerCase().includes(q)) ||
                        (t.room_number && t.room_number.toLowerCase().includes(q))
                      );
                    })
                    .map((student) => (
                      <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{student.full_name}</span>
                          <span className="text-[11px] text-slate-400">
                            Joined {student.joining_date || 'Jan 2025'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                            {student.room_number || 'Room 101'} - {student.bed_number || 'Bed A'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {student.college_name || 'Christ University / Tech Park'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">
                          {formatPhone(student.phone)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-white block font-medium">
                            {student.emergency_contact_name || 'Guardian'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {student.emergency_contact_phone ? formatPhone(student.emergency_contact_phone) : '+91 98450 11999'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white font-semibold">
                          {formatINR(student.monthly_rent || 8500)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:${student.phone}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Call Student"
                            >
                              <Phone className="h-3.5 w-3.5 text-indigo-400" />
                            </a>
                            <a
                              href={`https://wa.me/91${student.phone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/20 transition-colors"
                              title="WhatsApp Student"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: RENT MANAGEMENT
      ------------------------------------------------------------- */}
      {activeTab === 'rent' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-400" />
                Branch Rent Collection & Cash Receipt Desk
              </h2>
              <p className="text-xs text-slate-400">
                Collect physical cash / UPI at reception, generate instant receipts, and update the Owner's financial books.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setShowCollectRentModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <DollarSign className="h-3.5 w-3.5" /> Record In-Person Payment
            </Button>
          </div>

          <div className="glass-card overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="py-3 px-4">Resident</th>
                    <th className="py-3 px-4">Room & Bed</th>
                    <th className="py-3 px-4">Monthly Rent</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Receipt / Mode</th>
                    <th className="py-3 px-4 text-right">Manager Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {branchTenants.map((student) => {
                    const studentPayment = branchPaidPayments.find(
                      (p) => p.tenant_id === student.id && p.for_month === currentMonth
                    );
                    const isPaid = !!studentPayment;

                    return (
                      <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{student.full_name}</span>
                          <span className="text-[11px] text-slate-400">{formatPhone(student.phone)}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
                            {student.room_number || 'Room 101'} - {student.bed_number || 'Bed A'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-white font-semibold">
                          {formatINR(student.monthly_rent || 8500)}
                        </td>
                        <td className="py-3.5 px-4">
                          {isPaid ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                              ✓ Paid for {currentMonth}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                              Pending Due
                            </Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                          {isPaid ? (
                            <div>
                              <span className="block text-emerald-400 font-semibold">
                                {studentPayment.receipt_number}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Mode: {studentPayment.payment_mode}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isPaid ? (
                            <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Reconciled
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setRentTenantId(student.id);
                                  setRentAmount((student.monthly_rent || 8500).toString());
                                  setShowCollectRentModal(true);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-500 text-[11px] h-7 px-2.5"
                              >
                                Collect Rent
                              </Button>
                              <a
                                href={`https://wa.me/91${student.phone}?text=Hi%20${encodeURIComponent(
                                  student.full_name
                                )},%20this%20is%20the%20manager%20at%20${encodeURIComponent(
                                  activeBranch.name
                                )}.%20Kindly%20clear%20your%20monthly%20rent%20of%20₹${
                                  student.monthly_rent || 8500
                                }%20at%20the%20reception%20desk%20today.`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/20 text-[11px] flex items-center gap-1"
                                title="Send WhatsApp Due Alert"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 6: DAILY SOP & VISITOR GATE PASS
      ------------------------------------------------------------- */}
      {activeTab === 'sop' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-indigo-400" />
                  Manager Shift Standard Operating Procedures (SOP)
                </CardTitle>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  {completedChecklistCount}/{checklist.length} Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.done
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                      : 'bg-slate-900/90 border-slate-700/80 text-white hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        item.done
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {item.done && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-xs ${item.done ? 'line-through text-slate-500' : 'font-medium'}`}>
                      {item.task}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-indigo-400" />
                Main Gate Visitor Entry Book & Walk-In Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <form onSubmit={handleAddVisitor} className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Visitor Full Name</label>
                    <Input
                      placeholder="e.g. Ramesh Patel"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Phone Number</label>
                    <Input
                      placeholder="98450xxxxx"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Room or Purpose</label>
                    <Input
                      placeholder="Room 102 or Inquiry"
                      value={visitingRoom}
                      onChange={(e) => setVisitingRoom(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs h-8"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs h-8">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Issue Gate Pass
                    </Button>
                  </div>
                </div>
              </form>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Today's Gate Register
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {recentVisitors.map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{v.name}</span>
                          <span className="text-[10px] text-slate-400">({v.time})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Visiting: {v.room}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 ${
                            v.status === 'Inside Premises'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {v.status}
                        </Badge>
                        {v.status === 'Inside Premises' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCheckoutVisitor(v.id)}
                            className="text-[10px] h-6 px-2"
                          >
                            Check Out
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: REQUEST REQUIRED INVENTORY (URGENT / NORMAL PRIORITY)
      ------------------------------------------------------------- */}
      {showAddRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-rose-400" />
                Add Required Inventory Requisition
              </h3>
              <button
                onClick={() => setShowAddRequestModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInventoryRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Required Item Name *</label>
                <Input
                  required
                  placeholder="e.g. Commercial 19kg LPG Cylinders, 9W LED Bulbs"
                  value={reqItemName}
                  onChange={(e) => setReqItemName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              {/* Priority Selector: URGENT vs NORMAL */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                  Need Priority *
                  <span className="text-[11px] text-slate-500 font-normal">(Select operational urgency level)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setReqPriority('urgent')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      reqPriority === 'urgent'
                        ? 'bg-rose-950/40 border-rose-500 text-white shadow-md shadow-rose-900/20 ring-1 ring-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-rose-400 block text-xs">🚨 URGENT NEED</span>
                      <span className="text-[10px] text-slate-400">Critical / Emergency supply (Mess, plumbing, electrical breakdown)</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setReqPriority('normal')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      reqPriority === 'normal'
                        ? 'bg-blue-950/40 border-blue-500 text-white shadow-md shadow-blue-900/20 ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-blue-400 block text-xs">📦 NORMAL NEED</span>
                      <span className="text-[10px] text-slate-400">Regular weekly / monthly replenish stock buffer</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e: any) => setReqCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="kitchen">Kitchen / Mess</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="linen">Linen & Bedsheets</option>
                    <option value="safety">Safety & Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Quantity Needed</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <Input
                    placeholder="cylinders / pcs / kg"
                    value={reqUnit}
                    onChange={(e) => setReqUnit(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Estimated Budget (INR)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 1850"
                    value={reqEstimatedCost}
                    onChange={(e) => setReqEstimatedCost(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Branch</label>
                  <Input
                    disabled
                    value={activeBranch.name}
                    className="bg-slate-950 border-slate-800 text-xs text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason / Operational Justification *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain why this item is needed and how soon..."
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className={reqPriority === 'urgent' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'}
                >
                  Submit {reqPriority.toUpperCase()} Requisition
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADD NEW ON-SITE STOCK SKU
      ------------------------------------------------------------- */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Boxes className="h-4 w-4 text-indigo-400" />
                Add Consumable to Current Stock
              </h3>
              <button
                onClick={() => setShowAddInventoryModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInventory} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item Name</label>
                <Input
                  required
                  placeholder="e.g. 16A Geyser Switches"
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={invCategory}
                    onChange={(e: any) => setInvCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="kitchen">Kitchen / Mess</option>
                    <option value="linen">Linen & Bedsheets</option>
                    <option value="safety">Safety & Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <Input
                    placeholder="pcs / jars / kg"
                    value={invUnit}
                    onChange={(e) => setInvUnit(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Initial Qty</label>
                  <Input
                    type="number"
                    value={invQty}
                    onChange={(e) => setInvQty(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Min Threshold</label>
                  <Input
                    type="number"
                    value={invMinThreshold}
                    onChange={(e) => setInvMinThreshold(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Cost / Unit</label>
                  <Input
                    type="number"
                    value={invCost}
                    onChange={(e) => setInvCost(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddInventoryModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  Save to Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADD NEW STAFF MEMBER
      ------------------------------------------------------------- */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-400" />
                Add Subordinate Staff Member
              </h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Bahadur Singh"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Role / Function</label>
                  <select
                    value={newStaffRole}
                    onChange={(e: any) => setNewStaffRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="cleaner">Cleaner</option>
                    <option value="security">Security Guard</option>
                    <option value="cook">Cook / Chef</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="caretaker">Caretaker</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <Input
                    required
                    placeholder="98450xxxxx"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Monthly Salary (INR)</label>
                <Input
                  type="number"
                  placeholder="15000"
                  value={newStaffSalary}
                  onChange={(e) => setNewStaffSalary(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddStaffModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  Save to Roster
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: LOG NEW COMPLAINT
      ------------------------------------------------------------- */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-indigo-400" />
                Log Reception Desk Complaint
              </h3>
              <button
                onClick={() => setShowNewComplaintModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Complaint Title</label>
                <Input
                  required
                  placeholder="e.g. Geyser water not heating up"
                  value={compTitle}
                  onChange={(e) => setCompTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Resident & Room</label>
                <select
                  value={compTenantId}
                  onChange={(e) => setCompTenantId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  {branchTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.room_number || 'Room 101'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={compCategory}
                    onChange={(e) => setCompCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="WiFi / Internet">WiFi / Internet</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Mess / Food">Mess / Food</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Priority</label>
                  <select
                    value={compPriority}
                    onChange={(e: any) => setCompPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details of the issue reported..."
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowNewComplaintModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  Register Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: RECORD RENT PAYMENT
      ------------------------------------------------------------- */}
      {showCollectRentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                Record Rent Receipt at Front Desk
              </h3>
              <button
                onClick={() => setShowCollectRentModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordRentPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Resident</label>
                <select
                  value={rentTenantId}
                  onChange={(e) => {
                    setRentTenantId(e.target.value);
                    const selected = branchTenants.find((t) => t.id === e.target.value);
                    if (selected) setRentAmount((selected.monthly_rent || 8500).toString());
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  {branchTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.room_number || 'Room 101'} - {formatINR(t.monthly_rent || 8500)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Amount (INR)</label>
                  <Input
                    required
                    type="number"
                    placeholder="8500"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Payment Mode</label>
                  <select
                    value={rentPaymentMode}
                    onChange={(e) => setRentPaymentMode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Physical Cash</option>
                    <option value="Bank Transfer">NEFT / IMPS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Transaction Ref / Note (Optional)</label>
                <Input
                  placeholder="e.g. UPI Ref 32918829 or Cash envelope"
                  value={rentTxnRef}
                  onChange={(e) => setRentTxnRef(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCollectRentModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                  Generate Receipt & Sync
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: RESOLVE COMPLAINT WITH NOTE
      ------------------------------------------------------------- */}
      {resolvingComplaintId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Close Complaint & Enter Resolution Note
              </h3>
              <button
                onClick={() => setResolvingComplaintId(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Resolution Summary</label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Replaced thermostat coil in bathroom 102. Tested with tenant."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setResolvingComplaintId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                  Mark Resolved & Notify Owner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
