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
  ArrowRight,
  ShieldCheck,
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
      });
      toast.success(
        `🍱 Tiffin confirmed for ${deliverySlot}! Grouped under ${college.trim()}`
      );
    } catch {
      toast.error('Could not submit tiffin order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel today\'s packed tiffin?')) {
      await cancelTiffin(currentTenant.id);
      setOptInChoice('no');
      toast.info('Tiffin order cancelled. You can dine at the mess buffet today.');
    }
  };

  return (
    <Card className="glass-card p-5 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 relative overflow-hidden shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Daily Packed Tiffin Service
              </h3>
              <Badge variant="warning" className="text-[10px] py-0 px-2">
                Today&apos;s Lunch
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Opt-in daily before 07:00 AM • Categorized by college route
            </p>
          </div>
        </div>

        {existingOrder ? (
          <Badge variant="success" className="text-[10px] flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Opted In
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[10px]">
            Action Required
          </Badge>
        )}
      </div>

      {/* Body Content */}
      <div className="pt-4 space-y-4 relative z-10">
        {/* Toggle Question: Do you want tiffin today? */}
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
                {!isEditingCollege && !existingOrder && (
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
                      Fetched from your student profile • Kitchen sorts orders by college
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
                      disabled={!!existingOrder}
                      onClick={() => setDeliverySlot(slot.time)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-sm'
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
            {!existingOrder && (
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

                {/* Evening Return Mandate Banner */}
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-amber-300">
                      Evening Tiffin Return Rule:
                    </strong>
                    Please return your washed tiffin container at the kitchen counter before{' '}
                    <span className="underline font-bold">8:30 PM</span>. Staff will verify your box
                    return on the staff tablet. Your record remains pending until verified.
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-7 text-[11px] text-rose-400 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel Tiffin
                  </Button>
                </div>
              </div>
            ) : (
              /* Action Button */
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
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  Kitchen locks morning packaging at 07:15 AM
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
