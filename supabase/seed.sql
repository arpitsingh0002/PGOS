-- ====================================================================
-- PGOS (PG Operating System) - Production Seed Data & Public Policies
-- Run this in the Supabase SQL Editor to populate sample properties,
-- rooms, beds, tenants, staff, and enable public marketplace viewing.
-- ====================================================================

-- 1. Ensure Public Read Policies for Prospective Tenants & Marketplace (/pg/[id])
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Public can view active properties'
  ) THEN
    CREATE POLICY "Public can view active properties" ON properties FOR SELECT USING (status = 'active');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'buildings' AND policyname = 'Public can view buildings'
  ) THEN
    CREATE POLICY "Public can view buildings" ON buildings FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Public can view rooms'
  ) THEN
    CREATE POLICY "Public can view rooms" ON rooms FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'beds' AND policyname = 'Public can view beds'
  ) THEN
    CREATE POLICY "Public can view beds" ON beds FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mess_menus' AND policyname = 'Public can view mess menus'
  ) THEN
    CREATE POLICY "Public can view mess menus" ON mess_menus FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tiffin_orders' AND policyname = 'Public can manage tiffins'
  ) THEN
    CREATE POLICY "Public can manage tiffins" ON tiffin_orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 2. SEED OWNER PROFILE
-- We link the owner profile to the first user found in auth.users, or create a demo user
DO $$
DECLARE
  v_owner_id uuid;
  v_prop1_id uuid := '00000000-0000-4000-8000-000000000001'::uuid;
  v_prop2_id uuid := '00000000-0000-4000-8000-000000000002'::uuid;
  v_bld1_id uuid  := '00000000-0000-4000-8000-000000000011'::uuid;
  v_bld2_id uuid  := '00000000-0000-4000-8000-000000000012'::uuid;
  v_room101_id uuid := '00000000-0000-4000-8000-000000000101'::uuid;
  v_room102_id uuid := '00000000-0000-4000-8000-000000000102'::uuid;
  v_bed101a_id uuid := '00000000-0000-4000-8000-000000001011'::uuid;
  v_bed101b_id uuid := '00000000-0000-4000-8000-000000001012'::uuid;
  v_bed102a_id uuid := '00000000-0000-4000-8000-000000001021'::uuid;
  v_bed102b_id uuid := '00000000-0000-4000-8000-000000001022'::uuid;
  v_tenant1_id uuid := '00000000-0000-4000-8000-000000002001'::uuid;
  v_tenant2_id uuid := '00000000-0000-4000-8000-000000002002'::uuid;
  v_staff1_id  uuid := '00000000-0000-4000-8000-000000003001'::uuid;
  v_staff2_id  uuid := '00000000-0000-4000-8000-000000003002'::uuid;
