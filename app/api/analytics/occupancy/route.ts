import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    total_properties: 3,
    total_buildings: 4,
    total_rooms: 19,
    total_beds: 44,
    occupied_beds: 36,
    vacant_beds: 6,
    reserved_beds: 1,
    maintenance_beds: 1,
    overall_occupancy_rate: 81.8,
    branch_breakdown: [
      { property_name: 'Royal Palms Luxury Living', city: 'Bengaluru', occupancy_rate: 83 },
      { property_name: 'Silicon Oasis Co-living', city: 'Bengaluru', occupancy_rate: 92 },
      { property_name: 'Cyber City Elite Stays', city: 'Gurugram', occupancy_rate: 71 },
    ],
  };

  return NextResponse.json(data);
}
