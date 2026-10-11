'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  Filter,
  Wrench,
  Search,
  User,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { usePGStore } from '@/lib/store';
import { formatDate, getComplaintStatusBadge } from '@/lib/utils/format';
import { Complaint } from '@/types/database';
import { toast } from 'sonner';

export default function ComplaintsPage() {
  const router = useRouter();
  const { complaints, staff, updateComplaintStatus } = usePGStore();

  const [filterPriority, setFilterPriority] = React.useState('all');
  const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = React.useState('');

  const columns: { id: Complaint['status']; label: string; color: string }[] = [
    { id: 'new', label: 'New Issues', color: 'border-blue-200 bg-blue-50/70' },
    { id: 'assigned', label: 'Assigned to Staff', color: 'border-purple-200 bg-purple-50/70' },
    { id: 'in_progress', label: 'Work In Progress', color: 'border-amber-200 bg-amber-50/70' },
    { id: 'resolved', label: 'Resolved / Closed', color: 'border-emerald-200 bg-emerald-50/70' },
  ];

  const filtered = complaints.filter(
    (c) => filterPriority === 'all' || c.priority === filterPriority
  );

  const handleQuickStatusChange = (cmpId: string, newStatus: Complaint['status']) => {
    updateComplaintStatus(cmpId, newStatus);
    toast.success(`Complaint moved to ${newStatus.replace('_', ' ').toUpperCase()}`);
    if (selectedComplaint && selectedComplaint.id === cmpId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  const handleResolve = () => {
    if (!selectedComplaint) return;
    updateComplaintStatus(selectedComplaint.id, 'resolved', resolutionNotes || 'Issue verified resolved');
    toast.success('Complaint closed & resolved!');
    setSelectedComplaint(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            Maintenance & Complaints Board
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {complaints.filter((c) => c.status !== 'resolved').length} Open
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Kanban workflow from tenant reporting to staff assignment and closure
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent SLA</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Link href="/complaints/new">
            <Button size="sm" className="bg-slate-950 hover:bg-slate-900 text-white font-bold gap-1.5 text-xs shadow-sm">
              <Plus className="h-4 w-4 stroke-[2.5]" /> New Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colItems = filtered.filter((c) => c.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[500px] shadow-xs ${col.color}`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-300/80 mb-3">
                  <span className="text-xs font-black text-slate-950 uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-slate-900 border border-slate-300 shadow-xs">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {colItems.map((item) => {
                    const priorityColors = {
                      urgent: 'text-rose-900 bg-rose-100 border-rose-300 font-black',
                      high: 'text-amber-900 bg-amber-100 border-amber-300 font-black',
                      medium: 'text-indigo-900 bg-indigo-100 border-indigo-300 font-black',
                      low: 'text-slate-800 bg-slate-100 border-slate-300 font-bold',
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedComplaint(item)}
                        className="p-3.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-500 cursor-pointer shadow-xs transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityColors[item.priority]}`}>
                            {item.priority}
                          </span>
                          <span className="text-[10px] font-bold text-slate-700">{item.category}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-950 group-hover:text-indigo-700 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-700 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>

                        <div className="pt-2.5 mt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-800">
                          <span>Room <strong className="text-slate-950">{item.room_number || '101'}</strong></span>
                          <span>{item.assigned_staff_name || 'Unassigned'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {colItems.length === 0 && (
                <div className="text-center py-12 text-slate-600 font-bold text-xs">
                  No issues in this state
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Ticket: ${selectedComplaint.title}`}
          description={`Room ${selectedComplaint.room_number || '101'} • Reported by ${selectedComplaint.tenant_name || 'Resident'}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 space-y-2 text-xs">
              <p className="text-slate-900 font-medium leading-relaxed">{selectedComplaint.description}</p>
              <div className="flex items-center justify-between text-slate-700 font-bold pt-2 border-t border-slate-200 text-[11px]">
                <span>Category: <strong className="text-slate-950">{selectedComplaint.category}</strong></span>
                <span>Priority: <strong className="text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded uppercase">{selectedComplaint.priority}</strong></span>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-800 mb-2 block">Update Workflow Status</label>
              <div className="grid grid-cols-4 gap-2">
                {(['new', 'assigned', 'in_progress', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleQuickStatusChange(selectedComplaint.id, st)}
                    className={`py-2 px-1 text-[11px] rounded-lg font-bold border capitalize transition-colors ${
                      selectedComplaint.status === st
                        ? 'border-indigo-600 bg-indigo-100 text-indigo-950'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution note */}
            {selectedComplaint.status !== 'resolved' && (
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-800">Resolution Notes (Upon Fix)</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Technician replaced capacitor, test verified cooling normal."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-medium text-slate-950 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(null)} className="text-xs font-bold border-slate-300">
                Close
              </Button>
              {selectedComplaint.status !== 'resolved' && (
                <Button size="sm" onClick={handleResolve} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" /> Mark Resolved
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
