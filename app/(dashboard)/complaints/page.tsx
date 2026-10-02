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
    { id: 'new', label: 'New Issues', color: 'border-blue-500/30 bg-blue-950/10' },
    { id: 'assigned', label: 'Assigned to Staff', color: 'border-purple-500/30 bg-purple-950/10' },
    { id: 'in_progress', label: 'Work In Progress', color: 'border-amber-500/30 bg-amber-950/10' },
    { id: 'resolved', label: 'Resolved / Closed', color: 'border-emerald-500/30 bg-emerald-950/10' },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Maintenance & Complaints Board
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {complaints.filter((c) => c.status !== 'resolved').length} Open
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kanban workflow from tenant reporting to staff assignment and closure
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent SLA</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Link href="/complaints/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
              <Plus className="h-4 w-4" /> New Ticket
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
              className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[500px] ${col.color}`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {colItems.map((item) => {
                    const priorityColors = {
                      urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                      high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                      medium: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                      low: 'text-slate-400 bg-slate-800 border-slate-700',
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedComplaint(item)}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityColors[item.priority]}`}>
                            {item.priority}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.category}</span>
                        </div>

                        <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>

                        <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Room {item.room_number || '101'}</span>
                          <span>{item.assigned_staff_name || 'Unassigned'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {colItems.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">
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
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedComplaint.description}</p>
              <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-800/80 text-[11px]">
                <span>Category: <strong className="text-white">{selectedComplaint.category}</strong></span>
                <span>Priority: <strong className="text-amber-400 uppercase">{selectedComplaint.priority}</strong></span>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Update Workflow Status</label>
              <div className="grid grid-cols-4 gap-2">
                {(['new', 'assigned', 'in_progress', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleQuickStatusChange(selectedComplaint.id, st)}
                    className={`py-2 px-1 text-[11px] rounded-lg font-medium border capitalize transition-colors ${
                      selectedComplaint.status === st
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
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
                <label className="text-xs font-semibold text-slate-300">Resolution Notes (Upon Fix)</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Technician replaced capacitor, test verified cooling normal."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(null)} className="text-xs">
                Close
              </Button>
              {selectedComplaint.status !== 'resolved' && (
                <Button size="sm" onClick={handleResolve} className="bg-emerald-600 hover:bg-emerald-500 text-xs gap-1.5 shadow-md shadow-emerald-600/20">
                  <CheckCircle2 className="h-4 w-4" /> Mark Resolved
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
