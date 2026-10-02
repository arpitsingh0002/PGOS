'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, UserPlus, Check, BedDouble, Shield, Phone, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR } from '@/lib/utils/format';
import { toast } from 'sonner';

function TenantFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preBedId = searchParams.get('bedId');
  const preRoomId = searchParams.get('roomId');
  const prePropId = searchParams.get('propertyId');
  const preBldId = searchParams.get('buildingId');

  const { properties, buildings, rooms, beds, addTenant } = usePGStore();

  const [propertyId, setPropertyId] = React.useState(prePropId || properties[0]?.id || 'prop-1');
  const [buildingId, setBuildingId] = React.useState(preBldId || buildings[0]?.id || 'bld-1');
  const [roomId, setRoomId] = React.useState(preRoomId || rooms[0]?.id || 'room-101');
  const [bedId, setBedId] = React.useState(preBedId || beds.find((b) => b.status === 'available')?.id || beds[0]?.id);

  // Available beds for selected room
  const availableBeds = beds.filter((b) => b.room_id === roomId && (b.status === 'available' || b.id === preBedId));
  const selectedBedObj = beds.find((b) => b.id === bedId);

  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [joiningDate, setJoiningDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [monthlyRent, setMonthlyRent] = React.useState(selectedBedObj?.monthly_rent || 8500);
  const [securityDeposit, setSecurityDeposit] = React.useState(17000);
  const [emergencyName, setEmergencyName] = React.useState('');
  const [emergencyPhone, setEmergencyPhone] = React.useState('');
  const [idProofType, setIdProofType] = React.useState('Aadhaar');
  const [idProofNumber, setIdProofNumber] = React.useState('');
  const [agreementStatus, setAgreementStatus] = React.useState<'signed' | 'pending'>('signed');

  // Update rent when bed changes
  React.useEffect(() => {
    if (selectedBedObj) {
      setMonthlyRent(selectedBedObj.monthly_rent);
      setSecurityDeposit(selectedBedObj.monthly_rent * 2);
    }
  }, [selectedBedObj]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error('Please enter full name and mobile number');
      return;
    }

    const currentProp = properties.find((p) => p.id === propertyId);
    const currentBld = buildings.find((b) => b.id === buildingId);
    const currentRoom = rooms.find((r) => r.id === roomId);
    const currentBed = beds.find((b) => b.id === bedId);

    const created = addTenant({
      property_id: propertyId,
      building_id: buildingId,
      room_id: roomId,
      bed_id: bedId,
      full_name: fullName,
      phone,
      email: email || undefined,
      joining_date: joiningDate,
      monthly_rent: Number(monthlyRent),
      security_deposit: Number(securityDeposit),
      id_proof_type: idProofType,
      id_proof_number: idProofNumber,
      emergency_contact_name: emergencyName,
      emergency_contact_phone: emergencyPhone,
      agreement_status: agreementStatus,
      property_name: currentProp?.name,
      building_name: currentBld?.name,
      room_number: currentRoom?.room_number,
      bed_number: currentBed?.bed_number,
    });

    toast.success(`Tenant ${fullName} onboarded and bed assigned!`);
    router.push(`/tenants/${created.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tenants">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Onboard New Tenant</h1>
          <p className="text-xs text-slate-400">Allocate an available bed, capture ID proof, and initialize rent ledger</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">1. Personal & Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Legal Name *</label>
              <Input
                required
                placeholder="e.g. Siddharth Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mobile Phone (WhatsApp) *</label>
                <Input
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <Input
                  type="email"
                  placeholder="siddharth@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Emergency Contact Person</label>
                <Input
                  placeholder="e.g. Father: Ramesh Verma"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Emergency Phone</label>
                <Input
                  placeholder="9845012345"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room & Bed Allocation */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">2. Room & Bed Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Branch Property</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Building / Block</label>
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {buildings.filter((b) => b.property_id === propertyId).map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Room Number</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {rooms.filter((r) => r.property_id === propertyId).map((r) => (
                    <option key={r.id} value={r.id}>Room {r.room_number}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Assigned Bed Slot *</label>
              <select
                value={bedId}
                onChange={(e) => setBedId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-emerald-400 font-semibold focus:outline-none"
              >
                {beds.filter((b) => b.room_id === roomId).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bed_number} — Status: {b.status.toUpperCase()} ({formatINR(b.monthly_rent)}/mo)
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Financial Contract & KYC */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">3. Rent Terms & Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Joining Date *</label>
                <Input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Agreed Monthly Rent (₹)</label>
                <Input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Security Deposit (₹)</label>
                <Input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">ID Proof Type</label>
                <select
                  value={idProofType}
                  onChange={(e) => setIdProofType(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">ID Proof Number</label>
                <Input
                  placeholder="e.g. 5621 8890 1234"
                  value={idProofNumber}
                  onChange={(e) => setIdProofNumber(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link href="/tenants">
            <Button type="button" variant="outline" size="sm">Cancel</Button>
          </Link>
          <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25">
            <Check className="h-4 w-4" /> Complete Onboarding
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewTenantPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading onboarding form...</div>}>
      <TenantFormContent />
    </React.Suspense>
  );
}

