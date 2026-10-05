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

// -------------------------------------------------------------
// INITIAL SEED DATA
// -------------------------------------------------------------
const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    owner_id: 'owner-1',
    name: 'Royal Palms Luxury Living',
    address: '4th Cross, 5th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560095',
    contact_phone: '+91 98765 43210',
    contact_email: 'care@royalpalmspg.com',
    cover_image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2025-01-10T10:00:00Z',
    buildings_count: 2,
    rooms_count: 8,
    total_beds: 18,
    occupied_beds: 15,
    occupancy_rate: 83,
  },
  {
    id: 'prop-2',
    owner_id: 'owner-1',
    name: 'Silicon Oasis Co-living',
    address: 'Sector 2, HSR Layout, Near BDA Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    contact_phone: '+91 98450 11223',
    contact_email: 'hsr@siliconoasis.in',
    cover_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2025-02-01T10:00:00Z',
    buildings_count: 1,
    rooms_count: 5,
    total_beds: 12,
    occupied_beds: 11,
    occupancy_rate: 92,
  },
  {
    id: 'prop-3',
    owner_id: 'owner-1',
    name: 'Cyber City Elite Stays',
    address: 'DLF Phase 2, Near Cyber Hub',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    contact_phone: '+91 99110 55443',
    contact_email: 'delhi@cybercitypg.com',
    cover_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2025-02-15T10:00:00Z',
    buildings_count: 1,
    rooms_count: 6,
    total_beds: 14,
    occupied_beds: 10,
    occupancy_rate: 71,
  },
];

const INITIAL_FEATURES: Record<string, PropertyFeatures> = {
  'prop-1': {
    id: 'feat-1',
    property_id: 'prop-1',
    mess_enabled: true,
    electricity_billing_enabled: true,
    staff_management_enabled: true,
    biometric_sync_enabled: false,
    visitor_qr_enabled: true,
    whatsapp_reminders_enabled: true,
  },
  'prop-2': {
    id: 'feat-2',
    property_id: 'prop-2',
    mess_enabled: true,
    electricity_billing_enabled: true,
    staff_management_enabled: true,
    biometric_sync_enabled: false,
    visitor_qr_enabled: false,
    whatsapp_reminders_enabled: true,
  },
  'prop-3': {
    id: 'feat-3',
    property_id: 'prop-3',
    mess_enabled: false,
    electricity_billing_enabled: true,
    staff_management_enabled: true,
    biometric_sync_enabled: false,
    visitor_qr_enabled: false,
    whatsapp_reminders_enabled: true,
  },
};

const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'bld-1',
    property_id: 'prop-1',
    name: 'Tower A (Executive Suites)',
    floors_count: 3,
    has_mess: true,
    description: 'Modern high-speed Wi-Fi, power backup, rooftop dining',
    created_at: '2025-01-10T10:00:00Z',
    rooms_count: 4,
    beds_count: 10,
    occupied_count: 9,
  },
  {
    id: 'bld-2',
    property_id: 'prop-1',
    name: 'Tower B (Studio Wing)',
    floors_count: 2,
    has_mess: true,
    description: 'Quiet study atmosphere, AC rooms, attached balconies',
    created_at: '2025-01-12T10:00:00Z',
    rooms_count: 4,
    beds_count: 8,
    occupied_count: 6,
  },
  {
    id: 'bld-3',
    property_id: 'prop-2',
    name: 'Main Block',
    floors_count: 3,
    has_mess: true,
    description: 'Adjacent to main IT parks, daily housekeeping, 3-time buffet',
    created_at: '2025-02-01T10:00:00Z',
    rooms_count: 5,
    beds_count: 12,
    occupied_count: 11,
  },
  {
    id: 'bld-4',
    property_id: 'prop-3',
    name: 'North Wing',
    floors_count: 3,
    has_mess: false,
    description: 'Walking distance to Metro, fully furnished with smart TV',
    created_at: '2025-02-15T10:00:00Z',
    rooms_count: 6,
    beds_count: 14,
    occupied_count: 10,
  },
];

