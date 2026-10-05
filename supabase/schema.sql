-- ====================================================================
-- PGOS (PG Operating System) - Complete Supabase Database Schema
-- Multi-tenant, Multi-property Architecture with Full RLS
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role_enum as enum ('owner', 'manager', 'caretaker', 'cook', 'security', 'cleaner', 'maintenance', 'tenant');
create type bed_status_enum as enum ('available', 'occupied', 'reserved', 'maintenance');
create type payment_status_enum as enum ('paid', 'pending', 'overdue', 'partially_paid');
create type payment_type_enum as enum ('rent', 'electricity', 'mess', 'deposit', 'maintenance', 'other');
create type complaint_status_enum as enum ('new', 'assigned', 'in_progress', 'resolved');
create type complaint_priority_enum as enum ('low', 'medium', 'high', 'urgent');
create type task_status_enum as enum ('todo', 'in_progress', 'done');
create type notice_target_enum as enum ('all', 'building', 'room');

-- 3. OWNERS TABLE
create table if not exists owners (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  phone text,
  business_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. PROPERTIES TABLE
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  address text not null,
  city text not null,
  state text,
  pincode text,
  contact_phone text,
  contact_email text,
  cover_image text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. PROPERTY FEATURE FLAGS
create table if not exists property_features (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null unique,
  mess_enabled boolean default true,
  electricity_billing_enabled boolean default true,
  staff_management_enabled boolean default true,
  biometric_sync_enabled boolean default false,
  visitor_qr_enabled boolean default false,
  whatsapp_reminders_enabled boolean default true,
  updated_at timestamptz default now()
);

-- 6. BUILDINGS TABLE
create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  name text not null,
  floors_count integer default 1,
  has_mess boolean default true,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. ROOMS TABLE
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete cascade not null,
  room_number text not null,
  floor integer default 1,
  sharing_type text default 'double', -- single, double, triple, four, other
  total_beds integer default 2,
  base_rent numeric not null default 7500,
  has_attached_bathroom boolean default true,
  has_balcony boolean default false,
  has_ac boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. BEDS TABLE
create table if not exists beds (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  room_id uuid references rooms(id) on delete cascade not null,
  bed_number text not null, -- e.g., Bed A, Bed B
  status bed_status_enum default 'available',
  monthly_rent numeric not null default 7500,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. TENANTS TABLE
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete cascade not null,
  room_id uuid references rooms(id) on delete cascade not null,
  bed_id uuid references beds(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  id_proof_type text,
  id_proof_number text,
  emergency_contact_name text,
  emergency_contact_phone text,
  college_name text,
  course text,
  joining_date date not null default current_date,
  check_out_date date,
  monthly_rent numeric not null,
  security_deposit numeric not null default 0,
  agreement_status text default 'signed', -- pending, signed, expired
  status text default 'active', -- active, checked_out, notice_period
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 10. TENANT LEDGER
create table if not exists tenant_ledger (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  property_id uuid references properties(id) on delete cascade not null,
  entry_type text not null, -- 'debit' or 'credit'
  category text not null,   -- rent, electricity, mess, late_fee, discount, payment, advance
  amount numeric not null,
  balance numeric,
  notes text,
  created_at timestamptz default now()
);

-- 11. DEPOSITS
create table if not exists deposits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  property_id uuid references properties(id) on delete cascade not null,
  amount numeric not null,
  status text default 'held', -- held, refunded, partially_refunded
  deduction numeric default 0,
  refund_amount numeric default 0,
  notes text,
  created_at timestamptz default now()
);

-- 12. PAYMENTS TABLE
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  amount numeric not null,
  payment_type payment_type_enum default 'rent',
  for_month text not null, -- 'YYYY-MM'
  payment_date date default current_date,
  status payment_status_enum default 'paid',
  payment_mode text default 'UPI', -- UPI, Cash, Bank Transfer, Card
  transaction_ref text,
  receipt_number text unique,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 13. EXPENSES TABLE
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete set null,
  category text not null, -- Groceries, Electricity, Water, Maintenance, Wi-Fi, Salary, Cleaning, Other
  amount numeric not null,
  expense_date date default current_date,
  description text,
  vendor_name text,
  receipt_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. COMPLAINTS TABLE
create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  assigned_to uuid,
  title text not null,
  description text not null,
  category text default 'Plumbing', -- Plumbing, Electrical, Wi-Fi, Cleaning, Noise, Mess, Other
  priority complaint_priority_enum default 'medium',
  status complaint_status_enum default 'new',
  cost numeric default 0,
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 15. MESS MENUS TABLE
create table if not exists mess_menus (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade not null,
  day_of_week text not null, -- Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
  breakfast text,
  lunch text,
  snacks text,
  dinner text,
  special_notes text,
  updated_at timestamptz default now(),
  unique(building_id, day_of_week)
);

-- 16. MESS ATTENDANCE TABLE
create table if not exists mess_attendance (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  date date default current_date,
  breakfast boolean default true,
  lunch boolean default true,
  dinner boolean default true,
  created_at timestamptz default now(),
  unique(tenant_id, date)
);

-- 17. MESS EXPENSES TABLE
create table if not exists mess_expenses (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete cascade not null,
  vendor_id uuid,
  category text default 'Vegetables', -- Vegetables, Dairy, Groceries, Gas, Meat, Miscellaneous
  amount numeric not null,
  date date default current_date,
  invoice_url text,
  notes text,
  created_at timestamptz default now()
);

-- 18. STAFF TABLE
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  role user_role_enum not null default 'caretaker',
  phone text not null,
  salary numeric default 0,
  joining_date date default current_date,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 19. TASKS TABLE
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  assigned_to uuid references staff(id) on delete set null,
  title text not null,
  description text,
  status task_status_enum default 'todo',
  priority complaint_priority_enum default 'medium',
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 20. NOTICES TABLE
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete set null,
  title text not null,
  content text not null,
  target notice_target_enum default 'all',
  is_urgent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 21. NOTICE READS TABLE
create table if not exists notice_reads (
  id uuid primary key default gen_random_uuid(),
  notice_id uuid references notices(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  read_at timestamptz default now(),
  unique(notice_id, tenant_id)
);

-- 22. VENDORS TABLE
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  name text not null,
  phone text,
  service_type text, -- Dairy, Vegetables, RO Service, Internet, Plumber, Electrician
  notes text,
  created_at timestamptz default now()
);

-- 23. ELECTRICITY READINGS TABLE
create table if not exists electricity_readings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade not null,
  property_id uuid references properties(id) on delete cascade not null,
  reading_date date default current_date,
  previous_reading numeric default 0,
  current_reading numeric default 0,
  units_consumed numeric default 0,
  rate_per_unit numeric default 10,
  total_amount numeric default 0,
  is_billed boolean default false,
  created_at timestamptz default now()
);

-- 24. VACANCY LEADS TABLE
create table if not exists vacancy_leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  name text not null,
  phone text not null,
  source text default 'Walk-in', -- Justdial, Google, Walk-in, Referral, Website
  visit_date date default current_date,
  sharing_preference text default 'Double',
  status text default 'inquiry', -- inquiry, visited, converted, lost
  notes text,
  created_at timestamptz default now()
);

