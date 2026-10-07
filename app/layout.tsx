import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PGOS — The Modern Operating System for PG & Hostel Operators',
  description: 'Enterprise multi-property PG, Hostel and Co-living management platform. Automate rent collection, bed allocations, per-building mess, complaints, and staff.',
  keywords: 'PG Management, Hostel Software, Co-living CRM, Rent Collection, Indian PG System, Hostel Bed Allocation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
