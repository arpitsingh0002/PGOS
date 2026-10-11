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
      return { label: 'Available', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' };
    case 'occupied':
      return { label: 'Occupied', color: 'bg-rose-100 text-rose-900 border-rose-300 font-bold' };
    case 'reserved':
      return { label: 'Reserved', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
    case 'maintenance':
      return { label: 'Maintenance', color: 'bg-slate-100 text-slate-900 border-slate-300 font-bold' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-900 border-slate-300 font-bold' };
  }
}

export function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'paid':
      return { label: 'Paid', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' };
    case 'pending':
      return { label: 'Pending', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
    case 'overdue':
      return { label: 'Overdue', color: 'bg-rose-100 text-rose-900 border-rose-300 font-bold' };
    case 'partially_paid':
      return { label: 'Partially Paid', color: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-900 border-slate-300 font-bold' };
  }
}

export function getComplaintStatusBadge(status: string) {
  switch (status) {
    case 'new':
      return { label: 'New', color: 'bg-blue-100 text-blue-900 border-blue-300 font-bold' };
    case 'assigned':
      return { label: 'Assigned', color: 'bg-purple-100 text-purple-900 border-purple-300 font-bold' };
    case 'in_progress':
      return { label: 'In Progress', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
    case 'resolved':
      return { label: 'Resolved', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-900 border-slate-300 font-bold' };
  }
}

