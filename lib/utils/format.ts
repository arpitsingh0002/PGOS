export { formatINR } from './currency';
export { formatDate, getCurrentMonthStr, getDaysAgo, formatMonthYear } from './dates';

export function formatPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function getBedStatusBadge(status: string) {
  switch (status) {
    case 'available':
      return { label: 'Available', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'occupied':
      return { label: 'Occupied', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    case 'reserved':
      return { label: 'Reserved', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'maintenance':
      return { label: 'Maintenance', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };
    default:
      return { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
}

export function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'paid':
      return { label: 'Paid', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'pending':
      return { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'overdue':
      return { label: 'Overdue', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    case 'partially_paid':
      return { label: 'Partially Paid', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
    default:
      return { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
}

export function getComplaintStatusBadge(status: string) {
  switch (status) {
    case 'new':
      return { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    case 'assigned':
      return { label: 'Assigned', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'in_progress':
      return { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'resolved':
      return { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    default:
      return { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
}
