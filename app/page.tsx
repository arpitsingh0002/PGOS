'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Building2,
  Users,
  Home,
  DoorOpen,
  Search,
  MapPin,
  Star,
  Heart,
  QrCode,
  UtensilsCrossed,
  Wrench,
  CreditCard,
  Wifi,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Filter,
  X,
  User,
  Clock,
  Download,
  Copy,
  Check,
  Flame,
  HelpCircle,
  ChevronDown,
  Zap,
  DollarSign,
  LogIn,
  UserCheck,
  Menu,
  Plus,
  Compass,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { formatINR } from '@/lib/utils/format';

type StayType = 'Hostel' | 'PG' | 'Flat' | 'Room';

interface PGListing {
  id: string;
  name: string;
  stayType: StayType;
  locality: string;
  city: string;
  landmark: string;
  rentPerMonth: number;
  image: string;
  routeId: string;
  contactPhone?: string;
  contactEmail?: string;
  collegeNearby?: string;
  rating?: number;
  tags?: string[];
}

const STAY_TYPE_DETAILS = [
  {
    type: 'Hostel' as const,
    num: '1',
    title: 'Student & Youth Hostels',
    badge: 'Campus Community',
    tagline: 'Budget-friendly student residences with daily mess meals, study spaces, and round-the-clock security.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    highlights: ['24/7 Security & Warden', 'Daily 3-Meal Student Mess', 'High-Speed Wi-Fi & Study Desks', 'Biometric Gate Access'],
    idealFor: 'College students & exam aspirants seeking discipline and community support',
  },
  {
    type: 'PG' as const,
    num: '2',
    title: 'Paying Guest (PG) Residencies',
    badge: 'Executive & Co-Living',
    tagline: 'Fully furnished single & double sharing rooms with home-style meals, housekeeping, and zero brokerage.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    highlights: ['Fully Furnished (Bed, AC, Cupboard)', 'Daily Housekeeping & Laundry', 'Nutritious Home-Style Meals', 'Zero Brokerage Direct Connect'],
    idealFor: 'IT professionals & students wanting hassle-free serviced accommodations',
  },
  {
    type: 'Flat' as const,
    num: '3',
    title: 'Shared & Private Flats',
    badge: 'Independent Living',
    tagline: '1BHK, 2BHK and 3BHK modern apartments offering complete freedom, modular kitchen, and full privacy.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    highlights: ['Complete Privacy & Independence', 'Equipped Modular Kitchen', 'Spacious Living & Balcony Areas', 'Zero In-Time / Curfew Rules'],
    idealFor: 'Friends, working roommates, and couples who want their own independent apartment',
  },
  {
    type: 'Room' as const,
    num: '4',
    title: 'Private Studio & Single Rooms',
    badge: 'Solo Living',
    tagline: 'Quiet, private single rooms and 1RK studio setups with attached washrooms for focused living.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    highlights: ['Private Attached Bathroom', 'Dedicated Work-From-Home Desk', 'Independent Entry & Exit', 'Affordable Monthly Setup'],
    idealFor: 'Researchers, remote workers, and individuals who prioritize peaceful private space',
  },
];

const CURATED_CAMPUS_PROPERTIES: PGListing[] = [
  {
    id: 'prop-curated-1',
    name: 'Stanza Campus Elite Student Residency',
    stayType: 'Hostel',
    locality: 'Koramangala 5th Block',
    city: 'Bengaluru',
    landmark: '500m from Christ University Gate 2',
    rentPerMonth: 11500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    routeId: 'stanza-elite',
    collegeNearby: 'Christ University & St. Johns',
    rating: 4.9,
    tags: ['Daily 4 Meals', 'Biometric QR Gate', 'Library Corner'],
  },
  {
    id: 'prop-curated-2',
    name: 'Scholar Crest Executive Student PG',
    stayType: 'PG',
    locality: 'North Campus, GTB Nagar',
    city: 'Delhi NCR',
    landmark: 'Adjacent to Vishwavidyalaya Metro',
    rentPerMonth: 9800,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    routeId: 'scholar-crest',
    collegeNearby: 'Delhi University (DU) Colleges',
    rating: 4.8,
    tags: ['AC Double Sharing', 'Zero Curfew Stress', 'Tiffin Delivery'],
  },
  {
    id: 'prop-curated-3',
    name: 'Viman Nagar Youth Co-Living Flats',
    stayType: 'Flat',
    locality: 'Viman Nagar',
    city: 'Pune',
    landmark: 'Opposite Symbiosis Campus Gate 1',
    rentPerMonth: 13500,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    routeId: 'viman-nagar-flats',
    collegeNearby: 'Symbiosis International University',
    rating: 4.9,
    tags: ['Modular Kitchen', 'Dedicated Study Room', 'Gym Access'],
  },
  {
    id: 'prop-curated-4',
    name: 'Apex Aspirant Studio Hub',
    stayType: 'Room',
    locality: 'Indraprastha Industrial Area',
    city: 'Kota',
    landmark: 'Behind Allen Samarth Building',
    rentPerMonth: 8500,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    routeId: 'apex-aspirant',
    collegeNearby: 'Allen / Motion / Resonance Hub',
    rating: 4.9,
    tags: ['Soundproof Study Room', 'Nutritious Mess', 'Biometric Gate'],
  },
];

const WEEKLY_MESS_DATA: Record<
  string,
  {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
    special: string;
  }
