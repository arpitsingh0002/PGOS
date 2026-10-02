'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export default function NewComplaintPage() {
  const router = useRouter();
  const { tenants, properties, staff, addComplaint } = usePGStore();

  const [tenantId, setTenantId] = React.useState(tenants[0]?.id || 'ten-1');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('Plumbing');
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [assignedStaffId, setAssignedStaffId] = React.useState('');

  const selectedTenant = tenants.find((t) => t.id === tenantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !selectedTenant) {
      toast.error('Please enter complaint title and description');
      return;
    }

    const assignedStaff = staff.find((s) => s.id === assignedStaffId);

    addComplaint({
      property_id: selectedTenant.property_id,
      tenant_id: selectedTenant.id,
      title,
      description,
      category,
      priority,
      assigned_to: assignedStaffId || undefined,
      tenant_name: selectedTenant.full_name,
      room_number: selectedTenant.room_number || '101',
      assigned_staff_name: assignedStaff?.name,
    });

    toast.success('Complaint ticket logged and placed on Kanban board!');
    router.push('/complaints');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/complaints">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Log Maintenance Ticket</h1>
          <p className="text-xs text-slate-400">Assign issues to maintenance staff and monitor SLA</p>
        </div>
      </div>

      <Card className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Resident / Tenant *</label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} — {t.room_number || 'Room 101'} ({t.bed_number || 'Bed A'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Wi-Fi">Wi-Fi & Internet</option>
                <option value="Carpentry">Carpentry & Furniture</option>
                <option value="Cleaning">Cleaning & Housekeeping</option>
                <option value="Mess">Food & Mess</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Priority Level *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="low">Low (Within 48h)</option>
                <option value="medium">Medium (Within 24h)</option>
                <option value="high">High (Within 6h)</option>
                <option value="urgent">Urgent SLA (Immediate &lt;2h)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Ticket Title *</label>
            <Input
              required
              placeholder="e.g. Geyser tripping circuit breaker"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Detailed Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the issue observed in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Assign Maintenance Staff (Optional)</label>
            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">Leave Unassigned (New Queue)</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link href="/complaints">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25">
              <Check className="h-4 w-4" /> Create Ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
