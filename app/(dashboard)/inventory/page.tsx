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
  ShoppingCart,
  Flame,
  Check,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatINR, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  InventoryCategory,
  InventoryNeedPriority,
  InventoryRequestStatus,
} from '@/types/database';

export default function CentralInventoryPage() {
  const {
    properties,
    inventory,
    updateInventoryStock,
    addInventoryItem,
    inventoryRequests,
    addInventoryRequest,
    updateInventoryRequestStatus,
  } = usePGStore();

  const [activeTab, setActiveTab] = React.useState<'stock' | 'requests'>('requests');
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [search, setSearch] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState<'all' | 'urgent' | 'normal'>('all');

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

  // Add Requisition Modal
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [reqItemName, setReqItemName] = React.useState('');
  const [reqCategory, setReqCategory] = React.useState<InventoryCategory>('kitchen');
  const [reqPropId, setReqPropId] = React.useState(properties[0]?.id || 'prop-1');
  const [reqQty, setReqQty] = React.useState('2');
  const [reqUnit, setReqUnit] = React.useState('cylinders');
  const [reqPriority, setReqPriority] = React.useState<InventoryNeedPriority>('urgent');
  const [reqReason, setReqReason] = React.useState('');
  const [reqCost, setReqCost] = React.useState('1800');

  // Filtered Stock
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

  // Filtered Requisitions
  const filteredRequests = (inventoryRequests || []).filter((r) => {
    const matchProp = selectedPropertyId === 'all' || r.property_id === selectedPropertyId;
    const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    const matchSearch = r.item_name.toLowerCase().includes(search.toLowerCase());
    return matchProp && matchCategory && matchPriority && matchSearch;
  });

  const urgentRequisitions = (inventoryRequests || []).filter(
    (r) => r.priority === 'urgent' && r.status !== 'procured'
  );

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

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqItemName.trim()) {
      toast.error('Item name is required');
      return;
    }
    const propObj = properties.find((p) => p.id === reqPropId);
    addInventoryRequest({
      property_id: reqPropId,
      item_name: reqItemName,
      category: reqCategory,
      quantity: parseInt(reqQty) || 1,
      unit: reqUnit,
      priority: reqPriority,
      requested_by: 'Owner HQ Central Office',
      reason: reqReason || 'Direct Owner Procurement Order',
      estimated_cost: parseFloat(reqCost) || undefined,
      property_name: propObj?.name || 'Property',
    });
    toast.success(`Procurement requisition for ${reqItemName} (${reqPriority.toUpperCase()}) created!`);
    setShowRequestModal(false);
    setReqItemName('');
    setReqReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300">
              <Boxes className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
              Property Supplies & Inventory Audit
            </h1>
            <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-xs font-bold">
              Live Manager Sync
            </Badge>
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            Centrally monitor consumables, electrical spares, plumbing fixtures, linens, and review branch procurement requests with Urgent/Normal priority.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/manager">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-bold border border-slate-300 text-slate-900 hover:bg-slate-100">
              <Shield className="h-4 w-4 text-indigo-700" /> Manager Portal View
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => setShowRequestModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 text-xs font-bold shadow-md shadow-rose-600/20"
          >
            <Plus className="h-4 w-4" /> Add Required Supplies
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 text-xs shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" /> Add Stock SKU
          </Button>
        </div>
      </div>

      {/* Urgent Requisitions Alert Banner */}
      {urgentRequisitions.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-950 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 border border-rose-300 text-rose-900">
              <Flame className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <span className="font-bold text-sm text-rose-950 block">
                {urgentRequisitions.length} Urgent Inventory Requisition{urgentRequisitions.length > 1 ? 's' : ''} Pending Action!
              </span>
              <span className="text-[11px] text-rose-900 font-medium">
                Branch managers have flagged critical shortages:{' '}
                <strong>{urgentRequisitions.map((r) => `${r.item_name} (${r.quantity} ${r.unit})`).join(', ')}</strong>.
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setActiveTab('requests');
              setPriorityFilter('urgent');
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-8 shadow-sm"
          >
            Review Urgent Indents
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white p-4 border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-xs uppercase tracking-wider">Required Requisitions</span>
            <ShoppingCart className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-950 flex items-center gap-2">
            {(inventoryRequests || []).length}
            {urgentRequisitions.length > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300 animate-pulse">
                {urgentRequisitions.length} Urgent
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1">Pending approval & fulfillment</p>
        </Card>

        <Card className="bg-white p-4 border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-xs uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950">{lowStockItems.length}</div>
          <p className="text-xs font-semibold text-amber-900 mt-1">
            {lowStockItems.length > 0 ? 'Requires immediate restock' : 'All items at healthy buffers'}
          </p>
        </Card>

        <Card className="bg-white p-4 border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-xs uppercase tracking-wider">Total Stock Valuation</span>
            <Boxes className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-950">{formatINR(totalValuation)}</div>
          <p className="text-xs font-semibold text-slate-700 mt-1">{totalUnits} units on-site</p>
        </Card>

        <Card className="bg-white p-4 border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span className="text-xs uppercase tracking-wider">Branches Monitored</span>
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-950">{properties.length} Properties</div>
          <p className="text-xs font-semibold text-slate-700 mt-1">Active inventory distribution hubs</p>
        </Card>
      </div>

      {/* Tab Switcher: Requisitions vs Current Stock */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-800 hover:text-slate-950 border border-slate-300'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            1. Required Supplies & Priority Indents ({(inventoryRequests || []).length})
            {urgentRequisitions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold text-[10px] animate-pulse">
                {urgentRequisitions.length} URGENT
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'stock'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-800 hover:text-slate-950 border border-slate-300'
            }`}
          >
            <Boxes className="h-4 w-4" />
            2. Active On-Site Stock ({filteredItems.length})
          </button>
        </div>

        {/* Global Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold placeholder:text-slate-500 focus:outline-none focus:border-indigo-600 w-44 shadow-xs"
            />
          </div>

          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-950 outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {activeTab === 'requests' && (
            <select
              value={priorityFilter}
              onChange={(e: any) => setPriorityFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-950 outline-none cursor-pointer shadow-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🚨 Urgent Priority</option>
              <option value="normal">📦 Normal Priority</option>
            </select>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------
          TAB 1: REQUIRED SUPPLIES & PROCUREMENT INDENTS
      ------------------------------------------------------------- */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-950 border-b border-slate-300 font-bold">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Qty Needed</th>
                  <th className="py-3 px-4">Need Priority</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Est. Cost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Owner Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((req) => {
                  const prop = properties.find((p) => p.id === req.property_id);
                  const isUrgent = req.priority === 'urgent';
                  const isProcured = req.status === 'procured';

                  return (
                    <tr
                      key={req.id}
                      className={`transition-colors ${
                        isUrgent && !isProcured
                          ? 'bg-rose-50/70 hover:bg-rose-50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-950 block text-sm">{req.item_name}</span>
                        <span className="text-[11px] font-medium text-slate-600">
                          By {req.requested_by} • {formatDate(req.created_at)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {prop?.name || 'Sunrise Heights PG'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-950 border border-slate-300">
                          {req.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-950 text-sm">
                        {req.quantity} <span className="text-xs font-semibold text-slate-700">{req.unit}</span>
                      </td>

                      {/* Need Priority Tag */}
                      <td className="py-3.5 px-4">
                        {isUrgent ? (
                          <Badge className="bg-rose-100 text-rose-950 border-rose-300 text-xs font-bold animate-pulse px-2.5 py-1 flex items-center gap-1.5 w-fit">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                            URGENT NEED
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-950 border-blue-300 text-xs font-bold px-2.5 py-1 flex items-center gap-1.5 w-fit">
                            <Package className="h-3.5 w-3.5 text-blue-600" />
                            NORMAL NEED
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 font-medium text-xs max-w-xs truncate">
                        {req.reason || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-950 font-bold">
                        {req.estimated_cost ? formatINR(req.estimated_cost) : '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          className={`text-[10px] font-bold capitalize px-2 py-0.5 ${
                            req.status === 'procured'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                              : req.status === 'approved'
                              ? 'bg-blue-100 text-blue-950 border-blue-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}
                        >
                          {req.status === 'procured'
                            ? '✓ Procured'
                            : req.status === 'approved'
                            ? 'Approved'
                            : 'Pending Approval'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                updateInventoryRequestStatus(req.id, 'approved');
                                toast.success(`Approved requisition for ${req.item_name}!`);
                              }}
                              className="text-[10px] h-7 px-2 font-bold border border-slate-300 text-slate-900 hover:bg-slate-100"
                            >
                              Approve
                            </Button>
                          )}

                          {req.status !== 'procured' ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                updateInventoryRequestStatus(req.id, 'procured');
                                toast.success(
                                  `Procured ${req.quantity} ${req.unit} of ${req.item_name}! Stock added to branch.`
                                );
                              }}
                              className="text-[10px] h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                              <Check className="h-3 w-3 mr-1" /> Mark Procured
                            </Button>
                          ) : (
                            <span className="text-[11px] text-emerald-800 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Fulfilled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: ACTIVE ON-SITE STOCK TABLE
      ------------------------------------------------------------- */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-950 border-b border-slate-300 font-bold">
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
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => {
                  const prop = properties.find((p) => p.id === item.property_id);
                  const isLow = item.quantity <= item.min_threshold;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-950 block text-sm">{item.name}</span>
                        <span className="text-[11px] font-medium text-slate-600">{item.notes || '—'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {prop?.name || 'Sunrise Heights PG'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-950 border border-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-950 text-sm">
                        {item.quantity} <span className="text-xs font-semibold text-slate-700">{item.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold font-mono">
                        Min {item.min_threshold} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <Badge className="bg-rose-100 text-rose-950 border-rose-300 text-[10px] font-bold">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-950 border-emerald-300 text-[10px] font-bold">
                            Adequate
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-950 font-bold">
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
                            className="text-[10px] h-7 px-2 font-bold border border-slate-300 text-slate-900 hover:bg-slate-100"
                          >
                            <Minus className="h-3 w-3 mr-1" /> 1
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              updateInventoryStock(item.id, 5);
                              toast.success(`Restocked +5 ${item.unit} to ${item.name}`);
                            }}
                            className="text-[10px] h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
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
      )}

      {/* Add Stock SKU Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <Boxes className="h-4 w-4 text-indigo-700" />
                Add Item to Inventory Stock
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-950 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-800 font-bold block mb-1">Item Name</label>
                <Input
                  required
                  placeholder="e.g. 5L Liquid Handwash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">Property Branch</label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-950"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-950"
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
                  <label className="text-slate-800 font-bold block mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Unit</label>
                  <Input
                    placeholder="pcs / jars / kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Min Threshold</label>
                  <Input
                    type="number"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(e.target.value)}
                    className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">Estimated Cost / Unit (INR)</label>
                <Input
                  type="number"
                  placeholder="150"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="border border-slate-300 text-slate-800 font-bold hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  Save Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Requisition Modal (with Need Priority: Urgent vs Normal) */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-rose-600" />
                Create Procurement Indent / Required Inventory
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-500 hover:text-slate-950 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-800 font-bold block mb-1">Item Name *</label>
                <Input
                  required
                  placeholder="e.g. Commercial 19kg Mess LPG Cylinders"
                  value={reqItemName}
                  onChange={(e) => setReqItemName(e.target.value)}
                  className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-slate-950 font-bold block mb-1.5 flex items-center gap-1.5">
                  Need Priority *
                  <span className="text-[11px] text-slate-600 font-medium">(Select operational urgency level)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setReqPriority('urgent')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      reqPriority === 'urgent'
                        ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-md ring-1 ring-rose-500 font-bold'
                        : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-rose-900 block text-xs">🚨 URGENT NEED</span>
                      <span className="text-[10px] text-rose-800 font-medium">Emergency / Critical operational requirement</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setReqPriority('normal')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      reqPriority === 'normal'
                        ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-md ring-1 ring-blue-500 font-bold'
                        : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-blue-900 block text-xs">📦 NORMAL NEED</span>
                      <span className="text-[10px] text-blue-800 font-medium">Regular periodic replenishment</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">Target Property</label>
                  <select
                    value={reqPropId}
                    onChange={(e) => setReqPropId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-950"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e: any) => setReqCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-950"
                  >
                    <option value="kitchen">Kitchen / Mess</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="linen">Linen & Bedsheets</option>
                    <option value="safety">Safety & Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">Quantity</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Unit</label>
                  <Input
                    placeholder="cylinders / pcs"
                    value={reqUnit}
                    onChange={(e) => setReqUnit(e.target.value)}
                    className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Est. Cost (INR)</label>
                  <Input
                    type="number"
                    placeholder="1800"
                    value={reqCost}
                    onChange={(e) => setReqCost(e.target.value)}
                    className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">Procurement Justification</label>
                <textarea
                  rows={2}
                  placeholder="Notes for vendor purchase or delivery..."
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-950 font-semibold focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowRequestModal(false)}
                  className="border border-slate-300 text-slate-800 font-bold hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className={reqPriority === 'urgent' ? 'bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-sm' : 'bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm'}
                >
                  Create {reqPriority.toUpperCase()} Indent
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