-- 25. DOCUMENTS TABLE
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade not null,
  doc_type text default 'id_proof', -- id_proof, agreement, police_verification, other
  file_url text not null,
  file_name text,
  uploaded_at timestamptz default now()
);

-- 26. NOTIFICATIONS TABLE
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references properties(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'rent_due', -- rent_due, complaint, notice, task
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 27. AUDIT LOG TABLE
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  property_id uuid references properties(id) on delete cascade,
  table_name text not null,
  record_id uuid,
  action text not null, -- insert, update, delete
  changes jsonb,
  created_at timestamptz default now()
);

-- 28. TIFFIN ORDERS TABLE (Daily Student Packed Tiffin & Evening Return Verification)
create table if not exists tiffin_orders (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  building_id uuid references buildings(id) on delete set null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  tenant_name text not null,
  room_number text not null,
  bed_number text,
  phone text,
  college_name text not null,
  date date default current_date not null,
  meal_type text default 'lunch' not null,
  delivery_time text not null, -- '07:30 AM', '08:00 AM', '08:30 AM', '12:15 PM'
  status text default 'requested' not null, -- 'requested', 'prepared', 'dispatched', 'pending_return', 'returned'
  notes text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, date, meal_type)
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table owners enable row level security;
alter table properties enable row level security;
alter table property_features enable row level security;
alter table buildings enable row level security;
alter table tiffin_orders enable row level security;
alter table rooms enable row level security;
alter table beds enable row level security;
alter table tenants enable row level security;
alter table tenant_ledger enable row level security;
alter table deposits enable row level security;
alter table payments enable row level security;
alter table expenses enable row level security;
alter table complaints enable row level security;
alter table mess_menus enable row level security;
alter table mess_attendance enable row level security;
alter table mess_expenses enable row level security;
alter table staff enable row level security;
alter table tasks enable row level security;
alter table notices enable row level security;
alter table notice_reads enable row level security;
alter table vendors enable row level security;
alter table electricity_readings enable row level security;
alter table vacancy_leads enable row level security;
alter table documents enable row level security;
alter table notifications enable row level security;
alter table audit_log enable row level security;

