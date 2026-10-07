'use client';

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
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
  InventoryRequest,
  InventoryRequestStatus,
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
  INITIAL_INVENTORY_REQUESTS,
  getTodayDateStr,
} from '@/lib/data/initial-data';

// -------------------------------------------------------------
// SINGLETON GLOBAL STATE DEFINITION
// -------------------------------------------------------------

interface StoreState {
  properties: Property[];
  buildings: Building[];
  rooms: Room[];
  beds: Bed[];
  tenants: Tenant[];
  payments: Payment[];
  expenses: Expense[];
  complaints: Complaint[];
  messMenus: MessMenu[];
  staff: Staff[];
  tasks: Task[];
  notices: Notice[];
  featureFlags: Record<string, PropertyFeatures>;
  tiffinOrders: TiffinOrder[];
  staffAttendance: StaffAttendance[];
  inventory: InventoryItem[];
  inventoryRequests: InventoryRequest[];
  syncStatus: 'local' | 'syncing' | 'synced' | 'error';
  isLiveDB: boolean;
  lastSyncedAt: string | null;
}

let storeState: StoreState = {
  properties: INITIAL_PROPERTIES,
  buildings: INITIAL_BUILDINGS,
  rooms: INITIAL_ROOMS,
  beds: INITIAL_BEDS,
  tenants: INITIAL_TENANTS,
  payments: INITIAL_PAYMENTS,
  expenses: INITIAL_EXPENSES,
  complaints: INITIAL_COMPLAINTS,
  messMenus: INITIAL_MESS_MENUS,
  staff: INITIAL_STAFF,
  tasks: INITIAL_TASKS,
  notices: INITIAL_NOTICES,
  featureFlags: INITIAL_FEATURES,
  tiffinOrders: INITIAL_TIFFIN_ORDERS,
  staffAttendance: INITIAL_STAFF_ATTENDANCE,
  inventory: INITIAL_INVENTORY_ITEMS,
  inventoryRequests: INITIAL_INVENTORY_REQUESTS,
  syncStatus: 'local',
  isLiveDB: false,
  lastSyncedAt: null,
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

function updateStore(partial: Partial<StoreState>) {
  storeState = { ...storeState, ...partial };
  emitChange();
}

function saveToStorage(key: string, data: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error', e);
    }
  }
}

let isInitialized = false;

function initFromLocalStorage() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  try {
    const savedProps = localStorage.getItem('pgos_properties');
    const savedBeds = localStorage.getItem('pgos_beds');
    const savedTenants = localStorage.getItem('pgos_tenants');
    const savedPayments = localStorage.getItem('pgos_payments');
    const savedExpenses = localStorage.getItem('pgos_expenses');
    const savedComplaints = localStorage.getItem('pgos_complaints');
    const savedTasks = localStorage.getItem('pgos_tasks');
    const savedNotices = localStorage.getItem('pgos_notices');
    const savedFeatures = localStorage.getItem('pgos_features');
    const savedTiffins = localStorage.getItem('pgos_tiffins');
    const savedAttendance = localStorage.getItem('pgos_staff_attendance');
    const savedInventory = localStorage.getItem('pgos_inventory');
    const savedInvReqs = localStorage.getItem('pgos_inventory_requests');

    // Only hydrate from storage if valid and non-empty
    updateStore({
      properties: savedProps ? JSON.parse(savedProps) : INITIAL_PROPERTIES,
      beds: savedBeds ? JSON.parse(savedBeds) : INITIAL_BEDS,
      tenants: savedTenants ? JSON.parse(savedTenants) : INITIAL_TENANTS,
      payments: savedPayments ? JSON.parse(savedPayments) : INITIAL_PAYMENTS,
      expenses: savedExpenses ? JSON.parse(savedExpenses) : INITIAL_EXPENSES,
      complaints: savedComplaints ? JSON.parse(savedComplaints) : INITIAL_COMPLAINTS,
      tasks: savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS,
      notices: savedNotices ? JSON.parse(savedNotices) : INITIAL_NOTICES,
      featureFlags: savedFeatures ? JSON.parse(savedFeatures) : INITIAL_FEATURES,
      tiffinOrders: savedTiffins ? JSON.parse(savedTiffins) : INITIAL_TIFFIN_ORDERS,
      staffAttendance: savedAttendance ? JSON.parse(savedAttendance) : INITIAL_STAFF_ATTENDANCE,
      inventory: savedInventory ? JSON.parse(savedInventory) : INITIAL_INVENTORY_ITEMS,
      inventoryRequests: savedInvReqs ? JSON.parse(savedInvReqs) : INITIAL_INVENTORY_REQUESTS,
    });
  } catch (err) {
    console.warn('[usePGStore] LocalStorage parse warning:', err);
  }

  // Perform deterministic background sync check
  syncWithSupabase();
}