BEGIN
  -- Grab existing auth user or fall back
  SELECT id INTO v_owner_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  IF v_owner_id IS NULL THEN
    v_owner_id := '76c47299-9ca4-48f7-9741-26e7211b1d16'::uuid;
  END IF;

  -- Insert/update owner
  INSERT INTO owners (id, email, full_name, phone, business_name)
  VALUES (
    v_owner_id,
    'owner@pgos.com',
    'Anand Kumar',
    '+91 98765 43210',
    'Royal Living Hostels Pvt Ltd'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    business_name = EXCLUDED.business_name;

  -- 3. INSERT PROPERTIES
  INSERT INTO properties (id, owner_id, name, address, city, state, pincode, contact_phone, contact_email, cover_image, status)
  VALUES
    (v_prop1_id, v_owner_id, 'Royal Palms Luxury Living', '4th Cross, 5th Block, Koramangala', 'Bengaluru', 'Karnataka', '560095', '+91 98765 43210', 'care@royalpalmspg.com', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'active'),
    (v_prop2_id, v_owner_id, 'Silicon Oasis Co-living', 'Sector 2, HSR Layout, Near BDA Complex', 'Bengaluru', 'Karnataka', '560102', '+91 98450 11223', 'hsr@siliconoasis.in', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', 'active')
  ON CONFLICT (id) DO NOTHING;

  -- 4. INSERT PROPERTY FEATURES
  INSERT INTO property_features (property_id, mess_enabled, electricity_billing_enabled, staff_management_enabled, biometric_sync_enabled, visitor_qr_enabled, whatsapp_reminders_enabled)
  VALUES
    (v_prop1_id, true, true, true, false, true, true),
    (v_prop2_id, true, true, true, false, false, true)
  ON CONFLICT (property_id) DO NOTHING;

  -- 5. INSERT BUILDINGS
  INSERT INTO buildings (id, property_id, name, floors_count, has_mess, description)
  VALUES
    (v_bld1_id, v_prop1_id, 'Tower A (Executive Wing)', 3, true, 'Premium air-conditioned suites with private elevator access'),
    (v_bld2_id, v_prop1_id, 'Tower B (Standard Wing)', 3, false, 'Cozy budget-friendly sharing rooms with dedicated study lounges')
  ON CONFLICT (id) DO NOTHING;

  -- 6. INSERT ROOMS
  INSERT INTO rooms (id, property_id, building_id, room_number, floor, sharing_type, total_beds, base_rent, has_attached_bathroom, has_balcony, has_ac)
  VALUES
    (v_room101_id, v_prop1_id, v_bld1_id, '101', 1, 'double', 2, 8500, true, true, true),
    (v_room102_id, v_prop1_id, v_bld1_id, '102', 1, 'double', 2, 8000, true, false, true)
  ON CONFLICT (id) DO NOTHING;

  -- 7. INSERT BEDS
  INSERT INTO beds (id, property_id, room_id, bed_number, status, monthly_rent)
  VALUES
    (v_bed101a_id, v_prop1_id, v_room101_id, 'Bed A', 'occupied', 8500),
    (v_bed101b_id, v_prop1_id, v_room101_id, 'Bed B', 'occupied', 8500),
    (v_bed102a_id, v_prop1_id, v_room102_id, 'Bed A', 'occupied', 8000),
    (v_bed102b_id, v_prop1_id, v_room102_id, 'Bed B', 'available', 8000)
  ON CONFLICT (id) DO NOTHING;

  -- 8. INSERT TENANTS
  INSERT INTO tenants (id, property_id, building_id, room_id, bed_id, full_name, phone, email, college_name, course, monthly_rent, security_deposit, agreement_status, status)
  VALUES
    (v_tenant1_id, v_prop1_id, v_bld1_id, v_room101_id, v_bed101a_id, 'Aarav Sharma', '+91 98111 22334', 'aarav.sharma@techcorp.com', 'BMS College of Engineering', 'B.Tech CSE (3rd Year)', 8500, 17000, 'signed', 'active'),
    (v_tenant2_id, v_prop1_id, v_bld1_id, v_room101_id, v_bed101b_id, 'Rahul Verma', '+91 98333 44556', 'rahul.verma@startup.io', 'PES University (RR Campus)', 'B.Tech AI & Data Science', 8500, 17000, 'signed', 'active')
  ON CONFLICT (id) DO UPDATE SET
    college_name = EXCLUDED.college_name,
    course = EXCLUDED.course;

  -- 9. INSERT PAYMENTS
  INSERT INTO payments (property_id, tenant_id, amount, payment_type, for_month, status, payment_mode, receipt_number)
  VALUES
    (v_prop1_id, v_tenant1_id, 8500, 'rent', '2025-03', 'paid', 'UPI', 'RCP-202503-01044'),
    (v_prop1_id, v_tenant2_id, 8500, 'rent', '2025-03', 'paid', 'UPI', 'RCP-202503-01045')
  ON CONFLICT DO NOTHING;

  -- 10. INSERT EXPENSES
  INSERT INTO expenses (property_id, building_id, category, amount, description, vendor_name)
  VALUES
    (v_prop1_id, v_bld1_id, 'Groceries', 28500, 'March Week 1 bulk pantry staples, dairy and vegetables', 'Metro Cash & Carry'),
    (v_prop1_id, v_bld1_id, 'Wi-Fi', 4800, 'Airtel Broadband 1Gbps Commercial Fiber - Dual Line', 'Airtel India'),
    (v_prop1_id, v_bld1_id, 'Electricity', 18450, 'Bescom Monthly Commercial Power Tariff', 'BESCOM')
  ON CONFLICT DO NOTHING;

  -- 11. INSERT COMPLAINTS
  INSERT INTO complaints (property_id, tenant_id, title, description, category, priority, status)
  VALUES
    (v_prop1_id, v_tenant1_id, 'AC remote display flickering', 'Remote controller shows faint display numbers in Room 101', 'Electrical', 'low', 'resolved'),
    (v_prop1_id, v_tenant2_id, 'Wi-Fi speed dip during peak evening hours', 'Buffering during video calls between 8 PM - 10 PM', 'Wi-Fi', 'medium', 'in_progress')
  ON CONFLICT DO NOTHING;

  -- 12. INSERT STAFF
  INSERT INTO staff (id, property_id, name, role, phone, salary)
  VALUES
    (v_staff1_id, v_prop1_id, 'Suresh Gowda', 'manager', '+91 97411 00221', 32000),
    (v_staff2_id, v_prop1_id, 'Ramesh Kumar', 'maintenance', '+91 97422 11332', 22000)
  ON CONFLICT (id) DO NOTHING;

  -- 13. INSERT TASKS
  INSERT INTO tasks (property_id, assigned_to, title, description, status, priority, due_date)
  VALUES
    (v_prop1_id, v_staff2_id, 'Replace overhead water tank sensor', 'Automatic level controller in Tower A requires float switch replacement', 'todo', 'high', current_date + interval '3 days'),
    (v_prop1_id, v_staff1_id, 'Distribute March bulk rent receipts', 'Send automated WhatsApp payment receipts and invoice PDFs to all active tenants', 'done', 'high', current_date)
  ON CONFLICT DO NOTHING;

  -- 14. INSERT NOTICES
  INSERT INTO notices (property_id, title, content, target, is_urgent)
  VALUES
    (v_prop1_id, 'Scheduled Water Tank Cleaning - Saturday 10 AM to 1 PM', 'Dear residents, overhead water tanks will undergo quarterly ultrasonic sterilization this Saturday. Please store adequate water beforehand.', 'all', true),
    (v_prop1_id, 'Holi Celebrations & Special Buffet Lunch', 'Join us on the rooftop for dry organic colours, music, and festive buffet lunch!', 'all', false)
  ON CONFLICT DO NOTHING;

  -- 15. INSERT MESS MENUS
  INSERT INTO mess_menus (building_id, day_of_week, breakfast, lunch, snacks, dinner, special_notes)
  VALUES
    (v_bld1_id, 'Monday', 'Masala Dosa, Sambar, Coconut Chutney, Filter Coffee / Tea', 'Steamed Rice, Dal Makhani, Paneer Butter Masala, Roti, Salad, Curd', 'Veg Cutlet, Mint Sauce, Hot Masala Chai', 'Phulka, Aloo Gobi Matar, Tadka Dal, Jeera Rice, Gulab Jamun', 'Pure cow milk dairy used'),
    (v_bld1_id, 'Tuesday', 'Poha with Peanuts, Boiled Sprouts, Sev, Tea / Coffee', 'Rajma Chawal, Mix Veg Curry, Chapati, Papad, Buttermilk', 'Onion Pakoda, Ginger Tea', 'Butter Naan, Kadai Paneer, Yellow Dal Fry, Steamed Rice, Ice Cream', 'Special ice cream night')
  ON CONFLICT (building_id, day_of_week) DO NOTHING;

  -- 16. INSERT SAMPLE TIFFIN ORDERS (Categorized by College)
  INSERT INTO tiffin_orders (property_id, building_id, tenant_id, tenant_name, room_number, bed_number, phone, college_name, date, meal_type, delivery_time, status, notes)
  VALUES
    (v_prop1_id, v_bld1_id, v_tenant1_id, 'Aarav Sharma', '101', 'Bed A', '+91 98111 22334', 'BMS College of Engineering', current_date, 'lunch', '08:00 AM', 'pending_return', 'Extra roti requested'),
    (v_prop1_id, v_bld1_id, v_tenant2_id, 'Rahul Verma', '101', 'Bed B', '+91 98333 44556', 'PES University (RR Campus)', current_date, 'lunch', '07:30 AM', 'pending_return', 'Pack curd separately')
  ON CONFLICT (tenant_id, date, meal_type) DO NOTHING;

END $$;
