'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Receipt, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { toast } from 'sonner';

export default function NewExpensePage() {
  const router = useRouter();
  const { properties, buildings, addExpense } = usePGStore();

  const [propertyId, setPropertyId] = React.useState(properties[0]?.id || 'prop-1');
  const [buildingId, setBuildingId] = React.useState('');
  const [category, setCategory] = React.useState('Groceries & Mess');
  const [amount, setAmount] = React.useState(3500);
  const [expenseDate, setExpenseDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = React.useState('');
  const [vendorName, setVendorName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error('Please enter description and amount');
      return;
    }

    const currentBld = buildings.find((b) => b.id === buildingId);

    addExpense({
      property_id: propertyId,
      building_id: buildingId || undefined,
      category,
      amount: Number(amount),
      expense_date: expenseDate,
      description,
      vendor_name: vendorName || undefined,
      building_name: currentBld?.name,
    });

    toast.success('Expense recorded successfully!');
    router.push('/expenses');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/expenses">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Record Operational Expense</h1>
          <p className="text-xs text-slate-400">Keep accurate track of property expenditures and vendor payouts</p>
        </div>
      </div>

      <Card className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Property *</label>
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
              <label className="text-xs font-semibold text-slate-300">Building / Block (Optional)</label>
              <select
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="">Entire Branch / General</option>
                {buildings.filter((b) => b.property_id === propertyId).map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Groceries & Mess">Groceries & Mess</option>
                <option value="Electricity & Utilities">Electricity & Utilities</option>
                <option value="Staff Salaries">Staff Salaries</option>
                <option value="High-speed Internet">High-speed Internet</option>
                <option value="Maintenance & Plumbing">Maintenance & Plumbing</option>
                <option value="Cleaning & Sanitation">Cleaning & Sanitation</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Amount (₹) *</label>
              <Input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Expense Description *</label>
            <Input
              required
              placeholder="e.g. Vegetables, milk and spices for weekly mess"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Vendor / Payee</label>
              <Input
                placeholder="e.g. Reliance Fresh / Local Vendor"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Expense Date</label>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link href="/expenses">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 shadow-lg shadow-indigo-600/25">
              <Check className="h-4 w-4" /> Save Expense
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