const INITIAL_ROOMS: Room[] = [
  // Building 1 (Tower A)
  {
    id: 'room-101',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_number: '101',
    floor: 1,
    sharing_type: 'double',
    total_beds: 2,
    base_rent: 9500,
    has_attached_bathroom: true,
    has_balcony: true,
    has_ac: true,
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'room-102',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_number: '102',
    floor: 1,
    sharing_type: 'triple',
    total_beds: 3,
    base_rent: 7500,
    has_attached_bathroom: true,
    has_balcony: false,
    has_ac: false,
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'room-201',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_number: '201',
    floor: 2,
    sharing_type: 'single',
    total_beds: 1,
    base_rent: 14500,
    has_attached_bathroom: true,
    has_balcony: true,
    has_ac: true,
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'room-202',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_number: '202',
    floor: 2,
    sharing_type: 'four',
    total_beds: 4,
    base_rent: 6500,
    has_attached_bathroom: true,
    has_balcony: false,
    has_ac: false,
    created_at: '2025-01-10T10:00:00Z',
  },
  // Building 2 (Tower B)
  {
    id: 'room-b101',
    property_id: 'prop-1',
    building_id: 'bld-2',
    room_number: 'B-101',
    floor: 1,
    sharing_type: 'double',
    total_beds: 2,
    base_rent: 9000,
    has_attached_bathroom: true,
    has_balcony: false,
    has_ac: true,
    created_at: '2025-01-12T10:00:00Z',
  },
  {
    id: 'room-b102',
    property_id: 'prop-1',
    building_id: 'bld-2',
    room_number: 'B-102',
    floor: 1,
    sharing_type: 'double',
    total_beds: 2,
    base_rent: 9000,
    has_attached_bathroom: true,
    has_balcony: true,
    has_ac: true,
    created_at: '2025-01-12T10:00:00Z',
  },
];

