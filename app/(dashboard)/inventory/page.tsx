'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  Building2,
  Package,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  Minus,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import { InventoryCategory } from '@/types/database';

export default function CentralInventoryPage() {
  const { properties, inventory, updateInventoryStock, addInventoryItem, deleteInventoryItem } = usePGStore();

  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [search, setSearch] = React.useState('');

  // Add Item Modal
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<InventoryCategory>('cleaning');
  const [propertyId, setPropertyId] = React.useState(properties[0]?.id || 'prop-1');
  const [quantity, setQuantity] = React.useState('10');
  const [unit, setUnit] = React.useState('pcs');
  const [minThreshold, setMinThreshold] = React.useState('5');
  const [costPerUnit, setCostPerUnit] = React.useState('150');
  const [notes, setNotes] = React.useState('');

  const filteredItems = (inventory || []).filter((item) => {
    const matchProp = selectedPropertyId === 'all' || item.property_id === selectedPropertyId;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchProp && matchCategory && matchSearch;
  });

  const lowStockItems = filteredItems.filter((i) => i.quantity <= i.min_threshold);
  const totalValuation = filteredItems.reduce(
    (sum, i) => sum + i.quantity * (i.cost_per_unit || 0),
    0
  );
  const totalUnits = filteredItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Item name is required');
      return;
    }
    addInventoryItem({
      property_id: propertyId,
      name,
      category,
      quantity: parseInt(quantity) || 1,
      unit,
      min_threshold: parseInt(minThreshold) || 2,
      cost_per_unit: parseFloat(costPerUnit) || 0,
      notes: notes || 'Owner central procurement',
    });
    toast.success(`Added ${name} to central stock. Synced to property managers!`);
    setShowAddModal(false);
    setName('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Boxes className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Property Supplies & Inventory Audit
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              Live Manager Sync
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centrally monitor consumables, electrical spares, plumbing fixtures, linens and mess supplies across all properties.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/manager">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
              <Shield className="h-4 w-4 text-indigo-400" /> Manager Portal View
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" /> Add Inventory Item
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card p-4 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Total SKUs</span>
            <Package className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{filteredItems.length}</div>
          <p className="text-xs text-slate-400 mt-1">{totalUnits} individual units on hand</p>
        </Card>

        <Card className="glass-card p-4 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{lowStockItems.length}</div>
          <p className="text-xs text-amber-400/80 mt-1">
            {lowStockItems.length > 0 ? 'Requires immediate restock' : 'All items at healthy buffers'}
          </p>
        </Card>

        <Card className="glass-card p-4 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Total Valuation</span>
            <Boxes className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatINR(totalValuation)}</div>
          <p className="text-xs text-slate-400 mt-1">Estimated asset & consumable cost</p>
        </Card>

        <Card className="glass-card p-4 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Property Distribution</span>
            <Building2 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{properties.length} Branches</div>
          <p className="text-xs text-slate-400 mt-1">Active inventory distribution hubs</p>
        </Card>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-52"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Categories</option>
              <option value="cleaning" className="bg-slate-900">Cleaning</option>
              <option value="electrical" className="bg-slate-900">Electrical</option>
              <option value="plumbing" className="bg-slate-900">Plumbing</option>
              <option value="kitchen" className="bg-slate-900">Kitchen / Mess</option>
              <option value="linen" className="bg-slate-900">Linen & Bedsheets</option>
              <option value="safety" className="bg-slate-900">Safety & Medical</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredItems.length} items
        </span>
      </div>

      {/* Inventory Table */}
      <div className="glass-card overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Property Branch</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Buffer Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Cost / Unit</th>
                <th className="py-3 px-4 text-right">Quick Stock Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => {
                const prop = properties.find((p) => p.id === item.property_id);
                const isLow = item.quantity <= item.min_threshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[11px] text-slate-400">{item.notes || '—'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {prop?.name || 'Sunrise Heights PG'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      {item.quantity} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      Min {item.min_threshold} {item.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                          Adequate
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      {item.cost_per_unit ? formatINR(item.cost_per_unit) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={item.quantity <= 0}
                          onClick={() => {
                            updateInventoryStock(item.id, -1);
                            toast.info(`Dispensed 1 ${item.unit} of ${item.name}`);
                          }}
                          className="text-[10px] h-7 px-2"
                        >
                          <Minus className="h-3 w-3 mr-1" /> 1
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            updateInventoryStock(item.id, 5);
                            toast.success(`Restocked +5 ${item.unit} to ${item.name}`);
                          }}
                          className="text-[10px] h-7 px-2.5 bg-indigo-600 hover:bg-indigo-500"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Restock +5
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Boxes className="h-4 w-4 text-indigo-400" />
                Add Item to Inventory
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item Name</label>
                <Input
                  required
                  placeholder="e.g. 5L Liquid Handwash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Property Branch</label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="kitchen">Kitchen / Mess</option>
                    <option value="linen">Linen & Bedsheets</option>
                    <option value="safety">Safety & Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <Input
                    placeholder="pcs / jars / kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Min Threshold</label>
                  <Input
                    type="number"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estimated Cost / Unit (INR)</label>
                <Input
                  type="number"
                  placeholder="150"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  Save Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
