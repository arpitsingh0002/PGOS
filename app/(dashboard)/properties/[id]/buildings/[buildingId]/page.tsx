'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, BedDouble, Users, Plus, Utensils, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';

export default function BuildingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propId = (params?.id as string) || 'prop-1';
  const bldId = (params?.buildingId as string) || 'bld-1';

  const { properties, buildings, rooms, beds, tenants } = usePGStore();
  const property = properties.find((p) => p.id === propId) || properties[0];
  const building = buildings.find((b) => b.id === bldId) || buildings[0];

  const bldRooms = rooms.filter((r) => r.building_id === building?.id);
  const bldBeds = beds.filter((b) => bldRooms.some((r) => r.id === b.room_id));
  const bldTenants = tenants.filter((t) => t.building_id === building?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/properties/${property?.id}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{building?.name}</h1>
              {building?.has_mess && <Badge variant="success">Mess Active</Badge>}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Part of {property?.name} &bull; {building?.floors_count} Floors &bull; {bldRooms.length} Rooms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {building?.has_mess && (
            <Link href={`/mess/${building.id}`}>
              <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                <Utensils className="h-3.5 w-3.5 text-emerald-400" /> Mess Management
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Building Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <span className="text-xs text-slate-400">Total Rooms</span>
          <p className="text-2xl font-bold text-white mt-1">{bldRooms.length}</p>
        </Card>
        <Card className="glass-card">
          <span className="text-xs text-slate-400">Total Bed Capacity</span>
          <p className="text-2xl font-bold text-white mt-1">{bldBeds.length}</p>
          <span className="text-[11px] text-emerald-400">
            {bldBeds.filter((b) => b.status === 'occupied').length} Occupied
          </span>
        </Card>
        <Card className="glass-card">
          <span className="text-xs text-slate-400">Active Tenants</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{bldTenants.length}</p>
        </Card>
      </div>

      {/* Rooms List in this building */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Rooms in {building?.name}</CardTitle>
            <p className="text-xs text-slate-400">Select a room to view and edit its visual bed grid</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bldRooms.map((room) => {
              const roomBeds = bldBeds.filter((b) => b.room_id === room.id);
              const occupiedCount = roomBeds.filter((b) => b.status === 'occupied').length;

              return (
                <Link
                  key={room.id}
                  href={`/properties/${property?.id}/buildings/${building?.id}/rooms/${room.id}`}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white group-hover:text-indigo-300">
                      Room {room.room_number}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Floor {room.floor}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 capitalize">
                    {room.sharing_type} Sharing &bull; {formatINR(room.base_rent)} / bed
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {occupiedCount} / {roomBeds.length} Beds Occupied
                    </span>
                    <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                      Bed Grid &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