const INITIAL_BEDS: Bed[] = [
  // Room 101 (Double)
  { id: 'bed-101-a', property_id: 'prop-1', room_id: 'room-101', bed_number: 'Bed A', status: 'occupied', monthly_rent: 9500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'bed-101-b', property_id: 'prop-1', room_id: 'room-101', bed_number: 'Bed B', status: 'occupied', monthly_rent: 9500, created_at: '2025-01-10T10:00:00Z' },

  // Room 102 (Triple)
  { id: 'bed-102-a', property_id: 'prop-1', room_id: 'room-102', bed_number: 'Bed A', status: 'occupied', monthly_rent: 7500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'bed-102-b', property_id: 'prop-1', room_id: 'room-102', bed_number: 'Bed B', status: 'available', monthly_rent: 7500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'bed-102-c', property_id: 'prop-1', room_id: 'room-102', bed_number: 'Bed C', status: 'reserved', monthly_rent: 7500, created_at: '2025-01-10T10:00:00Z' },

  // Room 201 (Single)
  { id: 'bed-201-a', property_id: 'prop-1', room_id: 'room-201', bed_number: 'Bed A', status: 'occupied', monthly_rent: 14500, created_at: '2025-01-10T10:00:00Z' },

  // Room 202 (Four Sharing)
  { id: 'bed-202-a', property_id: 'prop-1', room_id: 'room-202', bed_number: 'Bed A', status: 'occupied', monthly_rent: 6500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'bed-202-b', property_id: 'prop-1', room_id: 'room-202', bed_number: 'Bed B', status: 'occupied', monthly_rent: 6500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'bed-202-c', property_id: 'prop-1', room_id: 'room-202', bed_number: 'Bed C', status: 'occupied', monthly_rent: 6500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'bed-202-d', property_id: 'prop-1', room_id: 'room-202', bed_number: 'Bed D', status: 'maintenance', monthly_rent: 6500, created_at: '2025-01-10T10:00:00Z' },

  // Room B-101
  { id: 'bed-b101-a', property_id: 'prop-1', room_id: 'room-b101', bed_number: 'Bed A', status: 'occupied', monthly_rent: 9000, created_at: '2025-01-12T10:00:00Z' },
  { id: 'bed-b101-b', property_id: 'prop-1', room_id: 'room-b101', bed_number: 'Bed B', status: 'occupied', monthly_rent: 9000, created_at: '2025-01-12T10:00:00Z' },
];

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'ten-1',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_id: 'room-101',
    bed_id: 'bed-101-a',
    full_name: 'Aarav Sharma',
    phone: '9876543210',
    email: 'aarav.sharma@gmail.com',
    college_name: 'BMS College of Engineering',
    course: 'B.Tech Computer Science',
    id_proof_type: 'Aadhaar',
    id_proof_number: '8921-4456-9901',
    emergency_contact_name: 'Rajesh Sharma (Father)',
    emergency_contact_phone: '9845112233',
    joining_date: '2025-01-15',
    monthly_rent: 9500,
    security_deposit: 19000,
    agreement_status: 'signed',
    status: 'active',
    created_at: '2025-01-15T10:00:00Z',
    property_name: 'Royal Palms Luxury Living',
    building_name: 'Tower A',
    room_number: '101',
    bed_number: 'Bed A',
  },
  {
    id: 'ten-2',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_id: 'room-101',
    bed_id: 'bed-101-b',
    full_name: 'Rohan Mehta',
    phone: '9822334455',
    email: 'rohan.m@techcorp.io',
    college_name: 'PES University (Ring Road)',
    course: 'B.Tech AI & Data Science',
    id_proof_type: 'PAN',
    id_proof_number: 'ABCDE1234F',
    emergency_contact_name: 'Sunita Mehta (Mother)',
    emergency_contact_phone: '9822334499',
    joining_date: '2025-01-20',
    monthly_rent: 9500,
    security_deposit: 19000,
    agreement_status: 'signed',
    status: 'active',
    created_at: '2025-01-20T10:00:00Z',
    property_name: 'Royal Palms Luxury Living',
    building_name: 'Tower A',
    room_number: '101',
    bed_number: 'Bed B',
  },
  {
    id: 'ten-3',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_id: 'room-201',
    bed_id: 'bed-201-a',
    full_name: 'Pooja Hegde',
    phone: '9740112299',
    email: 'pooja.h@designworks.com',
    college_name: 'Christ University (Central Campus)',
    course: 'BBA Finance & Marketing',
    id_proof_type: 'Passport',
    id_proof_number: 'V8829103',
    emergency_contact_name: 'Karan Hegde (Brother)',
    emergency_contact_phone: '9740112288',
    joining_date: '2025-02-01',
    monthly_rent: 14500,
    security_deposit: 29000,
    agreement_status: 'signed',
    status: 'active',
    created_at: '2025-02-01T10:00:00Z',
    property_name: 'Royal Palms Luxury Living',
    building_name: 'Tower A',
    room_number: '201',
    bed_number: 'Bed A',
  },
  {
    id: 'ten-4',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_id: 'room-102',
    bed_id: 'bed-102-a',
    full_name: 'Sneha Rao',
    phone: '9988776655',
    email: 'sneha.rao@fintech.co',
    college_name: 'RV College of Engineering',
    course: 'B.Tech Electronics & Comm.',
    id_proof_type: 'Aadhaar',
    id_proof_number: '7721-3312-5509',
    joining_date: '2025-02-10',
    monthly_rent: 7500,
    security_deposit: 15000,
    agreement_status: 'signed',
    status: 'active',
    created_at: '2025-02-10T10:00:00Z',
    property_name: 'Royal Palms Luxury Living',
    building_name: 'Tower A',
    room_number: '102',
    bed_number: 'Bed A',
  },
  {
    id: 'ten-5',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_id: 'room-102',
    bed_id: 'bed-102-b',
    full_name: 'Vikram Sethi',
    phone: '9811223344',
    email: 'vikram.sethi@gmail.com',
    college_name: 'BMS College of Engineering',
    course: 'B.Tech Mechanical Engineering',
    id_proof_type: 'Aadhaar',
    id_proof_number: '4455-6677-8899',
    joining_date: '2025-02-15',
    monthly_rent: 7500,
    security_deposit: 15000,
    agreement_status: 'signed',
    status: 'active',
    created_at: '2025-02-15T10:00:00Z',
    property_name: 'Royal Palms Luxury Living',
    building_name: 'Tower A',
    room_number: '102',
    bed_number: 'Bed B',
  },
  {
    id: 'ten-6',
    property_id: 'prop-1',
    building_id: 'bld-1',
    room_id: 'room-202',
    bed_id: 'bed-202-a',
    full_name: 'Rahul Verma',
    phone: '9833445566',
    email: 'rahul.verma@pes.edu',
    college_name: 'PES University (Ring Road)',
    course: 'B.Tech Computer Science',
    id_proof_type: 'Aadhaar',
    id_proof_number: '1122-3344-5566',
    joining_date: '2025-02-18',
    monthly_rent: 6500,
    security_deposit: 13000,
    agreement_status: 'signed',
    status: 'active',
    created_at: '2025-02-18T10:00:00Z',
    property_name: 'Royal Palms Luxury Living',
    building_name: 'Tower A',
    room_number: '202',
    bed_number: 'Bed A',
  },
];

