'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Property,
  Building,
  Room,
  Bed,
  Tenant,
  Payment,
  Expense,
  Complaint,
  MessMenu,
  Staff,
  Task,
  Notice,
  PropertyFeatures,
  TiffinOrder,
  StaffAttendance,
  StaffAttendanceStatus,
  InventoryItem,
  InventoryCategory,
} from '@/types/database';
import {
  isSupabaseConfigured,
  fetchLiveDatabaseState,
  insertPropertyDB,
  insertBuildingDB,
  insertRoomDB,
  updateBedStatusDB,
  insertTenantDB,
  checkoutTenantDB,
  insertPaymentDB,
  insertExpenseDB,
  insertComplaintDB,
  updateComplaintDB,
  insertStaffDB,
  insertTaskDB,
  updateTaskStatusDB,
  insertNoticeDB,
  updateFeatureFlagDB,
  fetchTiffinOrdersDB,
  upsertTiffinOrderDB,
  deleteTiffinOrderDB,
} from '@/lib/supabase/db';
import {
  INITIAL_PROPERTIES,
  INITIAL_FEATURES,
  INITIAL_BUILDINGS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_TENANTS,
  INITIAL_TIFFIN_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_COMPLAINTS,
  INITIAL_MESS_MENUS,
  INITIAL_STAFF,
  INITIAL_TASKS,
  INITIAL_NOTICES,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_INVENTORY_ITEMS,
  getTodayDateStr,
} from '@/lib/data/initial-data';

