'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus, Receipt, ShoppingCart, DollarSign, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function MessExpensesPage() {
  const params = useParams();
  const bldId = (params?.buildingId as string) || 'bld-1';

  const { buildings, expenses, addExpense, tenants } = usePGStore();
  const building = buildings.find((b) => b.id === bldId) || buildings[0];

  const messExpenses = expenses.filter((e) => e.category === 'Groceries & Mess');
  const totalFoodCost = messExpenses.reduce((s, e) => s + e.amount, 0);

  const activeTenantsCount = tenants.filter((t) => t.building_id === bldId && t.status === 'active').length || 4;
  const foodCostPerTenant = activeTenantsCount > 0 ? Math.round(totalFoodCost / activeTenantsCount) : 0;

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [vendor, setVendor] = React.useState('');
  const [amount, setAmount] = React.useState(4200);
  const [desc, setDesc] = React.useState('Daily fresh milk, curd and paneer supply');

  const handleAddFoodExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      property_id: building.property_id,
      building_id: building.id,
      category: 'Groceries & Mess',
      amount: Number(amount),
      expense_date: new Date().toISOString().split('T')[0],
      description: desc,
      vendor_name: vendor || 'Local Dairy Vendor',
      building_name: building.name,
    });
    toast.success('Mess pantry expense logged!');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/mess/${building?.id}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Mess & Food Cost Analytics — {building?.name}
            </h1>
            <p className="text-xs text-slate-400">Pantry purchases, vendor bills & monthly cost per resident</p>
          </div>
        </div>

        <Button size="sm" onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
          <Plus className="h-4 w-4" /> Add Food Expense
        </Button>
      </div>

      {/* Food Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <span className="text-xs text-slate-400">Total Mess Outflow (Month)</span>
          <p className="text-2xl font-bold text-rose-400 mt-2">{formatINR(totalFoodCost)}</p>
        </Card>

        <Card className="glass-card">
          <span className="text-xs text-slate-400">Active Boarders Dining</span>
          <p className="text-2xl font-bold text-white mt-2">{activeTenantsCount} Residents</p>
        </Card>

        <Card className="glass-card border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-slate-900">
          <span className="text-xs text-indigo-300">Monthly Food Cost / Tenant</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{formatINR(foodCostPerTenant)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">~{formatINR(foodCostPerTenant / 30)}/day per resident</span>
        </Card>
      </div>

      {/* Expenses List */}
      <Card className="glass-card overflow-hidden p-0 border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Vendor / Supplier</th>
                <th className="p-4 font-semibold">Item Details</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {messExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">{exp.vendor_name || 'Kitchen Vendor'}</td>
                  <td className="p-4 text-slate-300">{exp.description}</td>
                  <td className="p-4 text-slate-400">{formatDate(exp.expense_date)}</td>
                  <td className="p-4 font-bold text-rose-400 text-sm text-right">{formatINR(exp.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-10">
            <h3 className="text-base font-bold text-white mb-1">Add Kitchen Food Expense</h3>
            <p className="text-xs text-slate-400 mb-4">Record grocery, vegetable, dairy or gas invoice</p>

            <form onSubmit={handleAddFoodExpense} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Vendor / Store Name</label>
                <Input
                  required
                  placeholder="e.g. Metro Cash & Carry / Nandini Milk"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Amount (₹)</label>
                <Input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Items Description</label>
                <Input
                  required
                  placeholder="e.g. 50 kg Rice, 20 kg Atta, Cooking Oil"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  Save Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
