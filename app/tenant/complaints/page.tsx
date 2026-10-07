'use client';

import * as React from 'react';
import { AlertCircle, Plus, CheckCircle2, Clock, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { usePGStore } from '@/lib/store';
import { formatDate, getComplaintStatusBadge } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function TenantComplaintsPage() {
  const { complaints, tenants, addComplaint } = usePGStore();
  const currentTenant = tenants[0];
  const myComplaints = complaints.filter((c) => c.tenant_id === currentTenant?.id);

  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [cat, setCat] = React.useState('Plumbing');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;

    addComplaint({
      property_id: currentTenant.property_id,
      tenant_id: currentTenant.id,
      title,
      description: desc,
      category: cat,
      priority: 'medium',
      tenant_name: currentTenant.full_name,
      room_number: currentTenant.room_number || '101',
    });

    toast.success('Complaint ticket logged! Caretaker notified.');
    setShowModal(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-lg font-bold text-slate-950 tracking-tight">Maintenance & Helpdesk</h1>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">Quick resolution by on-site caretakers</p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 text-xs shadow-md shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> Raise Issue
        </Button>
      </div>

      <div className="space-y-3">
        {myComplaints.length === 0 ? (
          <p className="text-xs text-slate-500 font-bold py-8 text-center">No complaints filed yet.</p>
        ) : (
          myComplaints.map((c) => {
            const badge = getComplaintStatusBadge(c.status);
            return (
              <Card key={c.id} className="bg-white border-slate-300 p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-950">{c.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">{c.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-bold">
                  <span>Category: {c.category}</span>
                  <span>Reported: {formatDate(c.created_at)}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Raise Maintenance Request"
          description="Your caretaker will inspect and resolve this promptly."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Category</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-950 focus:outline-none focus:border-indigo-600"
              >
                <option value="Plumbing">Plumbing / Water</option>
                <option value="Electrical">Electrical / Geyser / AC</option>
                <option value="Wi-Fi">Wi-Fi & Internet</option>
                <option value="Cleaning">Room Cleaning</option>
                <option value="Carpentry">Carpentry & Bed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Issue Title</label>
              <Input
                required
                placeholder="e.g. Geyser water not heating"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-slate-300 text-slate-950 font-semibold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe what is happening..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-950 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none shadow-xs"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-slate-300 text-slate-800 font-bold hover:bg-slate-100">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