// Initial Daily Tiffin Orders (Linked to College & Delivery Slots)
const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const INITIAL_TIFFIN_ORDERS: TiffinOrder[] = [
  {
    id: 'tif-1',
    property_id: 'prop-1',
    building_id: 'bld-1',
    tenant_id: 'ten-1',
    tenant_name: 'Aarav Sharma',
    room_number: '101',
    bed_number: 'Bed A',
    phone: '9876543210',
    college_name: 'BMS College of Engineering',
    date: getTodayDateStr(),
    delivery_time: '08:00 AM',
    status: 'requested',
    meal_type: 'lunch',
    notes: 'Please pack 3 chapattis with paneer curry',
    created_at: `${getTodayDateStr()}T06:30:00Z`,
  },
  {
    id: 'tif-2',
    property_id: 'prop-1',
    building_id: 'bld-1',
    tenant_id: 'ten-2',
    tenant_name: 'Rohan Mehta',
    room_number: '101',
    bed_number: 'Bed B',
    phone: '9822334455',
    college_name: 'PES University (Ring Road)',
    date: getTodayDateStr(),
    delivery_time: '08:30 AM',
    status: 'pending_return',
    meal_type: 'lunch',
    notes: 'No spicy food',
    created_at: `${getTodayDateStr()}T06:45:00Z`,
  },
  {
    id: 'tif-3',
    property_id: 'prop-1',
    building_id: 'bld-1',
    tenant_id: 'ten-3',
    tenant_name: 'Pooja Hegde',
    room_number: '201',
    bed_number: 'Bed A',
    phone: '9740112299',
    college_name: 'Christ University (Central Campus)',
    date: getTodayDateStr(),
    delivery_time: '07:45 AM',
    status: 'pending_return',
    meal_type: 'lunch',
    created_at: `${getTodayDateStr()}T06:15:00Z`,
  },
  {
    id: 'tif-4',
    property_id: 'prop-1',
    building_id: 'bld-1',
    tenant_id: 'ten-5',
    tenant_name: 'Vikram Sethi',
    room_number: '102',
    bed_number: 'Bed B',
    phone: '9811223344',
    college_name: 'BMS College of Engineering',
    date: getTodayDateStr(),
    delivery_time: '08:00 AM',
    status: 'pending_return',
    meal_type: 'lunch',
    created_at: `${getTodayDateStr()}T06:50:00Z`,
  },
  {
    id: 'tif-5',
    property_id: 'prop-1',
    building_id: 'bld-1',
    tenant_id: 'ten-4',
    tenant_name: 'Sneha Rao',
    room_number: '102',
    bed_number: 'Bed A',
    phone: '9988776655',
    college_name: 'RV College of Engineering',
    date: getTodayDateStr(),
    delivery_time: '08:15 AM',
    status: 'pending_return',
    meal_type: 'lunch',
    created_at: `${getTodayDateStr()}T07:00:00Z`,
  },
  {
    id: 'tif-6',
    property_id: 'prop-1',
    building_id: 'bld-1',
    tenant_id: 'ten-6',
    tenant_name: 'Rahul Verma',
    room_number: '202',
    bed_number: 'Bed A',
    phone: '9833445566',
    college_name: 'PES University (Ring Road)',
    date: getTodayDateStr(),
    delivery_time: '08:30 AM',
    status: 'pending_return',
    meal_type: 'lunch',
    created_at: `${getTodayDateStr()}T07:10:00Z`,
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    property_id: 'prop-1',
    tenant_id: 'ten-1',
    amount: 9500,
    payment_type: 'rent',
    for_month: '2025-03',
    payment_date: '2025-03-03',
    status: 'paid',
    payment_mode: 'UPI (GPay)',
    transaction_ref: 'UPI/382910382911',
    receipt_number: 'RCP-202503-00142',
    notes: 'Paid on time',
    created_at: '2025-03-03T09:30:00Z',
    tenant_name: 'Aarav Sharma',
    room_number: '101 (Bed A)',
  },
  {
    id: 'pay-2',
    property_id: 'prop-1',
    tenant_id: 'ten-2',
    amount: 9500,
    payment_type: 'rent',
    for_month: '2025-03',
    payment_date: '2025-03-04',
    status: 'paid',
    payment_mode: 'UPI (PhonePe)',
    transaction_ref: 'UPI/492019482910',
    receipt_number: 'RCP-202503-00143',
    notes: 'March rent verified',
    created_at: '2025-03-04T11:20:00Z',
    tenant_name: 'Rohan Mehta',
    room_number: '101 (Bed B)',
  },
  {
    id: 'pay-3',
    property_id: 'prop-1',
    tenant_id: 'ten-3',
    amount: 14500,
    payment_type: 'rent',
    for_month: '2025-03',
    payment_date: '2025-03-02',
    status: 'paid',
    payment_mode: 'IMPS Bank Transfer',
    transaction_ref: 'HDFC9821448',
    receipt_number: 'RCP-202503-00144',
    notes: 'Single room rent',
    created_at: '2025-03-02T14:10:00Z',
    tenant_name: 'Pooja Hegde',
    room_number: '201 (Bed A)',
  },
  {
    id: 'pay-4',
    property_id: 'prop-1',
    tenant_id: 'ten-4',
    amount: 7500,
    payment_type: 'rent',
    for_month: '2025-03',
    payment_date: '2025-03-05',
    status: 'pending',
    payment_mode: 'UPI',
    receipt_number: 'RCP-202503-00145',
    notes: 'Reminder sent via SMS',
    created_at: '2025-03-05T08:00:00Z',
    tenant_name: 'Sneha Rao',
    room_number: '102 (Bed A)',
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    property_id: 'prop-1',
    building_id: 'bld-1',
    category: 'Groceries & Mess',
    amount: 28400,
    expense_date: '2025-03-01',
    description: 'Monthly pantry bulk purchase (Rice, Atta, Dal, Spices, Oil)',
    vendor_name: 'Metro Cash & Carry',
    created_at: '2025-03-01T10:00:00Z',
    building_name: 'Tower A',
  },
  {
    id: 'exp-2',
    property_id: 'prop-1',
    building_id: 'bld-1',
    category: 'Electricity & Utilities',
    amount: 16800,
    expense_date: '2025-03-02',
    description: 'BESCOM Commercial Grid Power Bill',
    vendor_name: 'BESCOM Bengaluru',
    created_at: '2025-03-02T11:00:00Z',
    building_name: 'Tower A',
  },
  {
    id: 'exp-3',
    property_id: 'prop-1',
    category: 'High-speed Internet',
    amount: 4500,
    expense_date: '2025-03-03',
    description: 'ACT Fibernet 1 Gbps Dual Commercial Leased Line',
    vendor_name: 'ACT Fibernet',
    created_at: '2025-03-03T12:00:00Z',
  },
  {
    id: 'exp-4',
    property_id: 'prop-1',
    category: 'Staff Salaries',
    amount: 32000,
    expense_date: '2025-03-05',
    description: 'Head Chef and Security Guard monthly payout',
    vendor_name: 'Internal Staff',
    created_at: '2025-03-05T16:00:00Z',
  },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-1',
    property_id: 'prop-1',
    tenant_id: 'ten-1',
    title: 'AC cooling issue in Room 101',
    description: 'The air conditioner in 101 runs but does not cool properly. Needs gas refill / filter clean.',
    category: 'Electrical',
    priority: 'high',
    status: 'in_progress',
    cost: 1200,
    resolution_notes: 'Technician visited, ordered capacitor part',
    created_at: '2025-03-04T14:30:00Z',
    tenant_name: 'Aarav Sharma',
    room_number: '101',
    assigned_staff_name: 'Ramesh Kumar (Maintenance)',
  },
  {
    id: 'cmp-2',
    property_id: 'prop-1',
    tenant_id: 'ten-3',
    title: 'Shower head leak in bathroom',
    description: 'Bathroom shower mixer continuously drips water even when turned off.',
    category: 'Plumbing',
    priority: 'medium',
    status: 'assigned',
    created_at: '2025-03-05T09:15:00Z',
    tenant_name: 'Pooja Hegde',
    room_number: '201',
    assigned_staff_name: 'Mahesh (Plumber)',
  },
  {
    id: 'cmp-3',
    property_id: 'prop-1',
    tenant_id: 'ten-2',
    title: 'Wi-Fi mesh node 2 disconnected',
    description: 'Internet connectivity dropped on 1st floor corridor router.',
    category: 'Wi-Fi',
    priority: 'urgent',
    status: 'resolved',
    cost: 0,
    resolution_notes: 'Rebooted mesh router and updated static gateway IP',
    resolved_at: '2025-03-04T18:00:00Z',
    created_at: '2025-03-04T16:00:00Z',
    tenant_name: 'Rohan Mehta',
    room_number: '101',
    assigned_staff_name: 'Ramesh Kumar (Maintenance)',
  },
  {
    id: 'cmp-4',
    property_id: 'prop-1',
    tenant_id: 'ten-4',
    title: 'Wardrobe door hinge loose',
    description: 'Right side door hinge came loose, needs tightening screws.',
    category: 'Carpentry',
    priority: 'low',
    status: 'new',
    created_at: '2025-03-05T12:00:00Z',
    tenant_name: 'Sneha Rao',
    room_number: '102',
  },
];

