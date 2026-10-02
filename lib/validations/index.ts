import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(2, 'Property name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  pincode: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const buildingSchema = z.object({
  name: z.string().min(1, 'Building name is required'),
  floors_count: z.coerce.number().min(1, 'Must have at least 1 floor'),
  has_mess: z.boolean().default(true),
  description: z.string().optional(),
});

export const roomSchema = z.object({
  room_number: z.string().min(1, 'Room number is required'),
  floor: z.coerce.number().default(1),
  sharing_type: z.string().default('double'),
  total_beds: z.coerce.number().min(1).max(10).default(2),
  base_rent: z.coerce.number().min(0, 'Rent must be positive'),
  has_attached_bathroom: z.boolean().default(true),
  has_balcony: z.boolean().default(false),
  has_ac: z.boolean().default(false),
});

export const tenantSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  property_id: z.string().min(1, 'Select a property'),
  building_id: z.string().min(1, 'Select a building'),
  room_id: z.string().min(1, 'Select a room'),
  bed_id: z.string().min(1, 'Select a bed'),
  joining_date: z.string().min(1, 'Joining date is required'),
  monthly_rent: z.coerce.number().min(0, 'Monthly rent must be positive'),
  security_deposit: z.coerce.number().min(0, 'Deposit must be non-negative'),
  id_proof_type: z.string().optional(),
  id_proof_number: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  agreement_status: z.enum(['pending', 'signed', 'expired']).default('signed'),
});

export const paymentSchema = z.object({
  property_id: z.string().min(1, 'Select a property'),
  tenant_id: z.string().min(1, 'Select a tenant'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  payment_type: z.enum(['rent', 'electricity', 'mess', 'deposit', 'maintenance', 'other']).default('rent'),
  for_month: z.string().min(4, 'Month is required'),
  payment_date: z.string().min(1, 'Date is required'),
  payment_mode: z.string().default('UPI'),
  transaction_ref: z.string().optional(),
  notes: z.string().optional(),
});

export const expenseSchema = z.object({
  property_id: z.string().min(1, 'Select a property'),
  building_id: z.string().optional().or(z.literal('')),
  category: z.string().min(1, 'Select category'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  expense_date: z.string().min(1, 'Date is required'),
  description: z.string().min(2, 'Description is required'),
  vendor_name: z.string().optional(),
});

export const complaintSchema = z.object({
  property_id: z.string().min(1, 'Select a property'),
  tenant_id: z.string().min(1, 'Select a tenant'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  category: z.string().default('Plumbing'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const noticeSchema = z.object({
  property_id: z.string().min(1, 'Select a property'),
  building_id: z.string().optional().or(z.literal('')),
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(5, 'Content is required'),
  target: z.enum(['all', 'building', 'room']).default('all'),
  is_urgent: z.boolean().default(false),
});

export const staffSchema = z.object({
  property_id: z.string().min(1, 'Select a property'),
  name: z.string().min(2, 'Name is required'),
  role: z.enum(['owner', 'manager', 'caretaker', 'cook', 'security', 'cleaner', 'maintenance']).default('caretaker'),
  phone: z.string().min(10, 'Valid phone is required'),
  salary: z.coerce.number().min(0).default(12000),
  joining_date: z.string().default(() => new Date().toISOString().split('T')[0]),
});

export const taskSchema = z.object({
  property_id: z.string().min(1, 'Select a property'),
  assigned_to: z.string().optional().or(z.literal('')),
  title: z.string().min(3, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().optional(),
});