// -------------------------------------------------------------
// LOCAL STORAGE OR IN-MEMORY SINGLETON STORE
// -------------------------------------------------------------
export function usePGStore() {
  const [isClient, setIsClient] = useState(false);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [messMenus, setMessMenus] = useState<MessMenu[]>(INITIAL_MESS_MENUS);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [featureFlags, setFeatureFlags] = useState<Record<string, PropertyFeatures>>(INITIAL_FEATURES);
  const [tiffinOrders, setTiffinOrders] = useState<TiffinOrder[]>(INITIAL_TIFFIN_ORDERS);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>(INITIAL_STAFF_ATTENDANCE);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [syncStatus, setSyncStatus] = useState<'local' | 'syncing' | 'synced' | 'error'>('local');
  const [isLiveDB, setIsLiveDB] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Sync state with live Supabase database
  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setSyncStatus('local');
      setIsLiveDB(false);
      return;
    }

    try {
      setSyncStatus('syncing');
      const [live, liveTiffins] = await Promise.all([
        fetchLiveDatabaseState(),
        fetchTiffinOrdersDB(),
      ]);

      if (live && live.hasData) {
        if (live.properties.length > 0) setProperties(live.properties);
        if (live.buildings.length > 0) setBuildings(live.buildings);
        if (live.rooms.length > 0) setRooms(live.rooms);
        if (live.beds.length > 0) setBeds(live.beds);
        if (live.tenants.length > 0) setTenants(live.tenants);
        if (live.payments.length > 0) setPayments(live.payments);
        if (live.expenses.length > 0) setExpenses(live.expenses);
        if (live.complaints.length > 0) setComplaints(live.complaints);
        if (live.staff.length > 0) setStaff(live.staff);
        if (live.tasks.length > 0) setTasks(live.tasks);
        if (live.notices.length > 0) setNotices(live.notices);
        if (live.messMenus.length > 0) setMessMenus(live.messMenus);
        if (Object.keys(live.featureFlags).length > 0) setFeatureFlags(live.featureFlags);
        if (liveTiffins && liveTiffins.length > 0) setTiffinOrders(liveTiffins);
        setSyncStatus('synced');
        setIsLiveDB(true);
        setLastSyncedAt(new Date().toLocaleTimeString());
      } else {
        if (liveTiffins && liveTiffins.length > 0) setTiffinOrders(liveTiffins);
        // Connected to Supabase, but database tables currently have 0 rows
        setSyncStatus('local');
        setIsLiveDB(false);
      }
    } catch (err) {
      console.warn('[usePGStore] Supabase sync error:', err);
      setSyncStatus('error');
    }
  };

  // Hydrate from localStorage once on client and then sync with Supabase
  useEffect(() => {
    setIsClient(true);
    try {
      const savedProps = localStorage.getItem('pgos_properties');
      if (savedProps) setProperties(JSON.parse(savedProps));

      const savedBeds = localStorage.getItem('pgos_beds');
      if (savedBeds) setBeds(JSON.parse(savedBeds));

      const savedTenants = localStorage.getItem('pgos_tenants');
      if (savedTenants) setTenants(JSON.parse(savedTenants));

      const savedPayments = localStorage.getItem('pgos_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedExpenses = localStorage.getItem('pgos_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

      const savedComplaints = localStorage.getItem('pgos_complaints');
      if (savedComplaints) setComplaints(JSON.parse(savedComplaints));

      const savedTasks = localStorage.getItem('pgos_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedNotices = localStorage.getItem('pgos_notices');
      if (savedNotices) setNotices(JSON.parse(savedNotices));

      const savedFeatures = localStorage.getItem('pgos_features');
      if (savedFeatures) setFeatureFlags(JSON.parse(savedFeatures));

      const savedTiffins = localStorage.getItem('pgos_tiffins');
      if (savedTiffins) setTiffinOrders(JSON.parse(savedTiffins));

      const savedAttendance = localStorage.getItem('pgos_staff_attendance');
      if (savedAttendance) setStaffAttendance(JSON.parse(savedAttendance));

      const savedInventory = localStorage.getItem('pgos_inventory');
      if (savedInventory) setInventory(JSON.parse(savedInventory));
    } catch {
      // LocalStorage not available or parse error
    }

    // Connect to Supabase live database
    syncWithSupabase();
  }, []);

  // Save changes
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Storage error', e);
      }
    }
  };

  // Property Actions
  const addProperty = (newProp: Omit<Property, 'id' | 'created_at' | 'status'>) => {
    const prop: Property = {
      ...newProp,
      id: `prop-${Date.now()}`,
      status: 'active',
      created_at: new Date().toISOString(),
      buildings_count: 0,
      rooms_count: 0,
      total_beds: 0,
      occupied_beds: 0,
      occupancy_rate: 0,
    };
    const updated = [prop, ...properties];
    setProperties(updated);
    saveToStorage('pgos_properties', updated);
    insertPropertyDB(prop).catch(console.warn);
    return prop;
  };

  // Building Actions
  const addBuilding = (newBld: Omit<Building, 'id' | 'created_at'>) => {
    const bld: Building = {
      ...newBld,
      id: `bld-${Date.now()}`,
      created_at: new Date().toISOString(),
      rooms_count: 0,
      beds_count: 0,
      occupied_count: 0,
    };
    const updated = [...buildings, bld];
    setBuildings(updated);
    saveToStorage('pgos_buildings', updated);
    insertBuildingDB(bld).catch(console.warn);
    return bld;
  };

  // Room Actions
  const addRoom = (newRoom: Omit<Room, 'id' | 'created_at'>) => {
    const roomId = `room-${Date.now()}`;
    const room: Room = {
      ...newRoom,
      id: roomId,
      created_at: new Date().toISOString(),
    };
    const updatedRooms = [...rooms, room];
    setRooms(updatedRooms);
    saveToStorage('pgos_rooms', updatedRooms);
    insertRoomDB(room).catch(console.warn);

    // Auto-create beds based on total_beds
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const newBeds: Bed[] = [];
    for (let i = 0; i < room.total_beds; i++) {
      newBeds.push({
        id: `bed-${roomId}-${letters[i]}`,
        property_id: room.property_id,
        room_id: roomId,
        bed_number: `Bed ${letters[i]}`,
        status: 'available',
        monthly_rent: room.base_rent,
        created_at: new Date().toISOString(),
      });
    }
    const updatedBeds = [...beds, ...newBeds];
    setBeds(updatedBeds);
    saveToStorage('pgos_beds', updatedBeds);

    return room;
  };

  // Bed Status
  const updateBedStatus = (bedId: string, status: Bed['status']) => {
    const updated = beds.map((b) => (b.id === bedId ? { ...b, status } : b));
    setBeds(updated);
    saveToStorage('pgos_beds', updated);
    updateBedStatusDB(bedId, status).catch(console.warn);
  };

  // Tenant Actions
  const addTenant = (newTenant: Omit<Tenant, 'id' | 'created_at' | 'status'>) => {
    const id = `ten-${Date.now()}`;
    const tenant: Tenant = {
      ...newTenant,
      id,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    const updatedTenants = [tenant, ...tenants];
    setTenants(updatedTenants);
    saveToStorage('pgos_tenants', updatedTenants);
    insertTenantDB(tenant).catch(console.warn);

    // Mark bed as occupied
    updateBedStatus(tenant.bed_id, 'occupied');
    return tenant;
  };

  const checkoutTenant = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId);
    if (!target) return;
    const updatedTenants = tenants.map((t) =>
      t.id === tenantId ? { ...t, status: 'checked_out' as const, check_out_date: new Date().toISOString() } : t
    );
    setTenants(updatedTenants);
    saveToStorage('pgos_tenants', updatedTenants);
    checkoutTenantDB(tenantId).catch(console.warn);

    // Free the bed
    if (target.bed_id) {
      updateBedStatus(target.bed_id, 'available');
    }
  };

  // Payment Actions
  const addPayment = (newPay: Omit<Payment, 'id' | 'created_at' | 'receipt_number'>) => {
    const receiptNum = `RCP-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const pay: Payment = {
      ...newPay,
      id: `pay-${Date.now()}`,
      receipt_number: receiptNum,
      created_at: new Date().toISOString(),
    };
    const updated = [pay, ...payments];
    setPayments(updated);
    saveToStorage('pgos_payments', updated);
    insertPaymentDB(pay).catch(console.warn);
    return pay;
  };

  // Expense Actions
  const addExpense = (newExp: Omit<Expense, 'id' | 'created_at'>) => {
    const exp: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [exp, ...expenses];
    setExpenses(updated);
    saveToStorage('pgos_expenses', updated);
    insertExpenseDB(exp).catch(console.warn);
    return exp;
  };

  // Complaint Actions
  const addComplaint = (newCmp: Omit<Complaint, 'id' | 'created_at' | 'status'>) => {
    const cmp: Complaint = {
      ...newCmp,
      id: `cmp-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    const updated = [cmp, ...complaints];
    setComplaints(updated);
    saveToStorage('pgos_complaints', updated);
    insertComplaintDB(cmp).catch(console.warn);
    return cmp;
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], resolution_notes?: string) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status, resolution_notes: resolution_notes ?? c.resolution_notes, resolved_at: status === 'resolved' ? new Date().toISOString() : undefined } : c
    );
    setComplaints(updated);
    saveToStorage('pgos_complaints', updated);
    updateComplaintDB(id, status, resolution_notes).catch(console.warn);
  };

  // Staff & Tasks
  const addStaff = (newStaff: Omit<Staff, 'id'>) => {
    const member: Staff = { ...newStaff, id: `st-${Date.now()}` };
    const updated = [...staff, member];
    setStaff(updated);
    saveToStorage('pgos_staff', updated);
    insertStaffDB(member).catch(console.warn);
    return member;
  };

  const addTask = (newTask: Omit<Task, 'id' | 'created_at'>) => {
    const task: Task = { ...newTask, id: `tsk-${Date.now()}`, created_at: new Date().toISOString() };
    const updated = [task, ...tasks];
    setTasks(updated);
    saveToStorage('pgos_tasks', updated);
    insertTaskDB(task).catch(console.warn);
    return task;
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    setTasks(updated);
    saveToStorage('pgos_tasks', updated);
    updateTaskStatusDB(id, status).catch(console.warn);
  };

  // Notices
  const addNotice = (newNotice: Omit<Notice, 'id' | 'created_at'>) => {
    const notice: Notice = { ...newNotice, id: `not-${Date.now()}`, created_at: new Date().toISOString(), read_count: 0 };
    const updated = [notice, ...notices];
    setNotices(updated);
    saveToStorage('pgos_notices', updated);
    insertNoticeDB(notice).catch(console.warn);
    return notice;
  };

  // Feature Flags
  const updateFeatureFlag = (propId: string, feature: keyof PropertyFeatures, val: boolean) => {
    const current = featureFlags[propId] || {
      id: `feat-${propId}`,
      property_id: propId,
      mess_enabled: true,
      electricity_billing_enabled: true,
      staff_management_enabled: true,
      biometric_sync_enabled: false,
      visitor_qr_enabled: false,
      whatsapp_reminders_enabled: true,
    };
    const updated = {
      ...featureFlags,
      [propId]: { ...current, [feature]: val },
    };
    setFeatureFlags(updated);
    saveToStorage('pgos_features', updated);
    updateFeatureFlagDB(propId, feature, val).catch(console.warn);
  };

  // Staff Attendance Actions
  const markStaffAttendance = (
    staffId: string,
    propertyId: string,
    status: StaffAttendanceStatus,
    notes?: string,
    check_in_time?: string,
    check_out_time?: string
  ) => {
    const today = getTodayDateStr();
    const staffMember = staff.find((s) => s.id === staffId);
    const existingIdx = staffAttendance.findIndex(
      (a) => a.staff_id === staffId && a.date === today
    );

    let updated: StaffAttendance[];
    if (existingIdx >= 0) {
      const existing = staffAttendance[existingIdx];
      const record: StaffAttendance = {
        ...existing,
        status,
        notes: notes !== undefined ? notes : existing.notes,
        check_in_time: check_in_time !== undefined ? check_in_time : existing.check_in_time,
        check_out_time: check_out_time !== undefined ? check_out_time : existing.check_out_time,
      };
      updated = [...staffAttendance];
      updated[existingIdx] = record;
    } else {
      const record: StaffAttendance = {
        id: `att-${Date.now()}-${staffId}`,
        staff_id: staffId,
        property_id: propertyId,
        date: today,
        status,
        check_in_time: check_in_time || '08:00 AM',
        check_out_time: check_out_time,
        notes: notes || '',
        staff_name: staffMember?.name || 'Staff Member',
        staff_role: staffMember?.role || 'staff',
      };
      updated = [record, ...staffAttendance];
    }

    setStaffAttendance(updated);
    saveToStorage('pgos_staff_attendance', updated);
    return updated;
  };

  // Inventory Management Actions
  const updateInventoryStock = (itemId: string, changeQty: number) => {
    const updated = inventory.map((item) => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + changeQty);
        return {
          ...item,
          quantity: newQty,
          last_restocked: changeQty > 0 ? getTodayDateStr() : item.last_restocked,
        };
      }
      return item;
    });
    setInventory(updated);
    saveToStorage('pgos_inventory', updated);
    return updated;
  };

  const addInventoryItem = (newItem: Omit<InventoryItem, 'id' | 'last_restocked'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: `inv-${Date.now()}`,
      last_restocked: getTodayDateStr(),
    };
    const updated = [item, ...inventory];
    setInventory(updated);
    saveToStorage('pgos_inventory', updated);
    return item;
  };

  const deleteInventoryItem = (itemId: string) => {
    const updated = inventory.filter((item) => item.id !== itemId);
    setInventory(updated);
    saveToStorage('pgos_inventory', updated);
    return updated;
  };

  // Tiffin Box Management Actions
  const requestTiffin = (params: {
    tenant_id: string;
    tenant_name: string;
    room_number?: string;
    bed_number?: string;
    phone?: string;
    college_name: string;
    delivery_time: string;
    notes?: string;
    meal_type?: 'lunch' | 'breakfast_pack' | 'dinner_pack';
    property_id?: string;
    building_id?: string;
    bypassCutoff?: boolean;
  }) => {
    const today = getTodayDateStr();
    const currentHour = new Date().getHours();

    // Students can ONLY opt for tiffin before 9:00 AM
    if (!params.bypassCutoff && currentHour >= 9) {
      const existing = tiffinOrders.find(
        (t) => t.tenant_id === params.tenant_id && t.date === today
      );
      if (!existing) {
        throw new Error(
          'Daily tiffin opt-in is only permitted before 9:00 AM daily. Please dine in the mess dining hall today.'
        );
      }
    }

    const existingIndex = tiffinOrders.findIndex(
      (t) => t.tenant_id === params.tenant_id && t.date === today
    );

    let updated: TiffinOrder[];
    let targetOrder: TiffinOrder;

    if (existingIndex >= 0) {
      targetOrder = {
        ...tiffinOrders[existingIndex],
        college_name: params.college_name,
        delivery_time: params.delivery_time,
        notes: params.notes ?? tiffinOrders[existingIndex].notes,
        meal_type: params.meal_type || 'lunch',
        status: 'requested',
      };
      updated = [...tiffinOrders];
      updated[existingIndex] = targetOrder;
    } else {
      targetOrder = {
        id: `tif-${Date.now()}`,
        property_id: params.property_id || properties[0]?.id || 'prop-1',
        building_id: params.building_id || 'bld-1',
        tenant_id: params.tenant_id,
        tenant_name: params.tenant_name,
        room_number: params.room_number,
        bed_number: params.bed_number,
        phone: params.phone,
        college_name: params.college_name,
        date: today,
        delivery_time: params.delivery_time,
        status: 'requested',
        meal_type: params.meal_type || 'lunch',
        notes: params.notes,
        created_at: new Date().toISOString(),
      };
      updated = [targetOrder, ...tiffinOrders];
    }

    setTiffinOrders(updated);
    saveToStorage('pgos_tiffins', updated);
    upsertTiffinOrderDB(targetOrder).catch(console.warn);

    // Also persist student's college into their tenant record if updated
    if (params.college_name) {
      const updatedTenants = tenants.map((t) =>
        t.id === params.tenant_id ? { ...t, college_name: params.college_name } : t
      );
      setTenants(updatedTenants);
      saveToStorage('pgos_tenants', updatedTenants);
    }

    return targetOrder;
  };

  const cancelTiffin = (tenantId: string, bypassCutoff: boolean = false) => {
    const today = getTodayDateStr();
    const currentHour = new Date().getHours();
    if (!bypassCutoff && currentHour >= 9) {
      throw new Error(
        'Tiffin orders cannot be cancelled after 9:00 AM as kitchen preparation has already commenced.'
      );
    }
    const target = tiffinOrders.find((t) => t.tenant_id === tenantId && t.date === today);
    if (!target) return;
    const updated = tiffinOrders.filter((t) => t.id !== target.id);
    setTiffinOrders(updated);
    saveToStorage('pgos_tiffins', updated);
    deleteTiffinOrderDB(target.id).catch(console.warn);
  };

  const verifyReturnTiffin = (orderId: string, staffName: string = 'Mess Warden') => {
    // When staff verifies in the evening, the data is automatically deleted from active pending queue
    const target = tiffinOrders.find((t) => t.id === orderId);
    if (!target) return;
    const updated = tiffinOrders.filter((t) => t.id !== orderId);
    setTiffinOrders(updated);
    saveToStorage('pgos_tiffins', updated);
    deleteTiffinOrderDB(orderId).catch(console.warn);
  };

  const updateTenantCollege = (tenantId: string, college_name: string) => {
    const updated = tenants.map((t) => (t.id === tenantId ? { ...t, college_name } : t));
    setTenants(updated);
    saveToStorage('pgos_tenants', updated);
  };

  // Aggregates & Metrics (Optimized with useMemo)
  const {
    totalProperties,
    totalBuildings,
    totalRooms,
    totalBeds,
    occupiedBeds,
    vacantBeds,
    reservedBeds,
    maintenanceBeds,
    occupancyRate,
  } = useMemo(() => {
    const totalProperties = properties.length;
    const totalBuildings = buildings.length;
    const totalRooms = rooms.length;
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
    const vacantBeds = beds.filter((b) => b.status === 'available').length;
    const reservedBeds = beds.filter((b) => b.status === 'reserved').length;
    const maintenanceBeds = beds.filter((b) => b.status === 'maintenance').length;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    return {
      totalProperties,
      totalBuildings,
      totalRooms,
      totalBeds,
      occupiedBeds,
      vacantBeds,
      reservedBeds,
      maintenanceBeds,
      occupancyRate,
    };
  }, [properties.length, buildings.length, rooms.length, beds]);

  const {
    currentMonthRevenue,
    currentMonthExpenses,
    netOperatingIncome,
    pendingPayments,
    pendingRentTotal,
  } = useMemo(() => {
    const currentMonthRevenue = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const currentMonthExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netOperatingIncome = currentMonthRevenue - currentMonthExpenses;

    const pendingPayments = payments.filter((p) => p.status === 'pending');
    const pendingRentTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
      currentMonthRevenue,
      currentMonthExpenses,
      netOperatingIncome,
      pendingPayments,
      pendingRentTotal,
    };
  }, [payments, expenses]);

  // Tiffin Metrics & College Categorization (Optimized with useMemo)
  const { todayTiffins, totalTiffinsOptedToday, tiffinsByCollege, pendingTiffinReturns } = useMemo(() => {
    const todayStr = getTodayDateStr();
    const todayTiffins = tiffinOrders.filter((t) => t.date === todayStr);
    const totalTiffinsOptedToday = todayTiffins.length;

    // Group students by their college for kitchen packing logistics
    const collegeMap: Record<string, TiffinOrder[]> = {};
    todayTiffins.forEach((o) => {
      const college = o.college_name || 'Unassigned College / Institution';
      if (!collegeMap[college]) collegeMap[college] = [];
      collegeMap[college].push(o);
    });

    const tiffinsByCollege = Object.entries(collegeMap).map(([college, orders]) => ({
      college,
      count: orders.length,
      orders,
    }));

    // Pending students who have opted for tiffin but NOT returned the box
    const pendingTiffinReturns = tiffinOrders.filter((t) => t.status !== 'returned');

    return {
      todayTiffins,
      totalTiffinsOptedToday,
      tiffinsByCollege,
      pendingTiffinReturns,
    };
  }, [tiffinOrders]);

  return {
    isClient,
    properties,
    buildings,
    rooms,
    beds,
    tenants,
    payments,
    expenses,
    complaints,
    messMenus,
    staff,
    tasks,
    notices,
    featureFlags,
    // Database Sync State
    syncStatus,
    isLiveDB,
    lastSyncedAt,
    syncNow: syncWithSupabase,
    // Metrics
    totalProperties,
    totalBuildings,
    totalRooms,
    totalBeds,
    occupiedBeds,
    vacantBeds,
    reservedBeds,
    maintenanceBeds,
    occupancyRate,
    currentMonthRevenue,
    currentMonthExpenses,
    netOperatingIncome,
    pendingPayments,
    pendingRentTotal,
    // Tiffin System
    tiffinOrders,
    todayTiffins,
    totalTiffinsOptedToday,
    tiffinsByCollege,
    pendingTiffinReturns,
    requestTiffin,
    cancelTiffin,
    verifyReturnTiffin,
    updateTenantCollege,
    // Operations
    addProperty,
    addBuilding,
    addRoom,
    updateBedStatus,
    addTenant,
    checkoutTenant,
    addPayment,
    addExpense,
    addComplaint,
    updateComplaintStatus,
    addStaff,
    addTask,
    updateTaskStatus,
    addNotice,
    updateFeatureFlag,
    // Staff Attendance
    staffAttendance,
    markStaffAttendance,
    // Inventory
    inventory,
    updateInventoryStock,
    addInventoryItem,
    deleteInventoryItem,
  };
}
