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
  QrCode,
  Flame,
  ChefHat,
  Timer,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

interface TiffinHubCardProps {
  compact?: boolean;
}

export function TiffinHubCard({ compact = false }: TiffinHubCardProps) {
  const {
    tenants,
    tiffinOrders,
    messMenus,
    requestTiffin,
    cancelTiffin,
    updateTenantCollege,
  } = usePGStore();

  const currentTenant = tenants[0] || {
    id: 'ten-1',
    full_name: 'Aarav Sharma',
    phone: '9876543210',
    room_number: '101',
    bed_number: 'Bed A',
    college_name: 'BMS College of Engineering',
    course: 'B.Tech CSE (3rd Year)',
  };

  const todayStr = React.useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaysMenu = messMenus.find((m) => m.day_of_week === todayDay) || messMenus[0];

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
  const [showContainerQR, setShowContainerQR] = React.useState<boolean>(false);

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

  // Container Box ID allocation (e.g. BOX-101A)
  const containerBoxId = React.useMemo(() => {
    if (existingOrder?.box_number) return existingOrder.box_number;
    const bedLetter = currentTenant.bed_number ? currentTenant.bed_number.slice(-1).toUpperCase() : 'A';
    return `BOX-${currentTenant.room_number || '101'}${bedLetter}`;
  }, [existingOrder, currentTenant]);

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
          description: `Container assigned: ${containerBoxId}. Return before 8:30 PM.`,
        }
      );
    } catch (err: any) {
      toast.error(err?.message || 'Could not submit tiffin order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (isPast9AM && simulatedHour === null) {
      toast.error('Tiffin orders cannot be cancelled after 9:00 AM as kitchen prep has commenced.');
      return;
    }

    if (confirm('Are you sure you want to cancel today\'s packed tiffin?')) {
      try {
        await cancelTiffin(currentTenant.id, true);
        setOptInChoice('no');
        toast.info('Tiffin order cancelled. You can dine at the mess buffet today.');
      } catch (err: any) {
        toast.error(err?.message || 'Failed to cancel order.');
      }
    }
  };

  return (
    <Card className="glass-card p-5 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 relative overflow-hidden shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-800 relative z-10 gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Daily Packed Tiffin Service
              </h3>
              <Badge variant="warning" className="text-[10px] py-0 px-2">
                Today&apos;s Lunch
              </Badge>
              {isPast9AM ? (
                <Badge variant="danger" className="text-[10px] gap-1 font-semibold">
                  <Lock className="h-2.5 w-2.5" /> Closed at 09:00 AM
                </Badge>
              ) : (
                <Badge variant="success" className="text-[10px] gap-1 font-semibold">
                  <Timer className="h-2.5 w-2.5" /> {cutoffCountdownText}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
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
            className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            🕒 Time: {simulatedHour !== null ? `${simulatedHour}:00 (${simulatedHour < 9 ? 'Open' : 'Closed'})` : 'Live'}
          </button>

          {existingOrder ? (
            <Badge variant="success" className="text-[10px] flex items-center gap-1 font-semibold">
              <CheckCircle2 className="h-3 w-3" /> Opted In
            </Badge>
          ) : isPast9AM ? (
            <Badge variant="outline" className="text-[10px] text-rose-400 border-rose-500/30">
              Closed for Today
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              Open to Order
            </Badge>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="pt-4 space-y-4 relative z-10">
        {/* TODAY'S LUNCH MENU PREVIEW CHIP */}
        {todaysMenu?.lunch && (
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs">
            <ChefHat className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  What&apos;s In Today&apos;s Tiffin Box ({todayDay})
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Chef Fresh</span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium truncate mt-0.5">
                {todaysMenu.lunch}
              </p>
            </div>
          </div>
        )}

        {/* CUTOFF NOTICE: If past 9:00 AM and student has NOT opted in */}
        {isPast9AM && !existingOrder && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <Lock className="h-4 w-4" />
              <span>Daily Tiffin Requests Closed for Today (Deadline: 09:00 AM)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              As per mess policy, <strong>students can only opt for tiffin before 9:00 AM</strong> so kitchen
              staff can finalize cooking, batch by college, and dispatch on time.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-300">
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Please dine directly at the mess dining hall buffet (Open: 12:30 PM &ndash; 02:30 PM).
              </span>
            </div>
          </div>
        )}

        {/* Toggle Question: Do you want tiffin today? (Only interactive before 9 AM or if order exists) */}
        {(!isPast9AM || existingOrder) && (
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-2">
              Do you want a packed tiffin for college today?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOptInChoice('yes')}
                className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                  optInChoice === 'yes'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25 ring-1 ring-emerald-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
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
                className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                  optInChoice === 'no'
                    ? 'bg-slate-800 text-slate-200 border-slate-700 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
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
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <UtensilsCrossed className="h-4 w-4" />
              <span>Buffet Dining Selected</span>
            </div>
            <p className="text-[11px] text-slate-400">
              No tiffin will be packed for you today. You can enjoy hot lunch directly in the mess dining hall between 12:30 PM and 02:30 PM.
            </p>
          </div>
        )}

        {/* If opted YES or active order exists */}
        {optInChoice === 'yes' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* College Personal Information Section */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                    College / Institution
                  </span>
                </div>
                {!isEditingCollege && !existingOrder && !isPast9AM && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCollege(true)}
                    className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
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
                    className="h-8 text-xs bg-slate-900 border-slate-700"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveCollege}
                    className="h-8 px-3 bg-indigo-600 hover:bg-indigo-500 text-xs gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight">{college}</p>
                    <p className="text-[10px] text-slate-400">
                      Fetched from student personal info &bull; Grouped on staff portal by college
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    Batch Route
                  </Badge>
                </div>
              )}
            </div>

            {/* Delivery / Pickup Time Slots */}
            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
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
                          ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 disabled:opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{slot.time}</span>
                        {isSelected && <Check className="h-3 w-3 text-indigo-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kitchen Note (Optional)
                </label>
                <Input
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g., Pack extra roti, no spicy sabji"
                  className="h-8 text-xs bg-slate-950/70 border-slate-800"
                />
              </div>
            )}

            {/* Confirmed Order State Card */}
            {existingOrder ? (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      Tiffin Booked for {existingOrder.delivery_time}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px] uppercase font-mono">
                    {existingOrder.status === 'requested'
                      ? 'In Kitchen Queue'
                      : existingOrder.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Digital Container Pass Badge */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                      #{containerBoxId.slice(-4)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Assigned Box ID
                      </span>
                      <span className="text-xs font-mono font-bold text-white tracking-wider">
                        {containerBoxId}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowContainerQR(!showContainerQR)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>{showContainerQR ? 'Hide Pass' : 'Show Pass'}</span>
                  </button>
                </div>

                {/* Expanded Container QR Pass */}
                {showContainerQR && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-center space-y-2 animate-in fade-in duration-200">
                    <div className="p-3 bg-white rounded-lg inline-block mx-auto shadow-md">
                      <QrCode className="h-24 w-24 text-slate-900 mx-auto" />
                      <span className="text-[10px] font-mono font-bold text-slate-900 block mt-1">
                        {containerBoxId}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Show this box pass to the dining counter staff during evening return
                    </p>
                  </div>
                )}

                <div className="text-[11px] text-slate-300 space-y-1">
                  <p>
                    <strong className="text-white">Route:</strong> {existingOrder.college_name}
                  </p>
                  <p>
                    <strong className="text-white">Resident:</strong> {existingOrder.tenant_name} (Room {existingOrder.room_number})
                  </p>
                  {existingOrder.notes && (
                    <p>
                      <strong className="text-white">Kitchen Note:</strong> {existingOrder.notes}
                    </p>
                  )}
                </div>

                {/* Evening Return Mandate & Staff-Only Verification Banner */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-emerald-300">
                        Staff-Only Return Verification Policy:
                      </strong>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Tiffin return verification can <strong>only be performed by staff on the staff panel</strong>.
                        Students cannot verify their own return. Please hand over your clean, washed container to
                        the mess counter before <span className="underline font-bold text-amber-300">8:30 PM</span>.
                        The mess staff will scan your container and clear your record.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Current Container State:</span>
                    <Badge variant="warning" className="text-[10px] font-mono">
                      Awaiting Kitchen Counter Return
                    </Badge>
                  </div>
                </div>

                {/* Cancellation notice */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{isPast9AM ? 'Order locked after 9:00 AM' : 'Can cancel before 9:00 AM'}</span>
                  {!isPast9AM && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-7 text-[11px] text-rose-400 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel Tiffin
                    </Button>
                  )}
                </div>
              </div>
            ) : isPast9AM ? (
              /* If past 9 AM and not ordered, show disabled lock button */
              <div className="pt-2">
                <Button
                  size="sm"
                  disabled
                  className="w-full bg-slate-800 text-slate-500 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Opt-In Closed for Today (Past 09:00 AM Deadline)
                </Button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
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
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 gap-1.5 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isSubmitting ? 'Saving Order...' : `Confirm Packed Tiffin for ${deliverySlot}`}
                </Button>
                <p className="text-[10px] text-emerald-400/90 text-center mt-2 flex items-center justify-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  Open now &bull; Closes strictly at 09:00 AM ({cutoffCountdownText})
                </p>
              </div>
            )}
          </div>
        )}

        {/* Global Policy Reminder for All Students */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Policy:</strong> Daily opt-in cut-off is strictly <strong>09:00 AM</strong>.
            Tiffin return verification is <strong>restricted exclusively to the staff portal</strong> upon container inspection.
          </span>
        </div>
      </div>
    </Card>
  );
}
