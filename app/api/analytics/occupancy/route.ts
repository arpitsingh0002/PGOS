import { NextResponse } from 'next/server';
import { getPortfolioRawState, computeOccupancyAnalytics } from '@/lib/analytics-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawState = await getPortfolioRawState();
    const occupancyData = computeOccupancyAnalytics(rawState);

    return NextResponse.json({
      success: true,
      ...occupancyData,
    });
  } catch (error: any) {
    console.error('[API /api/analytics/occupancy] Error computing occupancy:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to compute occupancy analytics',
      },
      { status: 500 }
    );
  }
}
