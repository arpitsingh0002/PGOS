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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Properties Portfolio
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {properties.length} Properties
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your branches, buildings, rooms and capacity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/properties/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-md shadow-indigo-600/20">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or address..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <Card
            key={prop.id}
            className="glass-card overflow-hidden p-0 flex flex-col justify-between group hover:border-indigo-500/40"
          >
            {/* Cover Image Banner */}
            <div className="h-40 w-full relative overflow-hidden bg-slate-800">
              {prop.cover_image && (
                <img
                  src={prop.cover_image}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  {prop.occupancy_rate}% Occupied
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {prop.name}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-indigo-400" /> {prop.city}, {prop.address}
                </p>
              </div>
            </div>

            {/* Metrics Body */}
            <div className="p-5 space-y-4 flex-1">
              <div className="grid grid-cols-3 gap-2 text-center py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Buildings</span>
                  <p className="text-sm font-bold text-white">{prop.buildings_count || 1}</p>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Beds</span>
                  <p className="text-sm font-bold text-white">{prop.total_beds || 10}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Occupied</span>
                  <p className="text-sm font-bold text-emerald-400">{prop.occupied_beds || 8}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Occupancy Capacity</span>
                  <span className="font-semibold text-white">{prop.occupied_beds} / {prop.total_beds}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${prop.occupancy_rate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 pt-3 border-t border-slate-800/60 flex items-center justify-between bg-slate-950/40">
              <Link
                href={`/pg/${prop.id}`}
                target="_blank"
                className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Public Page <ExternalLink className="h-3 w-3" />
              </Link>

              <Link href={`/properties/${prop.id}`}>
                <Button size="sm" variant="secondary" className="h-8 text-xs gap-1">
                  Manage Branch <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
