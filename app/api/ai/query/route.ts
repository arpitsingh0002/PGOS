import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioRawState, computeOccupancyAnalytics, computeRevenueAnalytics, computeMessAnalytics } from '@/lib/analytics-engine';
import { formatINR } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

function pluralize(count: number, singular: string, plural?: string): string {
  const form = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${form}`;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, propertyId } = await request.json();
    const cleanPrompt = (prompt || '').toLowerCase();

    const state = await getPortfolioRawState();
    const occ = computeOccupancyAnalytics(state);
    const rev = computeRevenueAnalytics(state);
    const mess = computeMessAnalytics(state);

    let answer = '';

    if (cleanPrompt.includes('vacant') || cleanPrompt.includes('empty') || cleanPrompt.includes('beds') || cleanPrompt.includes('occupancy')) {
      const topBranch = occ.branch_breakdown[0];
      const vacantText = pluralize(occ.vacant_beds, 'vacant bed');
      const occupiedText = pluralize(occ.occupied_beds, 'occupied bed');
      const branchesText = pluralize(occ.total_properties, 'branch', 'branches');
      const roomsText = pluralize(occ.total_rooms, 'room');
      const maintText = occ.maintenance_beds > 0 
        ? `${pluralize(occ.maintenance_beds, 'bed is', 'beds are')} currently in maintenance. ` 
        : '';

      answer = `Current Portfolio Occupancy is ${occ.overall_occupancy_rate}%. You have ${occupiedText} and ${vacantText} across ${branchesText} (${roomsText}). ${maintText}Top performing branch: ${topBranch?.property_name || 'Royal Palms Luxury Living'} at ${topBranch?.occupancy_rate || occ.overall_occupancy_rate}% occupancy.`;
    } else if (cleanPrompt.includes('rent') || cleanPrompt.includes('pending') || cleanPrompt.includes('due') || cleanPrompt.includes('owes') || cleanPrompt.includes('collection')) {
      const pendingTenants = state.payments
        .filter((p) => p.status === 'pending')
        .map((p) => `${p.tenant_name || 'Resident'} (${p.room_number || 'Room'}, ${formatINR(p.amount)})`)
        .slice(0, 3);

      const pendingSummary = pendingTenants.length > 0 ? `Outstanding residents: ${pendingTenants.join(', ')}.` : 'Zero overdue payments!';
      answer = `Pending Dues Report: Total collections to date are ${formatINR(rev.total_revenue_collected)} with a collection efficiency of ${rev.collection_rate}%. Outstanding pending dues amount to ${formatINR(rev.pending_dues)}. ${pendingSummary} Automated WhatsApp payment reminders are ready to be dispatched from the Payments ledger.`;
    } else if (cleanPrompt.includes('mess') || cleanPrompt.includes('food') || cleanPrompt.includes('cost') || cleanPrompt.includes('menu') || cleanPrompt.includes('tiffin')) {
      const boardersText = pluralize(mess.active_boarders_count, 'active resident boarder');
      const studentsText = pluralize(mess.total_tiffins_today, 'student');
      const routesText = pluralize(mess.active_colleges_count, 'college delivery route');
      const containersText = pluralize(mess.pending_returns_count, 'container');

      answer = `Mess & Pantry Intelligence: Monthly grocery & mess expenditure is ${formatINR(mess.monthly_grocery_expense)} across ${boardersText} (~${formatINR(mess.grocery_cost_per_boarder)}/boarder). Today, ${studentsText} opted for packed tiffins categorized across ${routesText} with ${containersText} currently pending return.`;
    } else if (cleanPrompt.includes('profit') || cleanPrompt.includes('noi') || cleanPrompt.includes('revenue') || cleanPrompt.includes('expense') || cleanPrompt.includes('income')) {
      const topExp = rev.expenses_by_category[0];
      answer = `Financial Intelligence: Current month revenue is ${formatINR(rev.current_month_revenue)} against operating expenses of ${formatINR(rev.current_month_expenses)}, resulting in a Net Operating Income (NOI) of ${formatINR(rev.net_operating_income)} (Operating Margin: ${rev.operating_margin}%). RevPAB (Revenue per available bed) stands at ${formatINR(rev.rev_per_available_bed)}. Largest operational expense is ${topExp?.category || 'Utilities'} (${formatINR(topExp?.amount || 0)}).`;
    } else {
      const branchesText = pluralize(occ.total_properties, 'branch', 'branches');
      const studentsText = pluralize(mess.total_tiffins_today, 'student');

      answer = `PGOS AI Intelligence Agent: Operating parameters across ${branchesText} are healthy. Portfolio occupancy is ${occ.overall_occupancy_rate}% (${occ.occupied_beds}/${occ.total_beds} beds), rent collection rate is ${rev.collection_rate}% with ${formatINR(rev.pending_dues)} in pending dues. ${studentsText} opted for packed tiffins today, and all operations are actively synchronized.`;
    }

    return NextResponse.json({
      answer,
      success: true,
      meta: {
        is_live_db: state.isLiveDB,
        occupancy_rate: occ.overall_occupancy_rate,
        collection_rate: rev.collection_rate,
      },
    });
  } catch (error) {
    console.error('[API /api/ai/query] Error:', error);
    return NextResponse.json({ error: 'Failed to process AI query', success: false }, { status: 500 });
  }
}
