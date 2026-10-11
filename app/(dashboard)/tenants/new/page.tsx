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

  const { properties, buildings, rooms, beds, addTenant, dataMode } = usePGStore();

  const [propertyId, setPropertyId] = React.useState<string>(prePropId || '');
  const [buildingId, setBuildingId] = React.useState<string>(preBldId || '');
  const [roomId, setRoomId] = React.useState<string>(preRoomId || '');
  const [bedId, setBedId] = React.useState<string>(preBedId || '');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [joiningDate, setJoiningDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [monthlyRent, setMonthlyRent] = React.useState(8500);
  const [securityDeposit, setSecurityDeposit] = React.useState(17000);
  const [emergencyName, setEmergencyName] = React.useState('');
  const [emergencyPhone, setEmergencyPhone] = React.useState('');
  const [idProofType, setIdProofType] = React.useState('Aadhaar');
  const [idProofNumber, setIdProofNumber] = React.useState('');
  const [agreementStatus, setAgreementStatus] = React.useState<'signed' | 'pending'>('signed');

  // Available cascades
  const availableBuildings = React.useMemo(() => {
    return properties.length > 0 && propertyId
      ? buildings.filter((b) => b.property_id === propertyId)
      : [];
  }, [buildings, properties, propertyId]);

  const availableRooms = React.useMemo(() => {
    if (!propertyId) return [];
    if (buildingId) {
      return rooms.filter((r) => r.building_id === buildingId);
    }
    return rooms.filter((r) => r.property_id === propertyId);
  }, [rooms, propertyId, buildingId]);

  // Only free beds (or pre-selected bed)
  const availableBeds = React.useMemo(() => {
    if (!roomId) return [];
    return beds.filter((b) => b.room_id === roomId && (b.status === 'available' || b.id === preBedId));
  }, [beds, roomId, preBedId]);

  const selectedBedObj = React.useMemo(() => beds.find((b) => b.id === bedId), [beds, bedId]);

  // Cascade initializers: automatically select rooms that actually have free bed slots
  React.useEffect(() => {
    if (properties.length > 0) {
      if (!propertyId || !properties.some((p) => p.id === propertyId)) {
        const defaultProp = (prePropId && properties.some((p) => p.id === prePropId)) ? prePropId : properties[0].id;
        setPropertyId(defaultProp);
      }
    }
  }, [properties, propertyId, prePropId]);

  React.useEffect(() => {
    if (availableBuildings.length > 0) {
      if (!buildingId || !availableBuildings.some((b) => b.id === buildingId)) {
        const defaultBld = (preBldId && availableBuildings.some((b) => b.id === preBldId)) ? preBldId : availableBuildings[0].id;
        setBuildingId(defaultBld);
      }
    } else {
      setBuildingId('');
    }
  }, [availableBuildings, buildingId, preBldId]);

  React.useEffect(() => {
    if (availableRooms.length > 0) {
      if (!roomId || !availableRooms.some((r) => r.id === roomId)) {
        // Find the first room in this building that actually has free beds
        const roomWithFreeBeds = availableRooms.find((r) =>
          beds.some((b) => b.room_id === r.id && (b.status === 'available' || b.id === preBedId))
        );
        const defaultRoom = preRoomId && availableRooms.some((r) => r.id === preRoomId)
          ? preRoomId
          : roomWithFreeBeds
          ? roomWithFreeBeds.id
          : availableRooms[0].id;
        setRoomId(defaultRoom);
      }
    } else {
      setRoomId('');
    }
  }, [availableRooms, roomId, preRoomId, beds, preBedId]);

  React.useEffect(() => {
    if (availableBeds.length > 0) {
      if (!bedId || !availableBeds.some((b) => b.id === bedId)) {
        const defaultBed = (preBedId && availableBeds.some((b) => b.id === preBedId)) ? preBedId : availableBeds[0].id;
        setBedId(defaultBed);
      }
    } else {
      setBedId('');
    }
  }, [availableBeds, bedId, preBedId]);

  // Update rent when bed changes
  React.useEffect(() => {
    if (selectedBedObj) {
      setMonthlyRent(selectedBedObj.monthly_rent);
      setSecurityDeposit(selectedBedObj.monthly_rent * 2);
    }
  }, [selectedBedObj]);

  const handlePropertyChange = (newPropId: string) => {
    setPropertyId(newPropId);
    setErrors((prev) => ({ ...prev, propertyId: '', buildingId: '', roomId: '', bedId: '' }));
    const blds = buildings.filter((b) => b.property_id === newPropId);
    const firstBld = blds[0]?.id || '';
    setBuildingId(firstBld);

    const rms = firstBld ? rooms.filter((r) => r.building_id === firstBld) : rooms.filter((r) => r.property_id === newPropId);
    const roomWithFreeBeds = rms.find((r) =>
      beds.some((b) => b.room_id === r.id && b.status === 'available')
    );
    const chosenRm = roomWithFreeBeds ? roomWithFreeBeds.id : rms[0]?.id || '';
    setRoomId(chosenRm);

    const bds = chosenRm ? beds.filter((b) => b.room_id === chosenRm && b.status === 'available') : [];
    setBedId(bds[0]?.id || '');
  };

  const handleBuildingChange = (newBldId: string) => {
    setBuildingId(newBldId);
    setErrors((prev) => ({ ...prev, buildingId: '', roomId: '', bedId: '' }));
    const rms = rooms.filter((r) => r.building_id === newBldId);
    const roomWithFreeBeds = rms.find((r) =>
      beds.some((b) => b.room_id === r.id && b.status === 'available')
    );
    const chosenRm = roomWithFreeBeds ? roomWithFreeBeds.id : rms[0]?.id || '';
    setRoomId(chosenRm);

    const bds = chosenRm ? beds.filter((b) => b.room_id === chosenRm && b.status === 'available') : [];
    setBedId(bds[0]?.id || '');
  };

  const handleRoomChange = (newRoomId: string) => {
    setRoomId(newRoomId);
    setErrors((prev) => ({ ...prev, roomId: '', bedId: '' }));
    const bds = beds.filter((b) => b.room_id === newRoomId && (b.status === 'available' || b.id === preBedId));
    setBedId(bds[0]?.id || '');
  };

  const handleBedChange = (newBedId: string) => {
    setBedId(newBedId);
    setErrors((prev) => ({ ...prev, bedId: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full legal name is required';
    if (!phone.trim()) newErrors.phone = 'Mobile phone number is required';
    if (!propertyId) newErrors.propertyId = 'Property is required';
    if (!buildingId) newErrors.buildingId = 'Building / Block is required';
    if (!roomId) newErrors.roomId = 'Room number is required';
    if (!bedId) newErrors.bedId = 'Assigned bed slot is required (must select an available bed)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please complete all required fields and select an available bed.');
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
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      joining_date: joiningDate,
      monthly_rent: Number(monthlyRent),
      security_deposit: Number(securityDeposit),
      id_proof_type: idProofType,
      id_proof_number: idProofNumber.trim(),
      emergency_contact_name: emergencyName.trim(),
      emergency_contact_phone: emergencyPhone.trim(),
      agreement_status: agreementStatus,
      property_name: currentProp?.name,
      building_name: currentBld?.name,
      room_number: currentRoom?.room_number,
      bed_number: currentBed?.bed_number,
    });

    toast.success(`Tenant ${fullName} onboarded and bed assigned!`);
    router.push(`/tenants/${created.id}`);
  };

  if (dataMode === 'loading') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-8 bg-slate-200 rounded-xl w-64" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

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
                placeholder="e.g. Siddharth Verma"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                className={errors.fullName ? 'border-rose-500' : ''}
              />
              {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mobile Phone (WhatsApp) *</label>
                <Input
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={errors.phone ? 'border-rose-500' : ''}
                />
                {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
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
                <label className="text-xs font-semibold text-slate-300">Branch Property *</label>
                <select
                  value={propertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className={`w-full rounded-xl border ${errors.propertyId ? 'border-rose-500' : 'border-slate-700'} bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none`}
                >
                  {properties.length === 0 && <option value="">No properties available</option>}
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.propertyId && <p className="text-xs text-rose-400 mt-1">{errors.propertyId}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Building / Block *</label>
                <select
                  value={buildingId}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  className={`w-full rounded-xl border ${errors.buildingId ? 'border-rose-500' : 'border-slate-700'} bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none`}
                >
                  {availableBuildings.length === 0 ? (
                    <option value="">No buildings found</option>
                  ) : (
                    availableBuildings.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))
                  )}
                </select>
                {errors.buildingId && <p className="text-xs text-rose-400 mt-1">{errors.buildingId}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Room Number *</label>
                <select
                  value={roomId}
                  onChange={(e) => handleRoomChange(e.target.value)}
                  className={`w-full rounded-xl border ${errors.roomId ? 'border-rose-500' : 'border-slate-700'} bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none`}
                >
                  {availableRooms.length === 0 ? (
                    <option value="">No rooms found</option>
                  ) : (
                    availableRooms.map((r) => {
                      const freeBeds = beds.filter((b) => b.room_id === r.id && (b.status === 'available' || b.id === preBedId));
                      return (
                        <option key={r.id} value={r.id}>
                          Room {r.room_number} {freeBeds.length > 0 ? `(${freeBeds.length} ${freeBeds.length === 1 ? 'bed' : 'beds'} available)` : '(Full)'}
                        </option>
                      );
                    })
                  )}
                </select>
                {errors.roomId && <p className="text-xs text-rose-400 mt-1">{errors.roomId}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Assigned Bed Slot *</label>
              <select
                value={bedId}
                onChange={(e) => handleBedChange(e.target.value)}
                className={`w-full rounded-xl border ${errors.bedId ? 'border-rose-500' : 'border-slate-700'} bg-slate-950 px-3 py-2 text-sm text-emerald-400 font-semibold focus:outline-none`}
              >
                {availableBeds.length === 0 ? (
                  <option value="">No available beds in this room</option>
                ) : (
                  <>
                    <option value="">-- Select an available bed slot --</option>
                    {availableBeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bed_number} — Available ({formatINR(b.monthly_rent)}/mo)
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.bedId && <p className="text-xs text-rose-400 mt-1">{errors.bedId}</p>}
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

