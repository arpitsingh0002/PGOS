import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, propertyId } = await request.json();
    const cleanPrompt = (prompt || '').toLowerCase();

    let answer = '';

    if (cleanPrompt.includes('vacant') || cleanPrompt.includes('empty') || cleanPrompt.includes('beds')) {
      answer = 'Current Vacancy Analysis: You have 1 vacant bed in Tower A (Bed 102-B, Rent ₹7,500/mo) and 1 bed in maintenance in Room 202 (Bed 202-D). 1 bed is currently reserved in Room 102 (Bed 102-C). Overall portfolio occupancy is healthy at 83%.';
    } else if (cleanPrompt.includes('rent') || cleanPrompt.includes('pending') || cleanPrompt.includes('due') || cleanPrompt.includes('owes')) {
      answer = 'Pending Dues Report: Sneha Rao (Room 102, Bed A) has ₹7,500 outstanding for the March 2025 cycle. An automated WhatsApp reminder is ready to be dispatched from the Payments dashboard.';
    } else if (cleanPrompt.includes('mess') || cleanPrompt.includes('food') || cleanPrompt.includes('cost') || cleanPrompt.includes('menu')) {
      answer = 'Mess & Pantry Intelligence: Average monthly grocery cost is ~₹7,100 per active resident boarder. Wednesday Non-Veg special and Sunday Biryani feast generate the highest boarder dining attendance (94%). Food waste is down 18% with daily headcount tracking.';
    } else if (cleanPrompt.includes('profit') || cleanPrompt.includes('noi') || cleanPrompt.includes('revenue') || cleanPrompt.includes('expense')) {
      answer = 'Financial Performance: Net Operating Income across active branches is currently ₹60,300 with an operating margin of 42.5%. Utility electricity expenses are ₹16,800, which can be partially recouped by generating room submeter readings.';
    } else {
      answer = `PGOS AI Agent: Analyzed your request "${prompt}". Operating parameters are currently optimal. Occupancy is 83%, pending rent is ₹7,500 across 1 tenant, and 4 maintenance tickets are tracked on the Kanban board with 1 technician active.`;
    }

    return NextResponse.json({ answer, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AI query', success: false }, { status: 500 });
  }
}