-- Owner Policies
create policy "Owners can view own profile" on owners for select using (auth.uid() = id);
create policy "Owners can update own profile" on owners for update using (auth.uid() = id);
create policy "Owners can insert own profile" on owners for insert with check (auth.uid() = id);

-- Properties Policies (Owner has full CRUD)
create policy "Owners manage own properties" on properties for all using (auth.uid() = owner_id);

-- Property Features Policies
create policy "Owners manage property features" on property_features for all using (
  exists (select 1 from properties where properties.id = property_features.property_id and properties.owner_id = auth.uid())
);

-- Buildings Policies
create policy "Owners manage buildings" on buildings for all using (
  exists (select 1 from properties where properties.id = buildings.property_id and properties.owner_id = auth.uid())
);

-- Rooms Policies
create policy "Owners manage rooms" on rooms for all using (
  exists (select 1 from properties where properties.id = rooms.property_id and properties.owner_id = auth.uid())
);

-- Beds Policies
create policy "Owners manage beds" on beds for all using (
  exists (select 1 from properties where properties.id = beds.property_id and properties.owner_id = auth.uid())
);

-- Tenants Policies
create policy "Owners manage tenants" on tenants for all using (
  exists (select 1 from properties where properties.id = tenants.property_id and properties.owner_id = auth.uid())
);
create policy "Tenants can view own profile" on tenants for select using (auth.uid() = user_id);

-- Payments Policies
create policy "Owners manage payments" on payments for all using (
  exists (select 1 from properties where properties.id = payments.property_id and properties.owner_id = auth.uid())
);
create policy "Tenants can view own payments" on payments for select using (
  exists (select 1 from tenants where tenants.id = payments.tenant_id and tenants.user_id = auth.uid())
);

-- Expenses Policies
create policy "Owners manage expenses" on expenses for all using (
  exists (select 1 from properties where properties.id = expenses.property_id and properties.owner_id = auth.uid())
);

-- Complaints Policies
create policy "Owners manage complaints" on complaints for all using (
  exists (select 1 from properties where properties.id = complaints.property_id and properties.owner_id = auth.uid())
);
create policy "Tenants manage own complaints" on complaints for all using (
  exists (select 1 from tenants where tenants.id = complaints.tenant_id and tenants.user_id = auth.uid())
);

-- Notices Policies
create policy "Owners manage notices" on notices for all using (
  exists (select 1 from properties where properties.id = notices.property_id and properties.owner_id = auth.uid())
);
create policy "Tenants can view notices" on notices for select using (
  exists (select 1 from tenants where tenants.property_id = notices.property_id and tenants.user_id = auth.uid())
);

-- Tiffin Orders Policies
create policy "Owners and staff manage tiffins" on tiffin_orders for all using (true) with check (true);

-- ====================================================================
-- AUTOMATIC RECEIPT NUMBER GENERATOR TRIGGER
-- ====================================================================

create or replace function generate_payment_receipt_number()
returns trigger as $$
begin
  if new.receipt_number is null then
    new.receipt_number := 'RCP-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6);
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger set_payment_receipt_number
before insert on payments
for each row
execute function generate_payment_receipt_number();
