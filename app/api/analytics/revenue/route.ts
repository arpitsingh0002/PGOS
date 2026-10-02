import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    current_month_revenue: 33500,
    current_month_expenses: 81700,
    net_operating_income: -48200,
    historical_revenue: [
      { month: 'Oct 2024', amount: 95000 },
      { month: 'Nov 2024', amount: 110000 },
      { month: 'Dec 2024', amount: 125000 },
      { month: 'Jan 2025', amount: 130000 },
      { month: 'Feb 2025', amount: 138000 },
      { month: 'Mar 2025', amount: 142000 },
    ],
    collection_rate: 94.6,
  };

  return NextResponse.json(data);
}
