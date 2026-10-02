export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partially_paid';
export type PaymentType = 'rent' | 'electricity' | 'mess' | 'deposit' | 'maintenance' | 'other';
export type ComplaintStatus = 'new' | 'assigned' | 'in_progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type NoticeTarget = 'all' | 'building' | 'room';
export type UserRole = 'owner' | 'manager' | 'caretaker' | 'cook' | 'security' | 'cleaner' | 'maintenance' | 'tenant';

export interface Owner {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  business_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  contact_phone?: string;
  contact_email?: string;
  cover_image?: string;
  status: 'active' | 'archived';
  created_at: string;
  // Computed / Relations
  buildings_count?: number;
  rooms_count?: number;
  total_beds?: number;
  occupied_beds?: number;
  occupancy_rate?: number;
}

export interface PropertyFeatures {
  id: string;
  property_id: string;
  mess_enabled: boolean;
  electricity_billing_enabled: boolean;
  staff_management_enabled: boolean;
  biometric_sync_enabled: boolean;
  visitor_qr_enabled: boolean;
  whatsapp_reminders_enabled: boolean;
}

export interface Building {
  id: string;
  property_id: string;
  name: string;
  floors_count: number;
  has_mess: boolean;
  description?: string;
  created_at: string;
  // Computed
  rooms_count?: number;
  beds_count?: number;
  occupied_count?: number;
}

export interface Room {
  id: string;
  property_id: string;
  building_id: string;
  room_number: string;
  floor: number;
  sharing_type: string; // single, double, triple, four
  total_beds: number;
  base_rent: number;
  has_attached_bathroom: boolean;
  has_balcony: boolean;
  has_ac: boolean;
  created_at: string;
  // Relations
  beds?: Bed[];
  building_name?: string;
}

export interface Bed {
  id: string;
  property_id: string;
  room_id: string;
  bed_number: string;
  status: BedStatus;
  monthly_rent: number;
  created_at: string;
  // Relations
  tenant?: Tenant | null;
  room_number?: string;
}

export interface Tenant {
  id: string;
  user_id?: string;
  property_id: string;
  building_id: string;
  room_id: string;
  bed_id: string;
  full_name: string;
  phone: string;
  email?: string;
  id_proof_type?: string;
  id_proof_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  joining_date: string;
  check_out_date?: string;
  monthly_rent: number;
  security_deposit: number;
  agreement_status: 'pending' | 'signed' | 'expired';
  status: 'active' | 'checked_out' | 'notice_period';
  created_at: string;
  // Relations
  property_name?: string;
  building_name?: string;
  room_number?: string;
  bed_number?: string;
}

export interface TenantLedger {
  id: string;
  tenant_id: string;
  property_id: string;
  entry_type: 'debit' | 'credit';
  category: 'rent' | 'electricity' | 'mess' | 'late_fee' | 'discount' | 'payment' | 'advance';
  amount: number;
  balance?: number;
  notes?: string;
  created_at: string;
}

export interface Deposit {
  id: string;
  tenant_id: string;
  property_id: string;
  amount: number;
  status: 'held' | 'refunded' | 'partially_refunded';
  deduction: number;
  refund_amount: number;
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  property_id: string;
  tenant_id: string;
  amount: number;
  payment_type: PaymentType;
  for_month: string; // YYYY-MM
  payment_date: string;
  status: PaymentStatus;
  payment_mode: string;
  transaction_ref?: string;
  receipt_number: string;
  notes?: string;
  created_at: string;
  // Relations
  tenant_name?: string;
  room_number?: string;
}

export interface Expense {
  id: string;
  property_id: string;
  building_id?: string;
  category: string;
  amount: number;
  expense_date: string;
  description: string;
  vendor_name?: string;
  receipt_url?: string;
  created_at: string;
  building_name?: string;
}

export interface Complaint {
  id: string;
  property_id: string;
  tenant_id: string;
  assigned_to?: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  cost?: number;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
  // Relations
  tenant_name?: string;
  room_number?: string;
  assigned_staff_name?: string;
}

export interface MessMenu {
  id: string;
  building_id: string;
  day_of_week: string;
  breakfast: string;
  lunch: string;
  snacks?: string;
  dinner: string;
  special_notes?: string;
}

export interface MessAttendance {
  id: string;
  property_id: string;
  building_id: string;
  tenant_id: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface MessExpense {
  id: string;
  property_id: string;
  building_id: string;
  vendor_id?: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Staff {
  id: string;
  property_id: string;
  user_id?: string;
  name: string;
  role: UserRole;
  phone: string;
  salary: number;
  joining_date: string;
  status: 'active' | 'inactive';
}

export interface Task {
  id: string;
  property_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: ComplaintPriority;
  due_date?: string;
  created_at: string;
  // Relations
  assigned_staff_name?: string;
}

export interface Notice {
  id: string;
  property_id: string;
  building_id?: string;
  title: string;
  content: string;
  target: NoticeTarget;
  is_urgent: boolean;
  created_at: string;
  read_count?: number;
}

export interface Vendor {
  id: string;
  property_id: string;
  name: string;
  phone?: string;
  service_type: string;
  notes?: string;
}

export interface ElectricityReading {
  id: string;
  room_id: string;
  property_id: string;
  reading_date: string;
  previous_reading: number;
  current_reading: number;
  units_consumed: number;
  rate_per_unit: number;
  total_amount: number;
  is_billed: boolean;
  room_number?: string;
}

export interface VacancyLead {
  id: string;
  property_id: string;
  name: string;
  phone: string;
  source: string;
  visit_date: string;
  sharing_preference: string;
  status: 'inquiry' | 'visited' | 'converted' | 'lost';
  notes?: string;
}
