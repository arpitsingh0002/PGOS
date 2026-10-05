# 🚀 PGOS — Modern PG, Hostel & Co-living Operating System

PGOS is an enterprise-grade, multi-tenant SaaS platform engineered specifically for Indian PG (Paying Guest), hostel, and co-living operators. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL with Row Level Security)**, fully optimized for standalone deployment on **Render** or **Vercel**.

---

## 🌟 Key Modules & Capabilities

### 1. 🛡️ Property Manager Operations Command Center (`/manager`)
- **Daily Staff Attendance Tracker**:
  - 1-click status controls for every staff member (**Present**, **Half Day**, **Absent**, **On Leave**).
  - Shift time logging (`08:00 AM - 08:00 PM`), salary tracking, and direct phone/WhatsApp dialers.
  - Subordinate staff onboarding modal (cleaners, security, cooks, caretakers).
- **Complaints & Maintenance Dispatch**:
  - Filter tickets by status (`New`, `In Progress`, `Resolved`) and priority (**Urgent**, **High**, **Medium**, **Low**).
  - Front-desk intake modal for logging complaints reported verbally at reception.
  - Inline ticket progression with mandatory resolution notes upon closing.
- **Required Supplies & Inventory Indents**:
  - Submit procurement requests with **Need Priority** tags:
    - 🚨 **URGENT NEED**: Emergency supplies (LPG gas cylinders, water pump capacitors, geyser heating coils) with pulsing alert banners.
    - 📦 **NORMAL NEED**: Routine replenishment (cleaning phenyl, spare tap washers, bedsheets).
  - 1-click **"Mark Received"** action that automatically increments active on-site stock.
- **Student & Resident Directory**:
  - Live allocation directory: Room number, Bed ID, Institution/Company, and Monthly Rent.
  - Immediate access to Parent/Guardian Emergency Contacts with 1-click call and WhatsApp reminders.
- **Rent Collection & Cash Desk**:
  - Expected vs Collected vs Overdue monthly balance tracker.
  - Record in-person cash or UPI payments with instant receipt generation.
- **Shift SOP Checklist & Main Gate Visitor Passbook**:
  - Daily manager shift SOP checklist (water tank inspection, mess audit, cash reconciliation, night gate lockup).
  - Digital visitor register with check-in timestamps and 1-click checkout.

---

### 2. 📦 Owner Central Inventory & Supplies Audit (`/inventory`)
- Central multi-branch stock monitoring across 6 categories (Cleaning, Electrical, Plumbing, Mess/Kitchen, Linens, Safety).
- Emergency shortage alert banner highlighting urgent requisitions submitted by branch managers.
- Multi-branch requisition review with 1-click **"Approve"** and **"Mark Procured"** controls.
- Real-time stock valuation and minimum buffer threshold alerts.

---

### 3. 🍱 Per-Building Mess & Student Tiffin Box Logistics (`/mess`)
- **4-Meal Daily Cycles**: Breakfast, Lunch, High Tea & Snacks, Dinner.
- **Daily Student Tiffin Dispatch Hub** (`/mess/tiffin`):
  - Students opt-in for afternoon lunchbox delivery before the 9:00 AM kitchen cutoff.
  - Kitchen packing sheets grouped by college/institution batches.
  - Evening return tracking counter to prevent lost tiffin containers.

---

### 4. 🏢 Multi-Property & Visual Bed Grid Matrix
- Manage multiple branches across cities (Bengaluru, Gurugram, Pune, Hyderabad, etc.).
- Full hierarchy: `Property` &rarr; `Buildings/Blocks` &rarr; `Rooms` &rarr; `Beds`.
- Interactive visual bed grid with real-time status:
  - 🟢 **Available** (Ready for check-in)
  - 🔴 **Occupied** (Linked to active resident)
  - 🟡 **Reserved** (Booking advance paid)
  - ⚫ **Maintenance** (Under repair / sanitization)

---

### 5. 💳 Automated Rent Invoicing & Payments
- 1-Click **Bulk Invoicing** on the 1st of every month across all occupied beds.
- Printable & downloadable digital payment receipts (`window.print()` PDF ready).
- UPI QR code payments and automated WhatsApp rent due alerts.

---

### 6. 📱 Resident Mobile App & Dual Authentication (`/tenant/dashboard`, `/login`)
- **Dual-Mode Login**: Owner/Operator credentials vs Student/Resident room login.
- Dedicated mobile PWA at `/tenant/dashboard`:
  - Today's mess menu & tiffin opt-in.
  - 1-click UPI rent payment.
  - Digital maintenance complaint ticketing.
  - Emergency contact numbers and digital notice board.

---

### 7. 📊 Live Business Analytics & RevPAB (`/analytics`)
- Dynamic RevPAB (Revenue Per Available Bed) and Occupancy Rate trendlines.
- Financial forecasting: Net Operating Income (NOI), expense categorization, and collection efficiency.
- Synchronized with live database state via central singleton store.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router, Standalone output)
- **Language**: TypeScript (Strict typing, 0 compile errors)
- **Styling**: Tailwind CSS + Curated Glassmorphism Design System
- **Database & Auth**: Supabase PostgreSQL with Row-Level Security (RLS)
- **State Management**: Dual-engine singleton store (`lib/store.ts`) with live Supabase sync + offline fallback
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
4. Optional: Run [`supabase/seed.sql`](./supabase/seed.sql) to populate sample properties, rooms, tenants, inventory, and staff rosters.

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/arpitsingh0002/PGOS.git
cd PGOS

# 2. Install dependencies
npm install

# 3. Configure environment variables (Optional — runs out-of-the-box with fallback mock data)
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Visit the core routes at `http://localhost:3000`:
- **Landing Showcase**: [http://localhost:3000/](http://localhost:3000/)
- **Owner / HQ Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Manager Operations Portal**: [http://localhost:3000/manager](http://localhost:3000/manager)
- **Owner Central Inventory Audit**: [http://localhost:3000/inventory](http://localhost:3000/inventory)
- **Daily Student Tiffin Logistics**: [http://localhost:3000/mess/tiffin](http://localhost:3000/mess/tiffin)
- **Tenant Resident Mobile Portal**: [http://localhost:3000/tenant/dashboard](http://localhost:3000/tenant/dashboard)
- **Live Business Analytics**: [http://localhost:3000/analytics](http://localhost:3000/analytics)
- **Dual-Auth Portal Login**: [http://localhost:3000/login](http://localhost:3000/login)

---

## 🌐 Deploying to Render / Vercel

### Step 1: Push Repository to GitHub
```bash
git add .
git commit -m "feat: complete PGOS platform"
git push origin main
```

### Step 2: Create Web Service on Render
1. Go to [render.com](https://render.com) and click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository `PGOS`.
3. Configure settings:
   - **Name**: `pgos`
   - **Region**: Singapore (lowest latency for India)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

### Step 3: Add Environment Variables in Render
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_VERSION=20.11.0
```

---

## 📄 License
MIT License. Built for hostel, PG, and co-living entrepreneurs.