const INITIAL_MESS_MENUS: MessMenu[] = [
  {
    id: 'menu-1',
    building_id: 'bld-1',
    day_of_week: 'Monday',
    breakfast: 'Poha, Boiled Eggs / Banana, Tea & Coffee',
    lunch: 'Rajma Masala, Steamed Rice, Tawa Roti, Mix Veg Raita, Salad',
    snacks: 'Samosa / Biscuit with Kadak Chai',
    dinner: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati, Gulab Jamun',
    special_notes: 'Monday Sweet: Hot Gulab Jamun at dinner',
  },
  {
    id: 'menu-2',
    building_id: 'bld-1',
    day_of_week: 'Tuesday',
    breakfast: 'Masala Idli & Medu Vada, Coconut Chutney, Sambar',
    lunch: 'Kadhi Pakora, Jeera Aloo, Steamed Basmati Rice, Chapati',
    snacks: 'Veg Cutlet with Green Mint Chutney',
    dinner: 'Egg Curry / Aloo Matar, Dal Fry, Phulkas, Steamed Rice',
  },
  {
    id: 'menu-3',
    building_id: 'bld-1',
    day_of_week: 'Wednesday',
    breakfast: 'Aloo Paratha with White Butter, Pickle & Curd',
    lunch: 'Chole Masala, Amritsari Kulcha / Rice, Boondi Raita',
    snacks: 'Pani Puri / Sev Puri stall',
    dinner: 'Chicken Curry (Special) / Shahi Paneer, Biryani Rice, Raita',
    special_notes: 'Wednesday Non-Veg Special Feast!',
  },
  {
    id: 'menu-4',
    building_id: 'bld-1',
    day_of_week: 'Thursday',
    breakfast: 'Upma with Chutney, Toast & Jam, Fruits',
    lunch: 'Moong Dal Khichdi, Kadhi, Papad, Achaar, Bhindi Masala',
    snacks: 'Onion Pakoda & Masala Tea',
    dinner: 'Kadhai Paneer, Yellow Dal, Butter Roti, Veg Pulao',
  },
  {
    id: 'menu-5',
    building_id: 'bld-1',
    day_of_week: 'Friday',
    breakfast: 'Mysore Masala Dosa, Red Chutney, Sambar',
    lunch: 'Dal Makhani, Mix Veg, Steamed Rice, Garlic Naan',
    snacks: 'French Fries / Maggi with Coffee',
    dinner: 'Fish Curry / Malai Kofta, Jeera Rice, Rumali Roti, Kheer',
  },
  {
    id: 'menu-6',
    building_id: 'bld-1',
    day_of_week: 'Saturday',
    breakfast: 'Puri Bhaji with Halwa, Masala Buttermilk',
    lunch: 'Veg Fried Rice, Veg Manchurian, Spring Rolls',
    snacks: 'Pav Bhaji with Extra Butter',
    dinner: 'Paneer Tikka Masala, Dal Palak, Phulkas, Rice, Ice Cream',
  },
  {
    id: 'menu-7',
    building_id: 'bld-1',
    day_of_week: 'Sunday',
    breakfast: 'Chole Bhature with Pickled Green Chillies',
    lunch: 'Hyderabadi Dum Biryani (Chicken / Veg), Mirchi Ka Salan, Raita',
    snacks: 'Filter Coffee / Tea with Cookies',
    dinner: 'Light Khichdi, Aloo Gobi, Roti, Fruit Custard',
    special_notes: 'Sunday Mega Biryani Lunch!',
  },
];

