'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { UserRole } from '@/types/database';
import { toast } from 'sonner';

export default function NewStaffPage() {
  const router = useRouter();
  const { properties, addStaff } = usePGStore();

  const [propertyId, setPropertyId] = React.useState(properties[0]?.id || 'prop-1');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('caretaker');
  const [phone, setPhone] = React.useState('');
  const [salary, setSalary] = React.useState(18000);
  const [joiningDate, setJoiningDate] = React.useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please enter name and phone number');
      return;
    }

    addStaff({
      property_id: propertyId,
      name,
      role,
      phone,
      salary: Number(salary),
      joining_date: joiningDate,
      status: 'active',
    });

    toast.success(`Staff member "${name}" registered successfully!`);
    router.push('/staff');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/staff">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Add Staff Member</h1>
          <p className="text-xs text-slate-400">Onboard hostel workforce and assign operational roles</p>
        </div>
      </div>

      <Card className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name *</label>
            <Input
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Assigned Branch</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Role / Designation *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="manager">Manager</option>
                <option value="caretaker">Caretaker / Warden</option>
                <option value="cook">Cook / Chef</option>
                <option value="cleaner">Cleaner / Housekeeper</option>
                <option value="maintenance">Maintenance / Electrician</option>
                <option value="security">Security Guard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
              <Input
                required
                placeholder="9845012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Monthly Salary (₹)</label>
              <Input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link href="/staff">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25">
              <Check className="h-4 w-4" /> Save Staff Member
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