async function syncWithSupabase() {
  if (!isSupabaseConfigured()) {
    updateStore({
      syncStatus: 'local',
      isLiveDB: false,
      lastSyncedAt: new Date().toLocaleTimeString(),
    });
    return;
  }

  updateStore({ syncStatus: 'syncing' });

  // Safety timeout promise to prevent hanging in "Syncing..." state
  const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) =>
    setTimeout(() => resolve({ isTimeout: true }), 3000)
  );

  try {
    const syncPromise = Promise.all([
      fetchLiveDatabaseState(),
      fetchTiffinOrdersDB(),
    ]).then(([live, liveTiffins]) => ({ isTimeout: false, live, liveTiffins }));

    const result = await Promise.race([syncPromise, timeoutPromise]);

    if (result.isTimeout) {
      console.info('[usePGStore] Supabase sync timed out, maintaining verified local seed state.');
      updateStore({
        syncStatus: 'local',
        isLiveDB: false,
        lastSyncedAt: new Date().toLocaleTimeString(),
      });
      return;
    }

    const { live, liveTiffins } = result;

    // A live Supabase state is ONLY valid and authoritative if it has a complete core schema
    // (properties, beds, tenants, staff, complaints). Incomplete/partial schemas cause relational corruption.
    const isCompleteLiveDataset = Boolean(
      live &&
      live.hasData &&
      live.properties &&
      live.properties.length >= 2 &&
      live.tenants &&
      live.tenants.length > 0 &&
      live.staff &&
      live.staff.length > 0
    );

    if (isCompleteLiveDataset && live) {
      updateStore({
        properties: live.properties,
        buildings: live.buildings.length > 0 ? live.buildings : storeState.buildings,
        rooms: live.rooms.length > 0 ? live.rooms : storeState.rooms,
        beds: live.beds.length > 0 ? live.beds : storeState.beds,
        tenants: live.tenants,
        payments: live.payments.length > 0 ? live.payments : storeState.payments,
        expenses: live.expenses.length > 0 ? live.expenses : storeState.expenses,
        complaints: live.complaints,
        staff: live.staff,
        tasks: live.tasks.length > 0 ? live.tasks : storeState.tasks,
        notices: live.notices.length > 0 ? live.notices : storeState.notices,
        messMenus: live.messMenus.length > 0 ? live.messMenus : storeState.messMenus,
        featureFlags: Object.keys(live.featureFlags).length > 0 ? live.featureFlags : storeState.featureFlags,
        tiffinOrders: liveTiffins && liveTiffins.length > 0 ? liveTiffins : storeState.tiffinOrders,
        syncStatus: 'synced',
        isLiveDB: true,
        lastSyncedAt: new Date().toLocaleTimeString(),
      });
    } else {
      // Supabase is connected but only has 0 rows or an incomplete test dump.
      // Settle deterministically into local verified seed data mode.
      updateStore({
        syncStatus: 'local',
        isLiveDB: false,
        lastSyncedAt: new Date().toLocaleTimeString(),
      });
    }
  } catch (err) {
    console.warn('[usePGStore] Supabase sync error, falling back to local dataset:', err);
    updateStore({
      syncStatus: 'local',
      isLiveDB: false,
      lastSyncedAt: new Date().toLocaleTimeString(),
    });
  }
}

