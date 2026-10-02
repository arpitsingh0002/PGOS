'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BedDouble,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Wrench,
  UserPlus,
  Zap,
  Shield,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, formatPhone } from '@/lib/utils/format';
import { Bed } from '@/types/database';
import { toast } from 'sonner';

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propId = (params?.id as string) || 'prop-1';
  const bldId = (params?.buildingId as string) || 'bld-1';
  const roomId = (params?.roomId as string) || 'room-101';

  const { properties, buildings, rooms, beds, tenants, updateBedStatus } = usePGStore();

  const property = properties.find((p) => p.id === propId) || properties[0];
  const building = buildings.find((b) => b.id === bldId) || buildings[0];
  const room = rooms.find((r) => r.id === roomId) || rooms[0];

  const roomBeds = beds.filter((b) => b.room_id === room?.id);
  const [selectedBed, setSelectedBed] = React.useState<Bed | null>(null);

  const activeTenantForBed = selectedBed
    ? tenants.find((t) => t.bed_id === selectedBed.id && t.status === 'active')
    : null;

  const handleStatusChange = (newStatus: Bed['status']) => {
    if (!selectedBed) return;
    updateBedStatus(selectedBed.id, newStatus);
    setSelectedBed({ ...selectedBed, status: newStatus });
    toast.success(`Bed status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/properties/${property?.id}/buildings/${building?.id}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Room {room?.room_number}</h1>
              <Badge variant="secondary" className="capitalize">{room?.sharing_type} Sharing</Badge>
              {room?.has_ac && <Badge variant="default">AC</Badge>}
              {room?.has_attached_bathroom && <Badge variant="outline">Attached Bath</Badge>}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {property?.name} &bull; {building?.name} &bull; Floor {room?.floor}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Monthly Rent per Bed</span>
          <p className="text-lg font-bold text-emerald-400">{formatINR(room?.base_rent || 8500)}</p>
        </div>
      </div>

      {/* Visual Bed Grid Section */}
      <Card className="glass-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-indigo-400" />
              Interactive Bed Layout & Allocation Grid
            </CardTitle>
            <p className="text-xs text-slate-400">
              Click any bed card below to inspect occupant, modify status, or onboard a new tenant.
            </p>
          </div>

          {/* Color Key */}
          <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Occupied
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Reserved
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" /> Maintenance
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {roomBeds.map((bed) => {
              const occupant = tenants.find((t) => t.bed_id === bed.id && t.status === 'active');

              const cardStyles = {
                available: 'border-emerald-500/40 bg-emerald-950/15 hover:border-emerald-400 hover:bg-emerald-950/30 text-emerald-400',
                occupied: 'border-rose-500/40 bg-rose-950/15 hover:border-rose-400 hover:bg-rose-950/30 text-rose-400',
                reserved: 'border-amber-500/40 bg-amber-950/15 hover:border-amber-400 hover:bg-amber-950/30 text-amber-400',
                maintenance: 'border-zinc-700 bg-zinc-900/60 hover:border-zinc-500 text-zinc-400',
              };

              const indicatorColors = {
                available: 'bg-emerald-500 shadow-emerald-500/50',
                occupied: 'bg-rose-500 shadow-rose-500/50',
                reserved: 'bg-amber-500 shadow-amber-500/50',
                maintenance: 'bg-zinc-500 shadow-zinc-500/50',
              };

              return (
                <div
                  key={bed.id}
                  onClick={() => setSelectedBed(bed)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 transform hover:-translate-y-1 shadow-lg ${cardStyles[bed.status]}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-extrabold text-white tracking-wide">{bed.bed_number}</span>
                    <span className={`h-3 w-3 rounded-full shadow-sm ${indicatorColors[bed.status]}`} />
                  </div>

                  {occupant ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white truncate">{occupant.full_name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {formatPhone(occupant.phone)}
                      </p>
                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Rent:</span>
                        <span className="font-bold text-white">{formatINR(occupant.monthly_rent)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center">
                      <span className="text-xs font-semibold capitalize tracking-wide">{bed.status}</span>
                      <p className="text-[11px] text-slate-400 mt-1">{formatINR(bed.monthly_rent)}/mo</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bed Details Modal / Drawer */}
      {selectedBed && (
        <Modal
          isOpen={!!selectedBed}
          onClose={() => setSelectedBed(null)}
          title={`Bed Details — ${selectedBed.bed_number} (Room ${room?.room_number})`}
          description={`Rent: ${formatINR(selectedBed.monthly_rent)} / month`}
        >
          <div className="space-y-4">
            {/* Occupant Info */}
            {activeTenantForBed ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {activeTenantForBed.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{activeTenantForBed.full_name}</h4>
                      <p className="text-xs text-slate-400">{formatPhone(activeTenantForBed.phone)}</p>
                    </div>
                  </div>
                  <Badge variant="success">Active Tenant</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-500">Joined:</span> {formatDate(activeTenantForBed.joining_date)}
                  </div>
                  <div>
                    <span className="text-slate-500">Deposit:</span> {formatINR(activeTenantForBed.security_deposit)}
                  </div>
                  <div>
                    <span className="text-slate-500">Agreement:</span>{' '}
                    <span className="capitalize text-emerald-400 font-medium">{activeTenantForBed.agreement_status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ID Proof:</span> {activeTenantForBed.id_proof_type || 'Aadhaar'}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/tenants/${activeTenantForBed.id}`}>
                    <Button size="sm" variant="outline" className="w-full text-xs gap-1.5">
                      View Full Tenant Profile &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <BedDouble className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">This Bed is Currently Unoccupied</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Ready for new tenant check-in</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push(
                      `/tenants/new?bedId=${selectedBed.id}&roomId=${room?.id}&buildingId=${building?.id}&propertyId=${property?.id}`
                    );
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5"
                >
                  <UserPlus className="h-4 w-4" /> Onboard Tenant into this Bed
                </Button>
              </div>
            )}

            {/* Quick Status Toggles */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Set Bed Allocation Status</label>
              <div className="grid grid-cols-4 gap-2">
                {(['available', 'occupied', 'reserved', 'maintenance'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-2 text-xs rounded-lg font-medium border capitalize transition-all ${
                      selectedBed.status === st
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