const INITIAL_STAFF: Staff[] = [
  {
    id: 'st-1',
    property_id: 'prop-1',
    name: 'Suresh Gowda',
    role: 'manager',
    phone: '9845099881',
    salary: 28000,
    joining_date: '2024-06-01',
    status: 'active',
  },
  {
    id: 'st-2',
    property_id: 'prop-1',
    name: 'Ramesh Kumar',
    role: 'maintenance',
    phone: '9845011992',
    salary: 18000,
    joining_date: '2024-08-15',
    status: 'active',
  },
  {
    id: 'st-3',
    property_id: 'prop-1',
    name: 'Santosh Yadav',
    role: 'cook',
    phone: '9845033441',
    salary: 22000,
    joining_date: '2024-07-01',
    status: 'active',
  },
  {
    id: 'st-4',
    property_id: 'prop-1',
    name: 'Lata Devi',
    role: 'cleaner',
    phone: '9845066552',
    salary: 12000,
    joining_date: '2024-09-01',
    status: 'active',
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-1',
    property_id: 'prop-1',
    assigned_to: 'st-2',
    title: 'Replace overhead water tank sensor',
    description: 'Automatic level controller in Tower A requires float switch replacement',
    status: 'todo',
    priority: 'high',
    due_date: '2025-03-08',
    created_at: '2025-03-04T10:00:00Z',
    assigned_staff_name: 'Ramesh Kumar (Maintenance)',
  },
  {
    id: 'tsk-2',
    property_id: 'prop-1',
    assigned_to: 'st-4',
    title: 'Deep clean vacant Room 102 Bed B',
    description: 'Sanitize mattress, wash curtains, polish bathroom tiles for new tenant move-in',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2025-03-06',
    created_at: '2025-03-05T09:00:00Z',
    assigned_staff_name: 'Lata Devi (Cleaner)',
  },
  {
    id: 'tsk-3',
    property_id: 'prop-1',
    assigned_to: 'st-1',
    title: 'Distribute March bulk rent receipts',
    description: 'Send automated WhatsApp payment receipts and invoice PDFs to all active tenants',
    status: 'done',
    priority: 'high',
    due_date: '2025-03-05',
    created_at: '2025-03-01T10:00:00Z',
    assigned_staff_name: 'Suresh Gowda (Manager)',
  },
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    property_id: 'prop-1',
    title: 'Scheduled Water Tank Cleaning - Saturday 10 AM to 1 PM',
    content: 'Dear residents, overhead water tanks will undergo quarterly ultrasonic sterilization this Saturday. Please store adequate water beforehand.',
    target: 'all',
    is_urgent: true,
    created_at: '2025-03-04T12:00:00Z',
    read_count: 14,
  },
  {
    id: 'not-2',
    property_id: 'prop-1',
    title: 'Holi Celebrations & Special Buffet Lunch',
    content: 'Join us on the rooftop on March 14 for dry organic colours, music, thandai, and festive Gujarati & North Indian buffet lunch!',
    target: 'all',
    is_urgent: false,
    created_at: '2025-03-02T15:00:00Z',
    read_count: 18,
  },
];

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
  };
}
