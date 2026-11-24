import { NextResponse } from 'next/server';
import { auditDomain } from '@/lib/audit';
export const maxDuration = 120;
const clean = (d: string) => d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
export async function POST(req: Request) {
  const { domain, competitors = [] } = await req.json();
  const list = [domain, ...competitors].filter(Boolean).map(clean).slice(0, 4);
  if (!list.length || !list.every(d => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d))) return NextResponse.json({ error: 'Enter valid domains such as example.com' }, { status: 400 });
  return NextResponse.json({ results: await Promise.all(list.map(auditDomain)) });
}
