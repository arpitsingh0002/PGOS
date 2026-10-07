'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  BedDouble,
  Users,
  MapPin,
  Plus,
  ArrowLeft,
  Calendar,
  UtensilsCrossed,
  Receipt,
  AlertCircle,
  Settings,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate, getBedStatusBadge, getComplaintStatusBadge } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propId = (params?.id as string) || 'prop-1';

  const {
    properties,
    buildings,
    rooms,
    beds,
    tenants,
    complaints,
    payments,
    expenses,
    featureFlags,
    updateFeatureFlag,
    addBuilding,
    addRoom,
    updateBedStatus,
    getPropertyOccupancyStats,
  } = usePGStore();

  const property = properties.find((p) => p.id === propId) || properties[0];
  const propOccupancy = getPropertyOccupancyStats(property?.id, rooms, beds);
  const propBuildings = buildings.filter((b) => b.property_id === property?.id);
  const propRooms = rooms.filter((r) => r.property_id === property?.id);
  const propRoomIds = new Set(propRooms.map((r) => r.id));
  const propBeds = beds.filter((b) => b.property_id === property?.id || propRoomIds.has(b.room_id));
  const propTenants = tenants.filter((t) => t.property_id === property?.id);
  const propComplaints = complaints.filter((c) => c.property_id === property?.id);
  const propPayments = payments.filter((p) => p.property_id === property?.id);
  const propExpenses = expenses.filter((e) => e.property_id === property?.id);
  const propFeatures = featureFlags[property?.id] || {
    id: `feat-${property?.id}`,
    property_id: property?.id,
    mess_enabled: true,
    electricity_billing_enabled: true,
    staff_management_enabled: true,
    biometric_sync_enabled: false,
    visitor_qr_enabled: false,
    whatsapp_reminders_enabled: true,
  };

  const [activeTab, setActiveTab] = React.useState('overview');
  const [showAddBuildingModal, setShowAddBuildingModal] = React.useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = React.useState(false);

  // New building form state
  const [bldName, setBldName] = React.useState('');
  const [bldFloors, setBldFloors] = React.useState(3);
  const [bldHasMess, setBldHasMess] = React.useState(true);

  // New room form state
  const [selectedBldId, setSelectedBldId] = React.useState(propBuildings[0]?.id || '');
  const [roomNum, setRoomNum] = React.useState('');
  const [roomFloor, setRoomFloor] = React.useState(1);
  const [roomSharing, setRoomSharing] = React.useState('double');
  const [roomBedsCount, setRoomBedsCount] = React.useState(2);
  const [roomRent, setRoomRent] = React.useState(8500);

  const handleCreateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bldName) return;
    addBuilding({
      property_id: property.id,
      name: bldName,
      floors_count: Number(bldFloors),
      has_mess: bldHasMess,
    });
    toast.success(`Building "${bldName}" added!`);
    setShowAddBuildingModal(false);
    setBldName('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNum) return;
    addRoom({
      property_id: property.id,
      building_id: selectedBldId || propBuildings[0]?.id || 'bld-1',
      room_number: roomNum,
      floor: Number(roomFloor),
      sharing_type: roomSharing,
      total_beds: Number(roomBedsCount),
      base_rent: Number(roomRent),
      has_attached_bathroom: true,
      has_balcony: false,
      has_ac: true,
    });
    toast.success(`Room ${roomNum} with ${roomBedsCount} beds created!`);
    setShowAddRoomModal(false);
    setRoomNum('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'buildings', label: 'Buildings', count: propBuildings.length },
    { id: 'rooms', label: 'Rooms & Beds', count: propRooms.length },
    { id: 'tenants', label: 'Tenants', count: propTenants.length },
    { id: 'complaints', label: 'Complaints', count: propComplaints.length },
    { id: 'settings', label: 'Branch Settings' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Property Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-4">
          <Link href="/properties">
            <Button variant="ghost" size="icon" className="h-9 w-9 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{property?.name}</h1>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              {property?.address}, {property?.city}, {property?.state} - {property?.pincode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/pg/${property?.id}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Public Listing
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setShowAddBuildingModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-3.5 w-3.5" /> Add Building
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Total Buildings</span>
                <p className="text-2xl font-black text-slate-950 mt-1">
                  {propBuildings.length > 0 ? propBuildings.length : '—'}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-2">
                <>Total Rooms: <strong className="text-slate-900 font-bold">{propRooms.length > 0 ? propRooms.length : '—'}</strong></>
              </p>
            </Card>

            <Card className="p-4 bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Total Beds</span>
                <p className="text-2xl font-black text-slate-950 mt-1">
                  {propOccupancy.totalBeds > 0 ? propOccupancy.totalBeds : '—'}
                </p>
              </div>
              <p className="text-xs font-bold text-emerald-800 mt-2">
                <>Occupied Beds: <strong className="text-slate-900 font-bold">{propOccupancy.totalBeds > 0 ? propOccupancy.occupiedBeds : '—'}</strong></>
              </p>
            </Card>

            <Card className="p-4 bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Monthly Revenue</span>
                <p className="text-2xl font-black text-emerald-800 mt-1">
                  {propPayments.length > 0 ? formatINR(propPayments.reduce((s, p) => s + p.amount, 0)) : '—'}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-2">
                <>Recorded Payments: <strong className="text-slate-900 font-bold">{propPayments.length > 0 ? propPayments.length : '0'}</strong></>
              </p>
            </Card>

            <Card className="p-4 bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Active Complaints</span>
                <p className="text-2xl font-black text-rose-700 mt-1">
                  {propComplaints.length > 0 ? propComplaints.filter((c) => c.status !== 'resolved').length : 0}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-2">
                <>Total Tickets: <strong className="text-slate-900 font-bold">{propComplaints.length > 0 ? propComplaints.length : '0'}</strong></>
              </p>
            </Card>
          </div>

          {/* Buildings Quick Grid */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base text-white">Buildings in this Branch</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowAddBuildingModal(true)} className="text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Block
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propBuildings.map((bld) => {
                  const bldRooms = propRooms.filter((r) => r.building_id === bld.id);
                  const bldRoomIds = new Set(bldRooms.map((r) => r.id));
                  const bldBeds = propBeds.filter((b) => bldRoomIds.has(b.room_id));

                  return (
                    <div
                      key={bld.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{bld.name}</h4>
                        {bld.has_mess && (
                          <Badge variant="default" className="text-[10px]">Mess Enabled</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{bld.description || `${bld.floors_count} Floors structure`}</p>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-semibold">
                          <span>Rooms: <strong className="text-white">{bldRooms.length > 0 ? bldRooms.length : '—'}</strong> • Beds: <strong className="text-white">{bldBeds.length > 0 ? bldBeds.length : '—'}</strong></span>
                        </span>
                        <Link href={`/properties/${property.id}/buildings/${bld.id}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-400 hover:text-indigo-300">
                            View Rooms &rarr;
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: BUILDINGS */}
      {activeTab === 'buildings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">All Blocks & Wings</h3>
            <Button size="sm" onClick={() => setShowAddBuildingModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Building
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propBuildings.map((b) => (
              <div key={b.id} className="p-4 rounded-xl glass-card border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">{b.name}</span>
                    <span className="text-xs text-slate-400">{b.floors_count} Floors</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{b.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">{b.has_mess ? 'Mess Kitchen Active' : 'No Mess'}</span>
                  </div>
                  <Link href={`/properties/${property.id}/buildings/${b.id}`}>
                    <Button size="sm" variant="secondary" className="h-8 text-xs">
                      Manage Rooms &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROOMS & BEDS (Visual Grid) */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Visual Room & Bed Matrix</h3>
              <p className="text-xs text-slate-400">Click any bed to view occupant or change allocation status</p>
            </div>
            <Button size="sm" onClick={() => setShowAddRoomModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Room
            </Button>
          </div>

          {/* Status Color Legend */}
          <div className="flex items-center gap-4 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex-wrap">
            <span className="text-slate-400 font-semibold">Bed Status:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-zinc-600" />
              <span className="text-slate-300">Maintenance</span>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propRooms.map((room) => {
              const roomBeds = propBeds.filter((b) => b.room_id === room.id);
              return (
                <div key={room.id} className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">Room {room.room_number}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">
                        Floor {room.floor} &bull; {room.sharing_type} Sharing &bull; {formatINR(room.base_rent)}/bed
                      </p>
                    </div>
                    <Link href={`/properties/${property.id}/buildings/${room.building_id}/rooms/${room.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-indigo-400">
                        Details &rarr;
                      </Button>
                    </Link>
                  </div>

                  {/* Bed Grid inside room */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {roomBeds.map((bed) => {
                      const tenant = propTenants.find((t) => t.bed_id === bed.id && t.status === 'active');
                      const statusColors = {
                        available: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400 hover:border-emerald-500',
                        occupied: 'border-rose-500/40 bg-rose-950/20 text-rose-400 hover:border-rose-500',
                        reserved: 'border-amber-500/40 bg-amber-950/20 text-amber-400 hover:border-amber-500',
                        maintenance: 'border-zinc-700 bg-zinc-900/60 text-zinc-400',
                      };

                      return (
                        <div
                          key={bed.id}
                          onClick={() => {
                            if (bed.status === 'available') {
                              router.push(`/tenants/new?bedId=${bed.id}&roomId=${room.id}`);
                            } else if (tenant) {
                              router.push(`/tenants/${tenant.id}`);
                            }
                          }}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${statusColors[bed.status]}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{bed.bed_number}</span>
                            <span className="h-2 w-2 rounded-full bg-current" />
                          </div>
                          <p className="text-[11px] font-medium truncate mt-1 text-slate-200">
                            {tenant ? tenant.full_name : bed.status}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: TENANTS */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Active Tenants in {property.name}</h3>
            <Link href="/tenants/new">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Tenant
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="p-3">Tenant Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Room / Bed</th>
                  <th className="p-3">Monthly Rent</th>
                  <th className="p-3">Joining Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {propTenants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                      No residents currently checked in to this property.
                    </td>
                  </tr>
                ) : (
                  propTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{t.full_name}</td>
                      <td className="p-3 text-slate-400">{t.phone}</td>
                      <td className="p-3">{t.room_number || 'Room 101'}</td>
                      <td className="p-3 font-bold text-emerald-400">{formatINR(t.monthly_rent)}</td>
                      <td className="p-3 text-slate-400">{formatDate(t.joining_date)}</td>
                      <td className="p-3">
                        <Link href={`/tenants/${t.id}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-400">
                            Profile &rarr;
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Maintenance Tickets</h3>
            <Link href="/complaints/new">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> File Complaint
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {propComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
                No active complaints or maintenance requests for this branch.
              </div>
            ) : (
              propComplaints.map((c) => {
                const badge = getComplaintStatusBadge(c.status);
                return (
                  <div key={c.id} className="p-4 rounded-xl glass-card border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{c.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Reported by {c.tenant_name} &bull; Room {c.room_number} &bull; Priority: {c.priority}
                      </p>
                    </div>
                    <Link href="/complaints">
                      <Button size="sm" variant="secondary" className="h-8 text-xs">
                        Update Ticket
                      </Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 6: BRANCH SETTINGS & FEATURE FLAGS */}
      {activeTab === 'settings' && (
        <Card className="glass-card max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              Feature Flags for {property.name}
            </CardTitle>
            <p className="text-xs text-slate-400">Enable or disable specific operational modules for this property</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="text-xs font-semibold text-white">Mess & Food Management</p>
                <p className="text-[11px] text-slate-400">Weekly menus, grocery expenses and meal attendance</p>
              </div>
              <input
                type="checkbox"
                checked={propFeatures.mess_enabled}
                onChange={(e) => updateFeatureFlag(property.id, 'mess_enabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="text-xs font-semibold text-white">Submeter Electricity Billing</p>
                <p className="text-[11px] text-slate-400">Calculate room meter consumption and auto-add to rent</p>
              </div>
              <input
                type="checkbox"
                checked={propFeatures.electricity_billing_enabled}
                onChange={(e) => updateFeatureFlag(property.id, 'electricity_billing_enabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="text-xs font-semibold text-white">Automated WhatsApp Reminders</p>
                <p className="text-[11px] text-slate-400">Auto-send monthly invoice PDFs and due date alerts</p>
              </div>
              <input
                type="checkbox"
                checked={propFeatures.whatsapp_reminders_enabled}
                onChange={(e) => updateFeatureFlag(property.id, 'whatsapp_reminders_enabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal: Add Building */}
      <Modal
        isOpen={showAddBuildingModal}
        onClose={() => setShowAddBuildingModal(false)}
        title="Add Building / Wing"
        description={`Add a new building to ${property?.name}`}
      >
        <form onSubmit={handleCreateBuilding} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Building Name *</label>
            <Input
              required
              placeholder="e.g. Block C (Annex)"
              value={bldName}
              onChange={(e) => setBldName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Floors Count</label>
              <Input
                type="number"
                min="1"
                value={bldFloors}
                onChange={(e) => setBldFloors(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="hasMess"
                checked={bldHasMess}
                onChange={(e) => setBldHasMess(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600"
              />
              <label htmlFor="hasMess" className="text-xs text-slate-300 cursor-pointer">
                Has Mess Kitchen
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddBuildingModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
              Create Building
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Room */}
      <Modal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        title="Add New Room"
        description="Add a room and auto-generate its bed slots"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Select Building</label>
            <select
              value={selectedBldId}
              onChange={(e) => setSelectedBldId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
            >
              {propBuildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Room Number *</label>
              <Input
                required
                placeholder="e.g. 204"
                value={roomNum}
                onChange={(e) => setRoomNum(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Floor</label>
              <Input
                type="number"
                value={roomFloor}
                onChange={(e) => setRoomFloor(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Total Beds</label>
              <Input
                type="number"
                min="1"
                max="8"
                value={roomBedsCount}
                onChange={(e) => setRoomBedsCount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Rent per Bed (₹)</label>
              <Input
                type="number"
                value={roomRent}
                onChange={(e) => setRoomRent(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddRoomModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
              Create Room & Beds
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
