import { NextResponse } from 'next/server';
import { getComprehensiveAnalytics } from '@/lib/analytics-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const summary = await getComprehensiveAnalytics();
    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error: any) {
    console.error('[API /api/analytics/summary] Error computing summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to compute portfolio summary analytics',
      },
      { status: 500 }
    );
  }
}
