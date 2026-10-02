'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  BedDouble,
  UtensilsCrossed,
  Wifi,
  ShieldCheck,
  Zap,
  Phone,
  Calendar,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function PublicPropertyPage() {
  const params = useParams();
  const propId = (params?.id as string) || 'prop-1';
  const { properties, rooms, beds } = usePGStore();

  const property = properties.find((p) => p.id === propId) || properties[0];
  const propRooms = rooms.filter((r) => r.property_id === property?.id);
  const propBeds = beds.filter((b) => b.property_id === property?.id);

  const [inquiryName, setInquiryName] = React.useState('');
  const [inquiryPhone, setInquiryPhone] = React.useState('');
  const [inquirySharing, setInquirySharing] = React.useState('Double Sharing');
  const [visitDate, setVisitDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [isBooked, setIsBooked] = React.useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;

    setIsBooked(true);
    toast.success('Visit scheduled! Our branch caretaker will call you shortly.');
  };

  const amenities = [
    { name: '1 Gbps Commercial Wi-Fi', icon: Wifi },
    { name: '3-Time Unlimited Buffet Mess', icon: UtensilsCrossed },
    { name: '24/7 Power Backup (DG Generator)', icon: Zap },
    { name: 'Biometric Access & CCTV Security', icon: ShieldCheck },
    { name: 'Daily Room Housekeeping', icon: Sparkles },
    { name: 'Fully Automatic Washing Machines', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Public Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6 max-w-6xl mx-auto flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            PG
          </div>
          <span className="font-bold text-white text-sm">PGOS Verified Stays</span>
        </Link>

        <div className="flex items-center gap-3">
          <a href={`tel:${property?.contact_phone || '9876543210'}`}>
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Phone className="h-3.5 w-3.5 text-emerald-400" /> Call Caretaker
            </Button>
          </a>
        </div>
      </nav>

      {/* Main Listing View */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Cover Photo Banner */}
        <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
          <img
            src={property?.cover_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'}
            alt={property?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">Verified Quality PG</Badge>
                <span className="text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-slate-300 border border-slate-700">
                  {property?.city}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {property?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                {property?.address}, {property?.city}, {property?.state}
              </p>
            </div>

            <div className="bg-slate-950/80 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rent Starting From</span>
              <p className="text-xl font-black text-emerald-400">₹6,500 <span className="text-xs font-normal text-slate-400">/mo</span></p>
            </div>
          </div>
        </div>

        {/* 2-Column Content: Left Details / Right Schedule Visit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sharing Configurations */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Available Room Sharing Configurations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Single Occupancy</span>
                  <p className="text-lg font-extrabold text-white">₹14,500 <span className="text-xs text-slate-500 font-normal">/bed</span></p>
                  <p className="text-[11px] text-slate-400">Private room, attached bathroom & AC</p>
                </div>

                <div className="p-4 rounded-2xl glass-card border border-indigo-500/40 bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300 uppercase">Double Sharing</span>
                    <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded">Popular</span>
                  </div>
                  <p className="text-lg font-extrabold text-white">₹9,500 <span className="text-xs text-slate-500 font-normal">/bed</span></p>
                  <p className="text-[11px] text-slate-300">Spacious twin sharing, separate wardrobes</p>
                </div>

                <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Triple Sharing</span>
                  <p className="text-lg font-extrabold text-white">₹7,500 <span className="text-xs text-slate-500 font-normal">/bed</span></p>
                  <p className="text-[11px] text-slate-400">Budget friendly, study tables included</p>
                </div>
              </div>
            </div>

            {/* Amenities Included */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Included Living Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Lead Capture Box */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24 border-indigo-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Schedule Free PG Visit</CardTitle>
                <p className="text-xs text-slate-400">Experience the rooms, food, and facilities in person</p>
              </CardHeader>
              <CardContent>
                {isBooked ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Visit Scheduled!</h3>
                    <p className="text-xs text-slate-400">
                      Our property warden will WhatsApp you the exact Google Maps location pin.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                      <Input
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">WhatsApp Mobile Number *</label>
                      <Input
                        required
                        placeholder="9876543210"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Sharing Preference</label>
                      <select
                        value={inquirySharing}
                        onChange={(e) => setInquirySharing(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Single Room">Single Room (Private)</option>
                        <option value="Double Sharing">Double Sharing</option>
                        <option value="Triple Sharing">Triple Sharing</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Preferred Visit Date</label>
                      <Input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold gap-1.5 shadow-lg shadow-indigo-600/25 mt-2">
                      Confirm Visit Slot <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