> = {
  Monday: {
    breakfast: 'Poha with Roasted Peanuts, Boiled Eggs / Sprouts & Masala Chai',
    lunch: 'Paneer Butter Masala, Yellow Dal Tadka, Jeera Rice, Phulkas & Salad',
    snacks: 'Crispy Veg Pakoras, Green Mint Chutney & Filter Coffee',
    dinner: 'Aloo Gobi Adraki, Mixed Veg Kadhi, Steamed Basmati Rice & Gulab Jamun',
    special: 'High Protein Monday (Sprouts & Soya Chunks)',
  },
  Tuesday: {
    breakfast: 'Masala Idli & Crispy Vada with Coconut Chutney & Sambar',
    lunch: 'Rajma Masala (Punjabi Style), steamed rice, fresh curds & papad',
    snacks: 'Samosa Chaat with sweet tamarind & mint chutney & Hot Tea',
    dinner: 'Egg Curry / Paneer Do Pyaza, Dal Fry, Roti & Fruit Custard',
    special: 'Punjabi Rajma Chawal Special',
  },
  Wednesday: {
    breakfast: 'Aloo Paratha with White Butter, Curd & Pickle + Chai',
    lunch: 'Chole Masala, Butter Naan / Bhature, Pulao & Boondi Raita',
    snacks: 'Sweet Corn Chaat & Cold Coffee',
    dinner: 'Dal Makhani, Matar Paneer, Tawa Roti, Rice & Moong Dal Halwa',
    special: 'Mid-Week Comfort Feast',
  },
  Thursday: {
    breakfast: 'Upma with Coconut Chutney, Omelette / Bananas & Tea',
    lunch: 'Kashmiri Dum Aloo, Dal Tadka, Ghee Rice & Mixed Salad',
    snacks: 'Bun Maska & Irani Chai',
    dinner: 'Mushroom Masala / Shahi Paneer, Phulkas, Steamed Rice & Kheer',
    special: 'Royal Mughlai Night',
  },
  Friday: {
    breakfast: 'Uttapam with Tomato Onion Topping, Sambar & Filter Coffee',
    lunch: 'Chicken Curry / Shahi Paneer, Dal Palak, Biryani Rice & Raita',
    snacks: 'Pav Bhaji & Hot Adrak Chai',
    dinner: 'Veg Korma / Butter Chicken, Malabar Parotta, Rice & Ice Cream',
    special: 'Weekend Kickoff Special',
  },
  Saturday: {
    breakfast: 'Puri Bhaji with Halwa, Sprouted Moong & Masala Tea',
    lunch: 'Hyderabadi Veg Biryani / Egg Biryani, Mirchi Ka Salan & Raita',
    snacks: 'French Fries, Cheesy Dip & Mint Mojito',
    dinner: 'Paneer Tikka Masala, Dal Amritsari, Garlic Naan & Rasgulla',
    special: 'Chef Special Biryani Weekend',
  },
  Sunday: {
    breakfast: 'Masala Dosa with Chutney Trio & Fresh Filter Coffee',
    lunch: 'Sunday Feast: Butter Chicken / Paneer Lababdar, Jeera Rice & Naan',
    snacks: 'Kachori with Aloo Sabzi & Masala Chai',
    dinner: 'Light Khichdi, Kadhi, Roasted Papad & Seasonal Fresh Fruits',
    special: 'Sunday Grand Feast & Detox Night',
  },
};

const FAQ_ITEMS = [
  {
    q: 'How does the Digital Gate Pass & Curfew QR system work?',
    a: 'Whenever you leave your campus hostel or PG for college, library, coaching, or a weekend home visit, you generate a 1-tap Digital Gate Pass in the app. The security turnstile reads your dynamic QR code. Your in/out timestamp is logged digitally, and an optional SMS or WhatsApp notification is sent to your parents or warden for safety.',
  },
  {
    q: 'Can I opt out of mess meals if I have early classes or am eating outside?',
    a: 'Yes! The PGOS student portal features an interactive Daily Mess & Tiffin Hub. You can toggle "Skip Meal" or request a "Packed College Tiffin" before 9:00 AM. Skipping meals automatically earns credits toward your monthly billing and prevents kitchen food waste.',
  },
  {
    q: 'How fast are room complaints and maintenance requests handled?',
    a: 'All maintenance complaints (such as Wi-Fi speed drops, AC servicing, plumbing leaks, or tube light replacements) are logged with a strict 2-hour SLA. You get real-time tracking from "Assigned to Technician" to "Resolved with OTP verification" directly on your resident portal.',
  },
  {
    q: 'Do parents receive tax-deductible HRA receipts for rent payments?',
    a: 'Absolutely. Every rent payment made via UPI, card, or net banking generates an official, digitally signed Rent Agreement & GST/PAN-compliant Rent Receipt that parents can directly submit for Section 10(13A) HRA tax exemptions.',
  },
  {
    q: 'Is there any brokerage or hidden commission when booking?',
    a: 'Zero brokerage! PGOS connects students and parents directly to verified property owners and wardens, saving you up to 1-2 months of unnecessary agent brokerage fees.',
  },
];

