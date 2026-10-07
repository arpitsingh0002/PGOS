'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  MapPin,
  BedDouble,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';

export default function PropertiesPage() {
  const router = useRouter();
  const { properties } = usePGStore();
  const [search, setSearch] = React.useState('');

  const filtered = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            Properties Portfolio
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
              {properties.length} Properties
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Manage your branches, buildings, rooms and capacity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/properties/new">
            <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold gap-1.5 shadow-sm">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-700 stroke-[2.5]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or address..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-950 placeholder:text-slate-600 focus:border-indigo-600 focus:outline-none"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <Card
            key={prop.id}
            className="glass-card overflow-hidden p-0 flex flex-col justify-between group border-slate-300 hover:border-indigo-400 shadow-sm"
          >
            {/* Cover Image Banner */}
            <div className="h-40 w-full relative overflow-hidden bg-slate-200">
              {prop.cover_image && (
                <img
                  src={prop.cover_image}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-white/95 text-emerald-800 border border-emerald-300 shadow-sm backdrop-blur-md">
                  {prop.occupancy_rate || (prop.total_beds ? Math.round(((prop.occupied_beds || 0) / prop.total_beds) * 100) : 80)}% Occupied
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 preserve-white-text">
                <h3 className="text-base font-extrabold text-white group-hover:text-indigo-200 transition-colors drop-shadow-md">
                  {prop.name}
                </h3>
                <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5 font-bold drop-shadow">
                  <MapPin className="h-3.5 w-3.5 text-indigo-300 stroke-[2.5]" /> {prop.city}, {prop.address}
                </p>
              </div>
            </div>

            {/* Metrics Body */}
            <div className="p-5 space-y-4 flex-1">
              <div className="grid grid-cols-3 gap-2 text-center py-2 px-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-700 uppercase font-black">Buildings</span>
                  <p className="text-sm font-black text-slate-950">{prop.buildings_count || 1}</p>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-700 uppercase font-black">Total Beds</span>
                  <p className="text-sm font-black text-slate-950">{prop.total_beds || 10}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-700 uppercase font-black">Occupied</span>
                  <p className="text-sm font-black text-emerald-800">{prop.occupied_beds || 8}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1.5">
                  <span>Occupancy Capacity</span>
                  <span className="font-black text-slate-950">
                    {prop.occupied_beds || 8} / {prop.total_beds || 10} Beds ({prop.occupancy_rate || 80}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/60">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${prop.occupancy_rate || 80}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 pt-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/60">
              <Link
                href={`/pg/${prop.id}`}
                target="_blank"
                className="text-xs font-bold text-slate-700 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                Public Page <ExternalLink className="h-3 w-3 stroke-[2.5]" />
              </Link>

              <Link href={`/properties/${prop.id}`}>
                <Button size="sm" variant="secondary" className="h-8 text-xs font-bold gap-1 border border-slate-300 text-slate-900 bg-white hover:bg-slate-100">
                  Manage Branch <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