// -------------------------------------------------------------
// PUBLIC STORE HOOK
// -------------------------------------------------------------
export function usePGStore() {
  const [isClient, setIsClient] = useState(false);

  // Subscribe to singleton store
  const state = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => storeState,
    () => storeState
  );

  useEffect(() => {
    setIsClient(true);
    initFromLocalStorage();
  }, []);

  const {
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
    tiffinOrders,
    staffAttendance,
    inventory,
    inventoryRequests,
    syncStatus,
    isLiveDB,
    lastSyncedAt,
  } = state;

  // -------------------------------------------------------------
  // SINGLE SOURCE OF TRUTH: BED-LEVEL OCCUPANCY DERIVATIONS
  // -------------------------------------------------------------
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

  // Derived properties where each property's stats match actual beds
  const enrichedProperties = useMemo(() => {
    return properties.map((prop) => {
      const propRooms = rooms.filter((r) => r.property_id === prop.id);
      const propRoomIds = new Set(propRooms.map((r) => r.id));
      const propBeds = beds.filter((b) => b.property_id === prop.id || propRoomIds.has(b.room_id));

      const bTotal = propBeds.length > 0 ? propBeds.length : (prop.total_beds || 0);
      const bOccupied = propBeds.length > 0
        ? propBeds.filter((b) => b.status === 'occupied').length
        : (prop.occupied_beds || 0);
      const bRate = bTotal > 0 ? Math.round((bOccupied / bTotal) * 100) : (prop.occupancy_rate || 0);

      const propBuildings = buildings.filter((b) => b.property_id === prop.id);

      return {
        ...prop,
        buildings_count: propBuildings.length || prop.buildings_count || 1,
        rooms_count: propRooms.length || prop.rooms_count || 0,
        total_beds: bTotal,
        occupied_beds: bOccupied,
        occupancy_rate: bRate,
      };
    });
  }, [properties, buildings, rooms, beds]);

  // Financial Metrics
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

  // Tiffin Metrics
  const { todayTiffins, totalTiffinsOptedToday, tiffinsByCollege, pendingTiffinReturns } = useMemo(() => {
    const todayStr = getTodayDateStr();
    const todayTiffins = tiffinOrders.filter((t) => t.date === todayStr);
    const totalTiffinsOptedToday = todayTiffins.length;

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

    const pendingTiffinReturns = tiffinOrders.filter(
      (t) => t.status !== 'returned' && t.status !== 'cancelled'
    );

    return {
      todayTiffins,
      totalTiffinsOptedToday,
      tiffinsByCollege,
      pendingTiffinReturns,
    };
  }, [tiffinOrders]);

  // -------------------------------------------------------------
  // ACTIONS / MUTATIONS
  // -------------------------------------------------------------

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
    updateStore({ properties: updated });
    saveToStorage('pgos_properties', updated);
    insertPropertyDB(prop).catch(console.warn);
    return prop;
  };

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
    updateStore({ buildings: updated });
    saveToStorage('pgos_buildings', updated);
    insertBuildingDB(bld).catch(console.warn);
    return bld;
  };

  const addRoom = (newRoom: Omit<Room, 'id' | 'created_at'>) => {
    const roomId = `room-${Date.now()}`;
    const room: Room = {
      ...newRoom,
      id: roomId,
      created_at: new Date().toISOString(),
    };
    const updatedRooms = [...rooms, room];

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

    updateStore({ rooms: updatedRooms, beds: updatedBeds });
    saveToStorage('pgos_rooms', updatedRooms);
    saveToStorage('pgos_beds', updatedBeds);
    insertRoomDB(room).catch(console.warn);
    return room;
  };

  const updateBedStatus = (bedId: string, status: Bed['status']) => {
    const updated = beds.map((b) => (b.id === bedId ? { ...b, status } : b));
    updateStore({ beds: updated });
    saveToStorage('pgos_beds', updated);
    updateBedStatusDB(bedId, status).catch(console.warn);
  };

  const addTenant = (newTenant: Omit<Tenant, 'id' | 'created_at' | 'status'>) => {
    const id = `ten-${Date.now()}`;
    const tenant: Tenant = {
      ...newTenant,
      id,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    const updatedTenants = [tenant, ...tenants];
    const updatedBeds = beds.map((b) => (b.id === tenant.bed_id ? { ...b, status: 'occupied' as const } : b));

    updateStore({ tenants: updatedTenants, beds: updatedBeds });
    saveToStorage('pgos_tenants', updatedTenants);
    saveToStorage('pgos_beds', updatedBeds);
    insertTenantDB(tenant).catch(console.warn);
    updateBedStatusDB(tenant.bed_id, 'occupied').catch(console.warn);
    return tenant;
  };

  const checkoutTenant = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId);
    if (!target) return;
    const updatedTenants = tenants.map((t) =>
      t.id === tenantId ? { ...t, status: 'checked_out' as const, check_out_date: new Date().toISOString() } : t
    );
    let updatedBeds = beds;
    if (target.bed_id) {
      updatedBeds = beds.map((b) => (b.id === target.bed_id ? { ...b, status: 'available' as const } : b));
      updateBedStatusDB(target.bed_id, 'available').catch(console.warn);
    }
    updateStore({ tenants: updatedTenants, beds: updatedBeds });
    saveToStorage('pgos_tenants', updatedTenants);
    saveToStorage('pgos_beds', updatedBeds);
    checkoutTenantDB(tenantId).catch(console.warn);
  };

  const addPayment = (newPay: Omit<Payment, 'id' | 'created_at' | 'receipt_number'>) => {
    const receiptNum = `RCP-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const pay: Payment = {
      ...newPay,
      id: `pay-${Date.now()}`,
      receipt_number: receiptNum,
      created_at: new Date().toISOString(),
    };
    const updated = [pay, ...payments];
    updateStore({ payments: updated });
    saveToStorage('pgos_payments', updated);
    insertPaymentDB(pay).catch(console.warn);
    return pay;
  };

  const addExpense = (newExp: Omit<Expense, 'id' | 'created_at'>) => {
    const exp: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [exp, ...expenses];
    updateStore({ expenses: updated });
    saveToStorage('pgos_expenses', updated);
    insertExpenseDB(exp).catch(console.warn);
    return exp;
  };

  const addComplaint = (newCmp: Omit<Complaint, 'id' | 'created_at' | 'status'>) => {
    const cmp: Complaint = {
      ...newCmp,
      id: `cmp-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    const updated = [cmp, ...complaints];
    updateStore({ complaints: updated });
    saveToStorage('pgos_complaints', updated);
    insertComplaintDB(cmp).catch(console.warn);
    return cmp;
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], resolution_notes?: string) => {
    const updated = complaints.map((c) =>
      c.id === id
        ? {
            ...c,
            status,
            resolution_notes: resolution_notes ?? c.resolution_notes,
            resolved_at: status === 'resolved' ? new Date().toISOString() : undefined,
          }
        : c
    );
    updateStore({ complaints: updated });
    saveToStorage('pgos_complaints', updated);
    updateComplaintDB(id, status, resolution_notes).catch(console.warn);
  };

  const addStaff = (newStaff: Omit<Staff, 'id'>) => {
    const member: Staff = { ...newStaff, id: `st-${Date.now()}` };
    const updated = [...staff, member];
    updateStore({ staff: updated });
    saveToStorage('pgos_staff', updated);
    insertStaffDB(member).catch(console.warn);
    return member;
  };

  const addTask = (newTask: Omit<Task, 'id' | 'created_at'>) => {
    const task: Task = { ...newTask, id: `tsk-${Date.now()}`, created_at: new Date().toISOString() };
    const updated = [task, ...tasks];
    updateStore({ tasks: updated });
    saveToStorage('pgos_tasks', updated);
    insertTaskDB(task).catch(console.warn);
    return task;
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    updateStore({ tasks: updated });
    saveToStorage('pgos_tasks', updated);
    updateTaskStatusDB(id, status).catch(console.warn);
  };

  const addNotice = (newNotice: Omit<Notice, 'id' | 'created_at'>) => {
    const notice: Notice = { ...newNotice, id: `not-${Date.now()}`, created_at: new Date().toISOString(), read_count: 0 };
    const updated = [notice, ...notices];
    updateStore({ notices: updated });
    saveToStorage('pgos_notices', updated);
    insertNoticeDB(notice).catch(console.warn);
    return notice;
  };

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
    updateStore({ featureFlags: updated });
    saveToStorage('pgos_features', updated);
    updateFeatureFlagDB(propId, feature, val).catch(console.warn);
  };

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
    const existingIdx = staffAttendance.findIndex((a) => a.staff_id === staffId && a.date === today);

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

    updateStore({ staffAttendance: updated });
    saveToStorage('pgos_staff_attendance', updated);
    return updated;
  };

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
    updateStore({ inventory: updated });
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
    updateStore({ inventory: updated });
    saveToStorage('pgos_inventory', updated);
    return item;
  };

  const deleteInventoryItem = (itemId: string) => {
    const updated = inventory.filter((item) => item.id !== itemId);
    updateStore({ inventory: updated });
    saveToStorage('pgos_inventory', updated);
    return updated;
  };

  const addInventoryRequest = (newReq: Omit<InventoryRequest, 'id' | 'created_at' | 'status'>) => {
    const req: InventoryRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    const updated = [req, ...inventoryRequests];
    updateStore({ inventoryRequests: updated });
    saveToStorage('pgos_inventory_requests', updated);
    return req;
  };

  const updateInventoryRequestStatus = (requestId: string, status: InventoryRequestStatus) => {
    const targetReq = inventoryRequests.find((r) => r.id === requestId);
    const updated = inventoryRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status,
            procured_at: status === 'procured' ? new Date().toISOString() : r.procured_at,
          }
        : r
    );
    updateStore({ inventoryRequests: updated });
    saveToStorage('pgos_inventory_requests', updated);

    if (status === 'procured' && targetReq) {
      const existingItem = inventory.find(
        (item) => item.property_id === targetReq.property_id && item.name.toLowerCase() === targetReq.item_name.toLowerCase()
      );
      if (existingItem) {
        updateInventoryStock(existingItem.id, targetReq.quantity);
      } else {
        addInventoryItem({
          property_id: targetReq.property_id,
          name: targetReq.item_name,
          category: targetReq.category,
          quantity: targetReq.quantity,
          unit: targetReq.unit,
          min_threshold: Math.max(2, Math.floor(targetReq.quantity / 2)),
          cost_per_unit: targetReq.estimated_cost ? Math.round(targetReq.estimated_cost / targetReq.quantity) : undefined,
          notes: `Procured from requisition ${targetReq.id}`,
        });
      }
    }
    return updated;
  };

  const deleteInventoryRequest = (requestId: string) => {
    const updated = inventoryRequests.filter((r) => r.id !== requestId);
    updateStore({ inventoryRequests: updated });
    saveToStorage('pgos_inventory_requests', updated);
    return updated;
  };

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

    if (!params.bypassCutoff && currentHour >= 9) {
      const existing = tiffinOrders.find((t) => t.tenant_id === params.tenant_id && t.date === today);
      if (!existing || existing.status === 'cancelled') {
        throw new Error('Daily tiffin opt-in is only permitted before 9:00 AM daily. Please dine in the mess dining hall today.');
      }
    }

    const existingIndex = tiffinOrders.findIndex((t) => t.tenant_id === params.tenant_id && t.date === today);
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

    let updatedTenants = tenants;
    if (params.college_name) {
      updatedTenants = tenants.map((t) => (t.id === params.tenant_id ? { ...t, college_name: params.college_name } : t));
    }

    updateStore({ tiffinOrders: updated, tenants: updatedTenants });
    saveToStorage('pgos_tiffins', updated);
    saveToStorage('pgos_tenants', updatedTenants);
    upsertTiffinOrderDB(targetOrder).catch(console.warn);
    return targetOrder;
  };

  const cancelTiffin = (tenantId: string, bypassCutoff: boolean = false) => {
    const currentHour = new Date().getHours();
    if (!bypassCutoff && currentHour >= 9) {
      throw new Error('Tiffin orders cannot be cancelled after 9:00 AM as kitchen preparation has already commenced.');
    }

    const today = getTodayDateStr();
    const target = tiffinOrders.find(
      (t) => t.tenant_id === tenantId && (t.date === today || t.status === 'requested' || t.status === 'pending_return')
    );
    if (!target) return;

    const updated = tiffinOrders.map((t) => (t.id === target.id ? { ...t, status: 'cancelled' as const } : t));
    updateStore({ tiffinOrders: updated });
    saveToStorage('pgos_tiffins', updated);
    deleteTiffinOrderDB(target.id).catch(console.warn);
  };

  const verifyReturnTiffin = (orderId: string, verifiedBy?: string) => {
    const updated = tiffinOrders.map((t) =>
      t.id === orderId
        ? {
            ...t,
            status: 'returned' as const,
            verified_by: verifiedBy || t.verified_by,
            verified_at: new Date().toISOString(),
          }
        : t
    );
    updateStore({ tiffinOrders: updated });
    saveToStorage('pgos_tiffins', updated);
    deleteTiffinOrderDB(orderId).catch(console.warn);
  };

  const updateTenantCollege = (tenantId: string, college_name: string) => {
    const updated = tenants.map((t) => (t.id === tenantId ? { ...t, college_name } : t));
    updateStore({ tenants: updated });
    saveToStorage('pgos_tenants', updated);
  };

  return {
    isClient,
    properties: enrichedProperties,
    rawProperties: properties,
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
    // Inventory Requisitions / Required Supplies
    inventoryRequests,
    addInventoryRequest,
    updateInventoryRequestStatus,
    deleteInventoryRequest,
  };
}