export default function UnifiedLandingPage() {
  const router = useRouter();

  // Search & Stay Type State (1. Hostel, 2. PG, 3. Flat, 4. Room)
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStayType, setSelectedStayType] = React.useState<string>('All');
  const [selectedCity, setSelectedCity] = React.useState<string>('All India');
  const [selectedTagFilter, setSelectedTagFilter] = React.useState<string>('All');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const CITIES = ['All India', 'Bengaluru', 'Delhi NCR', 'Pune', 'Mumbai', 'Hyderabad', 'Kota'];

  // Properties list (Supabase + Curated fallback)
  const [listings, setListings] = React.useState<PGListing[]>(CURATED_CAMPUS_PROPERTIES);

  // Visit Scheduling Modal
  const [isVisitModalOpen, setIsVisitModalOpen] = React.useState(false);
  const [selectedPGForVisit, setSelectedPGForVisit] = React.useState<PGListing | null>(null);
  const [visitDate, setVisitDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [visitSlot, setVisitSlot] = React.useState('Morning (10:00 AM - 1:00 PM)');
  const [visitorName, setVisitorName] = React.useState('');
  const [visitorPhone, setVisitorPhone] = React.useState('');

  // Favorites
  const [favorites, setFavorites] = React.useState<string[]>([]);

  // Gate Pass Interactive Generator State
  const [studentName, setStudentName] = React.useState('Aarav Sharma');
  const [studentRoom, setStudentRoom] = React.useState('Room 304 • Bed B');
  const [passReason, setPassReason] = React.useState('Library & Late Study Session');
  const [expectedReturn, setExpectedReturn] = React.useState('09:30 PM');
  const [gatePassCode, setGatePassCode] = React.useState('GP-9482-BLR');
  const [copiedCode, setCopiedCode] = React.useState(false);

  // Mess Menu State
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = React.useState<string>(dayNames[todayIndex]);
  const [hasOptedTiffin, setHasOptedTiffin] = React.useState(false);

  // Maintenance Simulator State
  const [selectedIssue, setSelectedIssue] = React.useState('Room 304: Wi-Fi Signal Dropping');
  const [issueStep, setIssueStep] = React.useState<'idle' | 'submitted' | 'assigned' | 'resolved'>('idle');

  // HRA Tax Calculator State
  const [monthlyRent, setMonthlyRent] = React.useState(12000);
  const annualRent = monthlyRent * 12;
  const estimatedTaxSavings = Math.round(annualRent * 0.208);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  // Fetch real active properties from Supabase
  React.useEffect(() => {
    async function loadProperties() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('id, name, address, city, state, cover_image, contact_phone, contact_email')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          const mapped: PGListing[] = data.map((prop, idx) => ({
            id: prop.id,
            name: prop.name,
            stayType: (idx % 2 === 0 ? 'Hostel' : 'PG') as StayType,
            locality: prop.address || prop.city || 'Campus Area',
            city: prop.city || 'Bengaluru',
            landmark: prop.state || 'Near University Metro Station',
            rentPerMonth: 9500 + (idx % 4) * 1500,
            image: prop.cover_image || CURATED_CAMPUS_PROPERTIES[idx % CURATED_CAMPUS_PROPERTIES.length].image,
            routeId: prop.id,
            contactPhone: prop.contact_phone,
            contactEmail: prop.contact_email,
            collegeNearby: 'Top Campus Hub',
            rating: 4.8 + (idx % 2) * 0.1,
            tags: ['Biometric QR', '3-Meal Mess', 'Study Desks'],
          }));
          setListings(mapped);
        }
      } catch (err) {
        console.error('Error loading properties', err);
      }
    }
    loadProperties();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
      toast.info('Removed from saved list');
    } else {
      setFavorites([...favorites, id]);
      toast.success('Added to your shortlisted spaces!');
    }
  };

  // Filtered Listings (OLX Enhanced Multi-Filter)
  const filteredListings = React.useMemo(() => {
    return listings.filter((pg) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        pg.name.toLowerCase().includes(q) ||
        pg.locality.toLowerCase().includes(q) ||
        pg.city.toLowerCase().includes(q) ||
        pg.landmark.toLowerCase().includes(q) ||
        (pg.collegeNearby && pg.collegeNearby.toLowerCase().includes(q)) ||
        pg.stayType.toLowerCase().includes(q);

      const matchesStayType =
        selectedStayType === 'All' || pg.stayType.toLowerCase() === selectedStayType.toLowerCase();

      const matchesCity =
        selectedCity === 'All India' ||
        pg.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
        pg.locality.toLowerCase().includes(selectedCity.toLowerCase());

      const matchesTag =
        selectedTagFilter === 'All' ||
        (selectedTagFilter === 'Food' && (pg.tags?.some(t => t.toLowerCase().includes('meal') || t.toLowerCase().includes('tiffin')) || pg.stayType === 'Hostel')) ||
        (selectedTagFilter === 'AC' && pg.tags?.some(t => t.toLowerCase().includes('ac'))) ||
        (selectedTagFilter === 'Budget' && pg.rentPerMonth <= 10000) ||
        (selectedTagFilter === 'Near College' && !!pg.collegeNearby);

      return matchesSearch && matchesStayType && matchesCity && matchesTag;
    });
  }, [listings, searchQuery, selectedStayType, selectedCity, selectedTagFilter]);

  const handleScheduleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }
    toast.success(`Visit Confirmed for ${selectedPGForVisit?.name}! A manager will call you at +91 ${visitorPhone}`);
    setIsVisitModalOpen(false);
    setVisitorName('');
    setVisitorPhone('');
  };

  const handleRegenerateGatePass = () => {
    const randomCode = `GP-${Math.floor(1000 + Math.random() * 9000)}-${studentRoom.replace(/\D/g, '') || 'BLR'}`;
    setGatePassCode(randomCode);
    toast.success('Generated New Contactless QR Gate Pass Token!');
  };

  const handleCopyPassCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(gatePassCode);
    }
    setCopiedCode(true);
    toast.success('Gate Pass Token copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunComplaintSim = () => {
    setIssueStep('submitted');
    toast.info('Ticket created! Auto-assigning floor warden...');
    setTimeout(() => {
      setIssueStep('assigned');
      toast.info('Technician Ravi Kumar dispatched with replacement router');
      setTimeout(() => {
        setIssueStep('resolved');
        toast.success('Resolved! Resident OTP verified successfully.');
      }, 2500);
    }, 2000);
  };

  const getStayTypeIcon = (type: StayType) => {
    switch (type) {
      case 'Hostel':
        return <Building2 className="h-3.5 w-3.5" />;
      case 'PG':
        return <Users className="h-3.5 w-3.5" />;
      case 'Flat':
        return <Home className="h-3.5 w-3.5" />;
      case 'Room':
        return <DoorOpen className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500/20 selection:text-orange-900 pb-20 md:pb-0">
      {/* ========================================================= */}
      {/* 1. TOP NAVIGATION BAR (OLX-Inspired Responsive Header) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Brand Logo + OLX Location Picker */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <span className="text-white font-extrabold text-lg sm:xl">PG</span>
                </div>
                <div>
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">PGOS</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 block -mt-1 hidden sm:block">
                    Hostel &bull; PG &bull; Flat &bull; Room
                  </span>
                </div>
              </Link>

              {/* OLX-Style City / Location Picker Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                  title="Select City / Region"
                >
                  <MapPin className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
                  <span className="max-w-[75px] sm:max-w-[120px] truncate">{selectedCity}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180 text-orange-600' : ''}`} />
                </button>

                {isCityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-48 rounded-2xl border border-slate-200 bg-white shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Popular Hubs
                    </div>
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setSelectedCity(c);
                          setIsCityDropdownOpen(false);
                          toast.success(`Showing stays in ${c}`);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                          selectedCity === c ? 'font-bold text-orange-600 bg-orange-50/60' : 'text-slate-700'
                        }`}
                      >
                        <span>{c}</span>
                        {selectedCity === c && <Check className="h-3.5 w-3.5 text-orange-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: Desktop OLX Big Search Bar */}
            <div className="flex-1 max-w-lg mx-2 hidden md:block">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find Hostels, PGs, Student Flats near college..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-14 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Student Portal Quick Jump */}
              <Link
                href="/student"
                className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-orange-600" />
                <span>Student Portal</span>
              </Link>

              {/* Login Button */}
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold h-9 sm:h-10 px-3 sm:px-4 rounded-xl gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5 text-orange-600" />
                  <span>Login / Sign In</span>
                </Button>
              </Link>

              {/* OLX-Style Signature "+ LIST PROPERTY" Button */}
              <Link href="/login?role=manager" className="hidden sm:inline-block">
                <button
                  type="button"
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-white hover:bg-orange-50 border-2 border-orange-500 hover:border-orange-600 text-slate-900 font-extrabold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="h-4 w-4 text-orange-600 stroke-[3]" />
                  <span>+ LIST YOUR PG</span>
                </button>
              </Link>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Directly below header on small screens) */}
          <div className="md:hidden pb-3 pt-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hostel, pg, flat, room by locality..."
                className="w-full pl-9 pr-14 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute right-1 px-2.5 py-1 rounded-lg bg-orange-600 text-white text-[11px] font-bold"
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* OLX-Style Horizontal Category Filter Chips Bar (Phone & Laptop responsive) */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: 'All', label: 'All Stays', icon: Compass },
              { id: 'Hostel', label: '1. Hostels', icon: Building2 },
              { id: 'PG', label: '2. PGs', icon: Users },
              { id: 'Flat', label: '3. Flats', icon: Home },
              { id: 'Room', label: '4. Rooms', icon: DoorOpen },
              { id: 'Food', label: '🍲 Mess Included', isTag: true },
              { id: 'AC', label: '⚡ AC Rooms', isTag: true },
              { id: 'Budget', label: '🏷️ Under ₹10k', isTag: true },
              { id: 'Near College', label: '🎓 Near Campus', isTag: true },
            ].map((chip) => {
              const isTagChip = chip.isTag;
              const isSelected = isTagChip
                ? selectedTagFilter === chip.id
                : selectedStayType === chip.id;
              const Icon = chip.icon;

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    if (isTagChip) {
                      setSelectedTagFilter(selectedTagFilter === chip.id ? 'All' : chip.id);
                    } else {
                      setSelectedStayType(selectedStayType === chip.id ? 'All' : chip.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-xs flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-orange-500/20'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown Menu (When hamburger is clicked) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/student"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 font-bold text-xs"
            >
              <GraduationCap className="h-4 w-4 text-orange-600" />
              <span>Student Resident Portal</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs"
            >
              <Building2 className="h-4 w-4 text-orange-600" />
              <span>Owner & Manager Operating System</span>
            </Link>

            <Link
              href="/login?role=manager"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-orange-500 bg-white text-slate-900 font-extrabold text-xs"
            >
              <Plus className="h-4 w-4 text-orange-600" />
              <span>+ List Your Property (0% Brokerage)</span>
            </Link>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-orange-600 font-bold">
                Login / Sign In &rarr;
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-slate-800">
                Register as Owner
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION: "Search Your Home Near You" */}
      {/* (1. Hostel | 2. PG | 3. Flat | 4. Room) */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Soft Warm Glow (Fingerprint Style) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold mb-4 shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-orange-600" />
            Verified Hostels, PGs, Shared Flats & Private Rooms
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Search Your Home <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">Near You</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto font-normal leading-relaxed">
            Find verified student hostels, fully-furnished PGs, shared flats, and private studio rooms near your college or workplace with 0% brokerage.
          </p>

          {/* The 4 Options Selector Card: 1. Hostel | 2. PG | 3. Flat | 4. Room */}
          <div className="mt-8 p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 max-w-4xl mx-auto text-left">
            <div className="flex items-center justify-between mb-3.5 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-orange-600" />
                Select Stay Type
              </span>
              {selectedStayType !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedStayType('All')}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Show All Stays
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  id: '1',
                  type: 'Hostel' as const,
                  num: '1',
                  label: 'Hostel',
                  icon: Building2,
                  activeClass:
                    'bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-500/30 scale-[1.02]',
                },
                {
                  id: '2',
                  type: 'PG' as const,
                  num: '2',
                  label: 'PG',
                  icon: Users,
                  activeClass:
                    'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/25 ring-2 ring-slate-800/30 scale-[1.02]',
                },
                {
                  id: '3',
                  type: 'Flat' as const,
                  num: '3',
                  label: 'Flat',
                  icon: Home,
                  activeClass:
                    'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/30 scale-[1.02]',
                },
                {
                  id: '4',
                  type: 'Room' as const,
                  num: '4',
                  label: 'Room',
                  icon: DoorOpen,
                  activeClass:
                    'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/30 scale-[1.02]',
                },
              ].map((item) => {
                const isSelected = selectedStayType === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSelectedStayType(isSelected ? 'All' : item.type)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group flex flex-col justify-between ${
                      isSelected
                        ? item.activeClass
                        : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white text-orange-600 border border-slate-200'
                        }`}
                      >
                        {item.num}
                      </span>
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-orange-600 border border-slate-200 shadow-xs'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div
                      className={`font-black text-base sm:text-lg tracking-tight flex items-center gap-2 ${
                        isSelected ? 'text-white' : 'text-slate-900 group-hover:text-orange-600'
                      }`}
                    >
                      <span>{item.num}.</span>
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Proof Strip */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 px-1">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 0% Brokerage Direct Connect
              </span>
              <span className="flex items-center gap-1.5 text-orange-700 font-semibold">
                <QrCode className="h-3.5 w-3.5 text-orange-600" /> 10-Sec Biometric Gate Pass
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <UtensilsCrossed className="h-3.5 w-3.5 text-orange-600" /> 4-Meal Mess + Tiffin Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. STAY TYPE SHOWCASE (Hostel, PG, Flat, Room) */}
      {/* ========================================================= */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5 text-orange-600" /> Explore Stays
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {selectedStayType === 'All' ? 'Living Spaces & Categories' : `${selectedStayType} Accommodations`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified living options for university students, aspirants, and young professionals
            </p>
          </div>

          {selectedStayType !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedStayType('All')}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> View All 4 Options
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAY_TYPE_DETAILS.filter(
            (item) => selectedStayType === 'All' || item.type === selectedStayType
          ).map((item) => {
            const isSelected = selectedStayType === item.type;
            const Icon =
              item.type === 'Hostel'
                ? Building2
                : item.type === 'PG'
                ? Users
                : item.type === 'Flat'
                ? Home
                : DoorOpen;

            return (
              <div
                key={item.type}
                className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'border-orange-500/80 bg-white ring-2 ring-orange-500/20 shadow-lg shadow-orange-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="h-6 w-6 rounded-full bg-white/90 backdrop-blur-md text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
                      {item.num}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-600 text-white font-bold flex items-center gap-1 shadow-xs">
                      <Icon className="h-3 w-3" />
                      {item.type}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 font-medium shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span>{item.num}.</span> {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.tagline}
                    </p>

                    <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="h-3 w-3 text-orange-600 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedStayType(item.type)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800'
                      }`}
                    >
                      {isSelected ? `Active: ${item.type}` : `Select ${item.num}. ${item.type}`}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. VERIFIED PROPERTIES DIRECTORY */}
      {/* ========================================================= */}
      <section id="directory" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Verified Properties
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono">
                {filteredListings.length} Listed
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct listings with verified owners, biometric security & 0% brokerage
            </p>
          </div>

          <Link href="/login?role=manager">
            <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 shadow-xs">
              <Building2 className="h-3.5 w-3.5 text-orange-600" />
              List Your Property as Owner
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredListings.map((pg) => {
            const isFav = favorites.includes(pg.id);
            return (
              <div
                key={pg.id}
                className="rounded-3xl border border-slate-200 bg-white hover:border-orange-500/50 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={pg.image}
                    alt={pg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-600 text-white font-bold shadow-xs">
                      {getStayTypeIcon(pg.stayType)}
                      {pg.stayType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/95 text-slate-900 font-bold shadow-xs">
                      ★ {pg.rating || 4.9}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(pg.id, e)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors shadow-xs"
                    title="Save property"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {pg.collegeNearby && (
                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-[10px] font-medium text-white bg-slate-900/70 px-2 py-0.5 rounded-md backdrop-blur-md">
                        🎓 {pg.collegeNearby}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {pg.name}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
                      {pg.locality}, {pg.city}
                    </p>

                    {pg.landmark && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        📍 {pg.landmark}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Monthly Rent</span>
                      <span className="text-sm font-bold text-slate-900">{formatINR(pg.rentPerMonth)}/mo</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPGForVisit(pg);
                          setIsVisitModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        Book Visit
                      </button>

                      <Link href={`/pg/${pg.routeId}`}>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-xs font-semibold px-2.5 text-white">
                          Details &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. INTERACTIVE TOOL #1: DIGITAL GATE PASS QR SIMULATOR */}
      {/* ========================================================= */}
      <section id="gate-pass" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
              <QrCode className="h-3.5 w-3.5 text-orange-600" /> Contactless Turnstile QR
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              10-Second Digital Gate Pass & Curfew QR
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No manual register books, warden delays, or late-curfew friction. Generate a digital pass on your phone, scan the turnstile barcode, and notify parents automatically.
            </p>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Resident Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Room & Bed</label>
                  <input
                    type="text"
                    value={studentRoom}
                    onChange={(e) => setStudentRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Outing Reason</label>
                  <select
                    value={passReason}
                    onChange={(e) => setPassReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Library & Late Study Session">Library & Late Study Session</option>
                    <option value="College Evening Lecture / Lab">College Evening Lecture / Lab</option>
                    <option value="Weekend Home Visit">Weekend Home Visit</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Curfew In-Time</label>
                  <select
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="08:30 PM">08:30 PM (Standard)</option>
                    <option value="09:30 PM">09:30 PM (Extended Library)</option>
                    <option value="10:30 PM">10:30 PM (Curfew Deadline)</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleRegenerateGatePass}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold gap-1.5 mt-1 shadow-sm"
              >
                <Zap className="h-4 w-4" /> Generate New Turnstile Token
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl p-6 bg-white border-2 border-orange-200 shadow-xl shadow-slate-900/5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-[10px] text-orange-600 font-mono uppercase tracking-wider block font-bold">
                    PGOS Turnstile Pass
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{studentName}</h3>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  VERIFIED ACTIVE
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center relative overflow-hidden">
                  <div className="relative inline-block">
                    <svg className="w-28 h-28 text-slate-900 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="5" y="5" width="28" height="28" rx="4" fill="#ea580c" />
                      <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="13" y="13" width="12" height="12" rx="1" fill="#ea580c" />

                      <rect x="67" y="5" width="28" height="28" rx="4" fill="#ea580c" />
                      <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="75" y="13" width="12" height="12" rx="1" fill="#ea580c" />

                      <rect x="5" y="67" width="28" height="28" rx="4" fill="#ea580c" />
                      <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="13" y="75" width="12" height="12" rx="1" fill="#ea580c" />

                      <rect x="38" y="8" width="6" height="6" fill="#1e293b" />
                      <rect x="48" y="12" width="6" height="6" fill="#1e293b" />
                      <rect x="56" y="8" width="6" height="6" fill="#ea580c" />
                      <rect x="38" y="24" width="6" height="6" fill="#1e293b" />
                      <rect x="46" y="26" width="6" height="6" fill="#ea580c" />
                      <rect x="56" y="20" width="6" height="6" fill="#1e293b" />

                      <rect x="10" y="38" width="6" height="6" fill="#1e293b" />
                      <rect x="22" y="44" width="6" height="6" fill="#ea580c" />
                      <rect x="38" y="38" width="8" height="8" rx="2" fill="#ea580c" />
                      <rect x="50" y="44" width="6" height="6" fill="#1e293b" />
                      <rect x="62" y="38" width="6" height="6" fill="#ea580c" />
                      <rect x="74" y="44" width="6" height="6" fill="#1e293b" />
                      <rect x="84" y="38" width="6" height="6" fill="#1e293b" />

                      <rect x="38" y="56" width="6" height="6" fill="#ea580c" />
                      <rect x="48" y="60" width="6" height="6" fill="#1e293b" />
                      <rect x="58" y="56" width="6" height="6" fill="#ea580c" />
                      <rect x="40" y="72" width="6" height="6" fill="#1e293b" />
                      <rect x="52" y="78" width="6" height="6" fill="#ea580c" />
                      <rect x="62" y="70" width="6" height="6" fill="#1e293b" />
                      <rect x="72" y="80" width="8" height="8" fill="#ea580c" />
                      <rect x="84" y="72" width="6" height="6" fill="#1e293b" />
                    </svg>

                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_#f97316] animate-bounce" />
                  </div>

                  <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-mono text-orange-700 font-bold">
                    <span>{gatePassCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyPassCode}
                      className="p-1 hover:text-orange-950"
                      title="Copy Pass Code"
                    >
                      {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Outing Purpose</span>
                    <span className="font-semibold text-slate-800">{passReason}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Allocated Room</span>
                    <span className="font-semibold text-orange-700">{studentRoom}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Report Back Time</span>
                    <span className="font-semibold text-slate-900">{expectedReturn}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">Parent WhatsApp Alert: Synced</span>
                <Link href="/login?role=student">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-xs text-white">
                    Open in Student Portal &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. INTERACTIVE TOOL #2: LIVE 4-MEAL MESS MENU & TIFFIN */}
      {/* ========================================================= */}
      <section id="mess-menu" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-2">
              <UtensilsCrossed className="h-3.5 w-3.5 text-orange-600" /> Daily Campus Mess
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Live 4-Meal Student Mess Menu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Nutritious student meals prepared fresh daily, with packed lunch delivery for college classes.
            </p>
          </div>

          <Button
            onClick={() => {
              setHasOptedTiffin(!hasOptedTiffin);
              toast.success(
                !hasOptedTiffin
                  ? '🎉 Packed Tiffin Booked! Delivered to your college desk by 12:30 PM.'
                  : 'Tiffin Opt-out saved. Dining at hostel mess instead.'
              );
            }}
            className={`text-xs font-semibold gap-1.5 shadow-xs ${
              hasOptedTiffin
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-orange-600 hover:bg-orange-500 text-white'
            }`}
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            {hasOptedTiffin ? '✓ Tiffin Booked For Classes' : 'Pack Lunch For College (Before 9 AM)'}
          </Button>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200/80">
          {dayNames.map((day) => {
            const isToday = day === dayNames[todayIndex];
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4-Meal Grid */}
        {(() => {
          const menu = WEEKLY_MESS_DATA[selectedDay] || WEEKLY_MESS_DATA.Monday;
          return (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs text-orange-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Flame className="h-4 w-4 text-orange-600" />
                  Day Highlight: {menu.special}
                </span>
                <span className="text-[11px] text-orange-700 font-medium">3 Meals + Evening High Tea Included</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                        Breakfast
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 7:30 - 9:30 AM
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Morning Energizer</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{menu.breakfast}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
                    Unlimited Refills & Tea/Milk
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        Lunch
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 12:30 - 2:30 PM
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Nutritious Thali</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{menu.lunch}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-orange-700 font-medium">
                    Tiffin Deliverable to College
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                        Snacks
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 5:00 - 6:30 PM
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Evening Recharge</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{menu.snacks}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-700 font-medium">
                    Hot Tea/Coffee & Savories
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        Dinner
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 8:00 - 10:15 PM
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Warm Evening Meal</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{menu.dinner}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
                    Dessert Included • Late Plate
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ========================================================= */}
      {/* 7. INTERACTIVE TOOL #3: 1-CLICK MAINTENANCE SLA */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
              <Wrench className="h-3.5 w-3.5 text-orange-600" /> 2-Hour Ticket SLA
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Instant Room Maintenance Resolution
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Never get stuck without Wi-Fi, air conditioning, or hot water before exams. Log an issue with one tap and track the technician live until OTP verification.
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-500 block">Select a Sample Room Issue to Test:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Room 304: Wi-Fi Signal Dropping',
                  'AC Airflow & Filter Cleaning',
                  'Study Table Light Broken',
                  'Attached Bathroom Tap Leaking',
                ].map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => {
                      setSelectedIssue(issue);
                      setIssueStep('idle');
                    }}
                    className={`p-3 rounded-2xl text-xs text-left font-medium border transition-all ${
                      selectedIssue === issue
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleRunComplaintSim}
                  disabled={issueStep !== 'idle' && issueStep !== 'resolved'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  {issueStep === 'idle' || issueStep === 'resolved'
                    ? 'Simulate Live 2-Hour Ticket SLA'
                    : 'Dispatching On-Site Technician...'}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Ticket Monitor</span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{selectedIssue}</h4>
                </div>
                <Badge
                  className={`text-[10px] ${
                    issueStep === 'resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : issueStep === 'assigned'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : issueStep === 'submitted'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {issueStep === 'resolved'
                    ? 'RESOLVED (OTP 8492)'
                    : issueStep === 'assigned'
                    ? 'TECH EN ROUTE'
                    : issueStep === 'submitted'
                    ? 'TICKET SUBMITTED'
                    : 'READY TO DISPATCH'}
                </Badge>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    issueStep !== 'idle' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Ticket Logged by Resident</span>
                    <span className="text-[11px] text-slate-500">Photo attached & auto-assigned to Floor Warden</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    issueStep === 'assigned' || issueStep === 'resolved'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Technician Ravi Kumar Dispatched</span>
                    <span className="text-[11px] text-slate-500">SLA Timer running • Estimated arrival: 14 mins</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    issueStep === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Resident OTP 8492 Verification</span>
                    <span className="text-[11px] text-slate-500">Cannot be closed until the resident confirms work is done</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Average Resolution in Campus:</span>
                <strong className="text-orange-700 font-bold">47 Minutes</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. INTERACTIVE TOOL #4: PARENT HRA TAX CALCULATOR */}
      {/* ========================================================= */}
      <section id="hra-calculator" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> For Parents & Students
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Calculate Parent HRA Tax Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every rupee paid for student room rent through PGOS qualifies for House Rent Allowance (HRA) tax exemption under Section 10(13A). We provide automated monthly rent receipts with the landlord&apos;s verified PAN.
            </p>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Monthly Hostel / PG Rent</span>
                <span className="text-base font-bold text-orange-600">{formatINR(monthlyRent)} / mo</span>
              </div>

              <input
                type="range"
                min={5000}
                max={30000}
                step={500}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹5,000/mo</span>
                <span>₹17,500/mo</span>
                <span>₹30,000/mo</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xl shadow-slate-900/5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Annual Tax Benefit</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  SECTION 10(13A)
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Total Annual Rent</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">{formatINR(annualRent)}</span>
                  <span className="text-[10px] text-slate-400">12 Monthly Cycles</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200">
                  <span className="text-[10px] text-orange-700 font-semibold block">Est. Parent Tax Saved</span>
                  <span className="text-lg font-bold text-orange-600 mt-0.5 block">
                    ~ {formatINR(estimatedTaxSavings)}
                  </span>
                  <span className="text-[10px] text-slate-400">In 20% Tax Slab</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                  <span>Instant 1-Click PDF Download Every Month</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                  <span>Includes Landlord PAN & Revenue Stamp Seal</span>
                </div>
              </div>

              <Button
                onClick={() => toast.success('Sample Section 10(13A) HRA Rent Receipt preview generated!')}
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                <Download className="h-3.5 w-3.5 mr-1.5 text-orange-600" />
                Preview Sample HRA Rent Receipt PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. REAL STUDENT TESTIMONIALS */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-2">
            <Star className="h-3.5 w-3.5 text-amber-500" /> 4.9★ Average Rating Across 12,000+ Students
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Loved By Students Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &ldquo;The packed tiffin feature is a lifesaver. During morning lectures at 8 AM, I don&apos;t have time to sit and eat in the mess. I opt-in before 9 AM and get hot food right at college.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Ananya Iyer</h4>
                <p className="text-[10px] text-orange-600 font-semibold">Christ University, BBA</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &ldquo;In my previous PG, guards would yell if you reached at 9:05 PM. With PGOS, late library passes are approved automatically in 10 seconds. My parents also get peace of mind through SMS.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Devansh Rao</h4>
                <p className="text-[10px] text-slate-700 font-semibold">IIT Bombay / Powai Campus</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &ldquo;My father claims ₹48,000 every year in income tax HRA deductions using the automatic PGOS rent receipts. We just tap download at the end of each month. Zero paperwork!&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Pooja Mittal</h4>
                <p className="text-[10px] text-emerald-700 font-semibold">Delhi University, SRCC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================= */}
      <section id="faqs" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-200/80">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-2">
            <HelpCircle className="h-3.5 w-3.5 text-orange-600" /> Clear Answers
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm text-slate-900 hover:text-orange-600 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-orange-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. CTA FOOTER BANNER */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white text-center shadow-xl shadow-orange-600/20">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100 bg-white/20 px-3 py-1 rounded-full">
              Ready to Experience PGOS?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              One Login For Students, Managers & Owners
            </h2>
            <p className="text-xs sm:text-sm text-orange-50 leading-relaxed">
              Select your role in the login page to access your customized dashboard — whether you need a gate pass or want to manage hundreds of beds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold shadow-md gap-2"
                >
                  <LogIn className="h-4 w-4 text-orange-600" />
                  Sign In (Select Role)
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-6 border-white/40 hover:bg-white/10 text-xs font-semibold text-white"
                >
                  Register As Owner &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. SCHEDULE IN-PERSON VISIT MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        title="Schedule a Free Room Visit"
        description={selectedPGForVisit ? `Reserve an on-site tour of ${selectedPGForVisit.name}` : ''}
        maxWidth="md"
      >
        <form onSubmit={handleScheduleVisit} className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <img
              src={selectedPGForVisit?.image}
              alt=""
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-600 text-white">
                  {selectedPGForVisit?.stayType}
                </span>
                {selectedPGForVisit?.name}
              </div>
              <div className="text-[11px] text-orange-700 font-medium">{selectedPGForVisit?.locality}, {selectedPGForVisit?.city}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Your Full Name</label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="e.g. Aman Upadhyay"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Contact Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Visit Date</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Preferred Slot</label>
              <select
                value={visitSlot}
                onChange={(e) => setVisitSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
              >
                <option value="Morning (10:00 AM - 1:00 PM)">Morning (10am - 1pm)</option>
                <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1pm - 5pm)</option>
                <option value="Evening (5:00 PM - 8:30 PM)">Evening (5pm - 8:30pm)</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-xs font-semibold gap-2 shadow-sm text-white mt-2"
          >
            Confirm Free In-Person Visit <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-[10px] text-slate-500 text-center">
            🔒 Zero booking charges. Instant WhatsApp directions & manager contact sent on submission.
          </p>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* 13. FOOTER */}
      {/* ========================================================= */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
              PG
            </div>
            <span className="font-bold text-slate-900 text-sm">PGOS Platform</span>
            <span>— Modern Operating System for Hostels, PGs, Flats & Rooms</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <Link href="/login" className="hover:text-orange-600">Login (Select Role)</Link>
            <Link href="/student" className="hover:text-orange-600">Student Portal</Link>
            <Link href="/dashboard" className="hover:text-orange-600">Manager Dashboard</Link>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 14. OLX-STYLE STICKY MOBILE BOTTOM NAVIGATION BAR */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 items-center justify-items-center text-[10px] font-semibold text-slate-600">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 py-1 text-orange-600 font-bold active:scale-95 transition-transform"
          >
            <Compass className="h-5 w-5" />
            <span>Explore</span>
          </Link>

          <a
            href="#directory"
            className="flex flex-col items-center gap-0.5 py-1 hover:text-orange-600 active:scale-95 transition-transform"
          >
            <Building2 className="h-5 w-5" />
            <span>Stays</span>
          </a>

          {/* OLX-Style Raised Center Action Button */}
          <Link
            href="/login?role=manager"
            className="-mt-5 flex flex-col items-center active:scale-95 transition-transform"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-white">
              <Plus className="h-6 w-6 stroke-[3]" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900 mt-0.5">+ POST PG</span>
          </Link>

          <Link
            href="/student"
            className="flex flex-col items-center gap-0.5 py-1 hover:text-orange-600 active:scale-95 transition-transform"
          >
            <GraduationCap className="h-5 w-5" />
            <span>Student</span>
          </Link>

          <Link
            href="/login"
            className="flex flex-col items-center gap-0.5 py-1 hover:text-orange-600 active:scale-95 transition-transform"
          >
            <User className="h-5 w-5" />
            <span>Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
