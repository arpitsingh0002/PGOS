'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePGStore } from '@/lib/store';
import { Task } from '@/types/database';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, staff, updateTaskStatus } = usePGStore();

  const columns: { id: Task['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-800 bg-slate-950/20' },
    { id: 'in_progress', label: 'In Progress', color: 'border-amber-500/20 bg-amber-950/10' },
    { id: 'done', label: 'Completed', color: 'border-emerald-500/20 bg-emerald-950/10' },
  ];

  const handleMove = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
    toast.success(`Task marked as ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Staff Task Board
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {tasks.filter((t) => t.status !== 'done').length} Pending
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign housekeeping, repairs, water tank maintenance and inventory duties
          </p>
        </div>

        <Link href="/tasks/new">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs shadow-md shadow-indigo-600/20">
            <Plus className="h-4 w-4" /> Create New Task
          </Button>
        </Link>
      </div>

      {/* Task Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[500px] ${col.color}`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          {task.priority} Priority
                        </span>
                        {task.due_date && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-white">{task.title}</h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-indigo-300 font-medium">
                          {task.assigned_staff_name || 'General Task'}
                        </span>

                        {/* Status switcher */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => handleMove(task.id, 'todo')}
                              className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                            >
                              To Do
                            </button>
                          )}
                          {col.id !== 'in_progress' && (
                            <button
                              onClick={() => handleMove(task.id, 'in_progress')}
                              className="text-[10px] text-amber-400 hover:text-amber-300 px-1.5 py-0.5 rounded bg-slate-800"
                            >
                              In Progress
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => handleMove(task.id, 'done')}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded bg-slate-800"
                            >
                              Done &check;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {colTasks.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No tasks in this lane
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
