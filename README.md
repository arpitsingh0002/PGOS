# 🚀 PGOS — Modern PG, Hostel & Co-living Operating System

PGOS is an enterprise-grade, multi-tenant SaaS platform engineered specifically for Indian PG (Paying Guest), hostel, and co-living operators. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL with Row Level Security)**, fully optimized for standalone deployment on **Render**.

---

## 🌟 Key Modules & Capabilities

1. **Multi-Property & Multi-Building Hierarchy**:
   - Manage multiple branches across cities (Bengaluru, Gurugram, Pune, Hyderabad, etc.).
   - Full tree structure: `Property` &rarr; `Buildings/Blocks` &rarr; `Rooms` &rarr; `Beds`.

2. **Interactive Visual Bed Grid Matrix**:
   - Live color status for every bed slot:
     - 🟢 **Available** (Ready for check-in)
     - 🔴 **Occupied** (Linked to active resident)
     - 🟡 **Reserved** (Booking advance paid)
     - ⚫ **Maintenance** (Under repair / cleaning)
   - 1-click bed drawer with occupant info and allocation controls.

3. **Per-Building Mess & Dining System**:
   - 4-Meal Daily Cycles: Breakfast, Lunch, High Tea & Snacks, Dinner.
   - Mon&ndash;Sun menu editor synced directly to resident portals.
   - Daily resident meal attendance headcount to prevent food waste.
   - Pantry bulk grocery purchase ledger and monthly cost per resident analytics.

4. **Automated Rent Collection & Invoicing**:
   - 1-Click **Bulk Invoicing** on the 1st of every month across all occupied beds.
   - Printable & downloadable digital payment receipts (`window.print()` PDF ready).
   - UPI QR code payments and automated WhatsApp rent due alerts.

5. **Resident Lifecycle & Move-out Settlements**:
   - Onboarding with Aadhaar/PAN KYC, deposit tracking, and bed allocation.
   - 6-Tab Tenant Profiles: Overview, Payment history, Complaints, Statement Ledger, Document vault, Activity timeline.
   - Checkout wizard with automated deductions (painting, damages, electricity) and net deposit refund calculation.

6. **Maintenance & Complaints Kanban Board**:
   - 4-Stage visual workflow: `NEW` &rarr; `ASSIGNED` &rarr; `IN PROGRESS` &rarr; `RESOLVED`.
   - Priority SLA timers (Urgent &lt;2h, High, Medium, Low).
   - Technician assignment and resolution notes.

7. **Staff Management & Task Delegation**:
   - Team directory (Managers, Wardens, Chefs, Cleaners, Electricians).
   - Staff Kanban task board with due dates and completion tags.

8. **Resident Mobile App (PWA)**:
   - Dedicated portal at `/tenant/dashboard` with mobile bottom navigation.
   - Today's menu, 1-click UPI pay, complaint lodging, and notice board.

9. **AI Operations Query Assistant**:
   - Fast AI endpoint answering natural language queries: "Which beds are vacant?", "Who owes rent?", "What is this month's NOI?".

10. **Public Property Marketplace Profile**:
    - High-converting listing page at `/pg/[id]` with room sharing rates, amenities, and visit booking lead generation.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions & Standalone output)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Glassmorphism design system
- **Database & Auth**: Supabase PostgreSQL with full Row-Level Security (RLS)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
4. All 27 tables, enums, triggers (including automatic receipt number generation), and RLS policies are created automatically.

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application:
- **Landing Page**: `/`
- **Owner Dashboard**: `/dashboard`
- **Tenant Portal**: `/tenant/dashboard`
- **Public PG Profile**: `/pg/prop-1`

---

## 🌐 Deploying to Render (Step-by-Step)

### Step 1: Push Repository to GitHub
```bash
git init
git add .
git commit -m "feat: complete PGOS multi-property platform"
git remote add origin https://github.com/your-username/pgos.git
git push -u origin main
```

### Step 2: Create Web Service on Render
1. Go to [render.com](https://render.com) and click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository `pgos`.
3. Configure settings:
   - **Name**: `pgos`
   - **Region**: Singapore (lowest latency for India)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

### Step 3: Add Environment Variables in Render
In Render Dashboard &rarr; **Environment**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_VERSION=20.11.0
```

### Step 4: Configure Supabase Auth Redirects
In Supabase &rarr; **Authentication** &rarr; **URL Configuration**:
- **Site URL**: `https://pgos.onrender.com`
- **Redirect URLs**:
  - `https://pgos.onrender.com/**`
  - `http://localhost:3000/**`

---

## 📄 License
MIT License. Built for hostel and PG entrepreneurs.
