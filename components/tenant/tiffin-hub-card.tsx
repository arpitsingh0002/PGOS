'use client';

import * as React from 'react';
import {
  UtensilsCrossed,
  Clock,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Edit2,
  Check,
  Package,
  ShieldCheck,
  Lock,
  Info,
  Timer,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { DEMO_TENANT } from '@/lib/data/initial-data';
import { toast } from 'sonner';

interface TiffinHubCardProps {
  compact?: boolean;
}

export function TiffinHubCard({ compact = false }: TiffinHubCardProps) {
  const {
    tenants,
    tiffinOrders,
    requestTiffin,
    cancelTiffin,
    updateTenantCollege,
  } = usePGStore();

  const currentTenant = tenants.find((t) => t.id === DEMO_TENANT.id) || tenants[0] || DEMO_TENANT;

  const todayStr = React.useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Time Cutoff: Student can ONLY opt for tiffin before 9:00 AM
  // Simulated hour state enables testing both "Before 9 AM (Open)" and "After 9 AM (Closed)" states
  const [simulatedHour, setSimulatedHour] = React.useState<number | null>(null);
  const actualHour = new Date().getHours();
  const effectiveHour = simulatedHour !== null ? simulatedHour : actualHour;
  const isPast9AM = effectiveHour >= 9;

  // Check if tenant already has an active order for today
  const existingOrder = tiffinOrders.find(
    (o) => o.tenant_id === currentTenant.id && o.date === todayStr
  );

  // Local Form States
  const [optInChoice, setOptInChoice] = React.useState<'yes' | 'no' | null>(
    existingOrder ? 'yes' : null
  );
  const [deliverySlot, setDeliverySlot] = React.useState<string>(
    existingOrder?.delivery_time || '08:00 AM'
  );
  const [college, setCollege] = React.useState<string>(
    existingOrder?.college_name || currentTenant.college_name || 'BMS College of Engineering'
  );
  const [isEditingCollege, setIsEditingCollege] = React.useState<boolean>(false);
  const [specialNotes, setSpecialNotes] = React.useState<string>(existingOrder?.notes || '');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Sync state if order changes or tenant updates
  React.useEffect(() => {
    if (existingOrder) {
      setOptInChoice('yes');
      setDeliverySlot(existingOrder.delivery_time);
      setCollege(existingOrder.college_name);
      setSpecialNotes(existingOrder.notes || '');
    }
  }, [existingOrder]);

  const deliverySlots = [
    { time: '07:30 AM', label: 'Early Batch', desc: 'Engineering & Lab shifts' },
    { time: '08:00 AM', label: 'Morning Peak', desc: 'Standard college hours' },
    { time: '08:30 AM', label: 'Late Morning', desc: '9 AM lecture starts' },
    { time: '12:15 PM', label: 'Noon Drop', desc: 'Lunch time delivery' },
  ];

  // Remaining time to cutoff calculation
  const cutoffCountdownText = React.useMemo(() => {
    if (isPast9AM) return 'Cutoff Passed';
    if (simulatedHour !== null) return `~${9 - simulatedHour}h remaining`;
    const now = new Date();
    const target = new Date();
    target.setHours(9, 0, 0, 0);
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return 'Closing soon';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;
  }, [isPast9AM, simulatedHour]);

  const handleSaveCollege = () => {
    if (!college.trim()) {
      toast.error('Please enter a valid college name');
      return;
    }
    updateTenantCollege(currentTenant.id, college.trim());
    setIsEditingCollege(false);
    toast.success('College name updated in student profile!');
  };

  const handleConfirmOrder = async () => {
    if (isPast9AM && !existingOrder) {
      toast.error('Opt-in closed: Students can only request tiffin before 9:00 AM.');
      return;
    }

    if (!college.trim()) {
      toast.error('Please enter your college name');
      return;
    }
    setIsSubmitting(true);
    try {
      await requestTiffin({
        tenant_id: currentTenant.id,
        tenant_name: currentTenant.full_name,
        room_number: currentTenant.room_number || '101',
        bed_number: currentTenant.bed_number || 'Bed A',
        phone: currentTenant.phone || '9876543210',
        property_id: currentTenant.property_id || 'prop-1',
        building_id: currentTenant.building_id || 'bld-1',
        college_name: college.trim(),
        delivery_time: deliverySlot,
        meal_type: 'lunch',
        notes: specialNotes.trim() || undefined,
        bypassCutoff: simulatedHour !== null ? simulatedHour < 9 : false,
      });
      toast.success(
        `🍱 Tiffin confirmed for ${deliverySlot}! Grouped under ${college.trim()}`,
        {
          description: 'Please return the washed container at the kitchen counter before 8:30 PM.',
        }
      );
    } catch (err: any) {
      toast.error(err?.message || 'Could not submit tiffin order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelTiffin(currentTenant.id, true);
      setOptInChoice('no');
      toast.info('Tiffin order cancelled. You can dine at the mess buffet today.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel order.');
    }
  };

  return (
    <Card className="p-5 border border-indigo-200 bg-white relative overflow-hidden shadow-md">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-200 relative z-10 gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shadow-xs">
            <Package className="h-5 w-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-950 tracking-tight">
                Daily Packed Tiffin Service
              </h3>
              <Badge variant="warning" className="text-[10px] py-0 px-2 font-bold">
                Today&apos;s Lunch
              </Badge>
              {isPast9AM ? (
                <Badge variant="danger" className="text-[10px] gap-1 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Closed at 09:00 AM
                </Badge>
              ) : (
                <Badge variant="success" className="text-[10px] gap-1 font-bold">
                  <Timer className="h-2.5 w-2.5" /> {cutoffCountdownText}
                </Badge>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Rule: Opt-in allowed only <strong>before 09:00 AM</strong> daily &bull; Packed by college route
            </p>
          </div>
        </div>

        {/* Status & Simulator Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Quick tester simulation toggle */}
          <button
            type="button"
            onClick={() => {
              if (simulatedHour === null) {
                setSimulatedHour(8); // Test before 9 AM
                toast.info('Simulating 08:00 AM (Opt-In Open)');
              } else if (simulatedHour === 8) {
                setSimulatedHour(10); // Test after 9 AM
                toast.info('Simulating 10:00 AM (Opt-In Closed)');
              } else {
                setSimulatedHour(null); // Real current time
                toast.info('Reset to actual system time');
              }
            }}
            title="Click to test cutoff behavior before/after 9:00 AM"
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300 transition-colors"
          >
            🕒 Time: {simulatedHour !== null ? `${simulatedHour}:00 (${simulatedHour < 9 ? 'Open' : 'Closed'})` : 'Live'}
          </button>

          {existingOrder ? (
            <Badge variant="success" className="text-[10px] flex items-center gap-1 font-bold">
              <CheckCircle2 className="h-3 w-3" /> Opted In
            </Badge>
          ) : isPast9AM ? (
            <Badge variant="danger" className="text-[10px] font-bold">
              Closed for Today
            </Badge>
          ) : (
            <Badge variant="success" className="text-[10px] font-bold">
              Open to Order
            </Badge>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="pt-4 space-y-4 relative z-10">
        {/* CUTOFF NOTICE: If past 9:00 AM and student has NOT opted in */}
        {isPast9AM && !existingOrder && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <Lock className="h-4 w-4 text-rose-700" />
              <span>Daily Tiffin Requests Closed for Today (Deadline: 09:00 AM)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              As per mess policy, <strong>students can only opt for tiffin before 9:00 AM</strong> so kitchen
              staff can finalize cooking, batch by college, and dispatch on time.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-900 font-bold">
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-700" />
              <span>
                Please dine directly at the mess dining hall buffet (Open: 12:30 PM &ndash; 02:30 PM).
              </span>
            </div>
          </div>
        )}

        {/* Toggle Question: Do you want tiffin today? (Only interactive before 9 AM or if order exists) */}
        {(!isPast9AM || existingOrder) && (
          <div>
            <label className="text-xs font-bold text-slate-950 block mb-2">
              Do you want a packed tiffin for college today?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOptInChoice('yes')}
                className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                  optInChoice === 'yes'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-1 ring-emerald-500'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:text-slate-950'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Yes, Pack My Tiffin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (existingOrder) {
                    handleCancel();
                  } else {
                    setOptInChoice('no');
                  }
                }}
                className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                  optInChoice === 'no'
                    ? 'bg-slate-200 text-slate-950 border-slate-400 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:text-slate-950'
                }`}
              >
                <UtensilsCrossed className="h-4 w-4" />
                <span>No, Dine in Mess</span>
              </button>
            </div>
          </div>
        )}

        {/* If opted NO */}
        {optInChoice === 'no' && !existingOrder && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs text-slate-800 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <UtensilsCrossed className="h-4 w-4 text-indigo-700" />
              <span>Buffet Dining Selected</span>
            </div>
            <p className="text-[11px] font-medium text-slate-700">
              No tiffin will be packed for you today. You can enjoy hot lunch directly in the mess dining hall between 12:30 PM and 02:30 PM.
            </p>
          </div>
        )}

        {/* If opted YES or active order exists */}
        {optInChoice === 'yes' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* College Personal Information Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-700" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                    College / Institution
                  </span>
                </div>
                {!isEditingCollege && !existingOrder && !isPast9AM && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCollege(true)}
                    className="text-[11px] font-bold text-slate-700 hover:text-indigo-900 flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="h-3 w-3" /> Change
                  </button>
                )}
              </div>

              {isEditingCollege ? (
                <div className="flex items-center gap-2 pt-1">
                  <Input
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter your college / university name"
                    className="h-8 text-xs bg-white border-slate-300 text-slate-950 font-bold"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveCollege}
                    className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-950 tracking-tight">{college}</p>
                    <p className="text-[10px] font-medium text-slate-600">
                      Fetched from student personal info &bull; Grouped on staff portal by college
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold font-mono">
                    Batch Route
                  </Badge>
                </div>
              )}
            </div>

            {/* Delivery / Pickup Time Slots */}
            <div>
              <label className="text-xs font-bold text-slate-950 block mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-700" />
                Select Tiffin Delivery / Pickup Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {deliverySlots.map((slot) => {
                  const isSelected = deliverySlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!!existingOrder || (isPast9AM && !existingOrder)}
                      onClick={() => setDeliverySlot(slot.time)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs ring-1 ring-indigo-600 font-bold'
                          : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400 disabled:opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-950">{slot.time}</span>
                        {isSelected && <Check className="h-3 w-3 text-indigo-700" />}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 block -mt-0.5">
                        {slot.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions (Optional) */}
            {!existingOrder && !isPast9AM && (
              <div>
                <label className="text-xs font-bold text-slate-950 block mb-1">
                  Kitchen Note (Optional)
                </label>
                <Input
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g., Pack extra roti, no spicy sabji"
                  className="h-8 text-xs bg-white border-slate-300 text-slate-950 font-semibold"
                />
              </div>
            )}

            {/* Confirmed Order State Card */}
            {existingOrder ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950">
                      Tiffin Booked for {existingOrder.delivery_time}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px] uppercase font-bold font-mono">
                    {existingOrder.status === 'requested'
                      ? 'In Kitchen Queue'
                      : existingOrder.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="text-[11px] text-slate-800 space-y-1">
                  <p>
                    <strong className="text-slate-950 font-bold">Route:</strong> {existingOrder.college_name}
                  </p>
                  <p>
                    <strong className="text-slate-950 font-bold">Resident:</strong> {existingOrder.tenant_name} (Room {existingOrder.room_number})
                  </p>
                  {existingOrder.notes && (
                    <p>
                      <strong className="text-slate-950 font-bold">Kitchen Note:</strong> {existingOrder.notes}
                    </p>
                  )}
                </div>

                {/* Evening Return Mandate & Staff-Only Verification Banner */}
                <div className="p-3.5 rounded-xl bg-white border border-amber-300 space-y-2 text-xs shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-emerald-950">
                        Staff-Only Return Verification Policy:
                      </strong>
                      <p className="text-[11px] font-medium text-slate-700 mt-0.5 leading-relaxed">
                        Tiffin return verification can <strong>only be performed by staff on the staff panel</strong>.
                        Students cannot verify their own return. Please hand over your clean, washed container to
                        the mess counter before <span className="underline font-bold text-amber-900">8:30 PM</span>.
                        The mess staff will verify and clear your box record.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">Current Container State:</span>
                    <Badge variant="warning" className="text-[10px] font-bold font-mono">
                      Awaiting Kitchen Counter Return
                    </Badge>
                  </div>
                </div>

                {/* Cancellation notice */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-600 font-semibold">
                  <span>Flexible cancellation enabled</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-7 text-[11px] font-bold text-rose-700 border-rose-300 hover:bg-rose-50 hover:border-rose-400"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel Tiffin
                  </Button>
                </div>
              </div>
            ) : isPast9AM ? (
              /* If past 9 AM and not ordered, show disabled lock button */
              <div className="pt-2">
                <Button
                  size="sm"
                  disabled
                  className="w-full bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Opt-In Closed for Today (Past 09:00 AM Deadline)
                </Button>
                <p className="text-[10px] font-semibold text-slate-600 text-center mt-2">
                  Orders open daily from 05:00 AM to 09:00 AM for college departure packing
                </p>
              </div>
            ) : (
              /* Active Action Button before 9 AM */
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md gap-1.5 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isSubmitting ? 'Saving Order...' : `Confirm Packed Tiffin for ${deliverySlot}`}
                </Button>
                <p className="text-[10px] text-emerald-800 text-center mt-2 flex items-center justify-center gap-1 font-bold">
                  <Clock className="h-3 w-3" />
                  Open now &bull; Closes strictly at 09:00 AM ({cutoffCountdownText})
                </p>
              </div>
            )}
          </div>
        )}

        {/* Global Policy Reminder for All Students */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-indigo-700 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-950 font-bold">Policy:</strong> Daily opt-in cut-off is strictly <strong>09:00 AM</strong>.
            Tiffin return verification is <strong>restricted exclusively to the staff portal</strong> upon container inspection.
          </span>
        </div>
      </div>
    </Card>
  );
}
