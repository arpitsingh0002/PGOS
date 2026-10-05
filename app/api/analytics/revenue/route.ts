import { NextResponse } from 'next/server';
import { getPortfolioRawState, computeRevenueAnalytics } from '@/lib/analytics-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawState = await getPortfolioRawState();
    const revenueData = computeRevenueAnalytics(rawState);

    return NextResponse.json({
      success: true,
      ...revenueData,
    });
  } catch (error: any) {
    console.error('[API /api/analytics/revenue] Error computing revenue:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to compute revenue analytics',
      },
      { status: 500 }
    );
  }
}
