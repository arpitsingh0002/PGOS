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
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Maintenance & Helpdesk</h1>
          <p className="text-xs text-slate-400 mt-0.5">Quick resolution by on-site caretakers</p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> Raise Issue
        </Button>
      </div>

      <div className="space-y-3">
        {myComplaints.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No complaints filed yet.</p>
        ) : (
          myComplaints.map((c) => {
            const badge = getComplaintStatusBadge(c.status);
            return (
              <Card key={c.id} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{c.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
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
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Plumbing">Plumbing / Water</option>
                <option value="Electrical">Electrical / Geyser / AC</option>
                <option value="Wi-Fi">Wi-Fi & Internet</option>
                <option value="Cleaning">Room Cleaning</option>
                <option value="Carpentry">Carpentry & Bed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Issue Title</label>
              <Input
                required
                placeholder="e.g. Geyser water not heating"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe what is happening..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
