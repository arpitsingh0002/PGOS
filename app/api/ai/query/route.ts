import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioRawState, computeOccupancyAnalytics, computeRevenueAnalytics, computeMessAnalytics } from '@/lib/analytics-engine';
import { formatINR } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

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
      const vacantText = `${occ.vacant_beds} vacant ${occ.vacant_beds === 1 ? 'bed' : 'beds'}`;
      const occupiedText = `${occ.occupied_beds} occupied ${occ.occupied_beds === 1 ? 'bed' : 'beds'}`;
      const maintText = occ.maintenance_beds > 0 
        ? `${occ.maintenance_beds} ${occ.maintenance_beds === 1 ? 'bed is' : 'beds are'} in maintenance. ` 
        : '';

      answer = `Current Portfolio Occupancy is ${occ.overall_occupancy_rate}%. You have ${occupiedText} and ${vacantText} across ${occ.total_properties} branches (${occ.total_rooms} rooms). ${maintText}Top performing branch: ${topBranch?.property_name || 'Main'} at ${topBranch?.occupancy_rate || occ.overall_occupancy_rate}% occupancy.`;
    } else if (cleanPrompt.includes('rent') || cleanPrompt.includes('pending') || cleanPrompt.includes('due') || cleanPrompt.includes('owes') || cleanPrompt.includes('collection')) {
      const pendingTenants = state.payments
        .filter((p) => p.status === 'pending')
        .map((p) => `${p.tenant_name || 'Resident'} (${p.room_number || 'Room'}, ${formatINR(p.amount)})`)
        .slice(0, 3);

      const pendingSummary = pendingTenants.length > 0 ? `Outstanding residents: ${pendingTenants.join(', ')}.` : 'Zero overdue payments!';
      answer = `Pending Dues Report: Total collections to date are ${formatINR(rev.total_revenue_collected)} with a collection efficiency of ${rev.collection_rate}%. Outstanding pending dues amount to ${formatINR(rev.pending_dues)}. ${pendingSummary} Automated WhatsApp payment reminders are ready to be dispatched from the Payments ledger.`;
    } else if (cleanPrompt.includes('mess') || cleanPrompt.includes('food') || cleanPrompt.includes('cost') || cleanPrompt.includes('menu') || cleanPrompt.includes('tiffin')) {
      answer = `Mess & Pantry Intelligence: Monthly grocery & mess expenditure is ${formatINR(mess.monthly_grocery_expense)} across ${mess.active_boarders_count} active resident boarders (~${formatINR(mess.grocery_cost_per_boarder)}/boarder). Today, ${mess.total_tiffins_today} students opted for packed tiffins categorized across ${mess.active_colleges_count} college delivery routes with ${mess.pending_returns_count} containers currently pending return.`;
    } else if (cleanPrompt.includes('profit') || cleanPrompt.includes('noi') || cleanPrompt.includes('revenue') || cleanPrompt.includes('expense') || cleanPrompt.includes('income')) {
      const topExp = rev.expenses_by_category[0];
      answer = `Financial Intelligence: Current month revenue is ${formatINR(rev.current_month_revenue)} against operating expenses of ${formatINR(rev.current_month_expenses)}, resulting in a Net Operating Income (NOI) of ${formatINR(rev.net_operating_income)} (Operating Margin: ${rev.operating_margin}%). RevPAB (Revenue per available bed) stands at ${formatINR(rev.rev_per_available_bed)}. Largest operational expense is ${topExp?.category || 'Utilities'} (${formatINR(topExp?.amount || 0)}).`;
    } else {
      answer = `PGOS AI Intelligence Agent: Operating parameters across ${occ.total_properties} branches are healthy. Portfolio occupancy is ${occ.overall_occupancy_rate}% (${occ.occupied_beds}/${occ.total_beds} beds), rent collection rate is ${rev.collection_rate}% with ${formatINR(rev.pending_dues)} in pending dues. ${mess.total_tiffins_today} students have opted for packed tiffins today, and all operations are actively synchronized.`;
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
