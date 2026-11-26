'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, tip } from '@/components/ui';
export default function BacklinkGap() {
  const { compare } = useAudit();
  if (!compare) return <div className="space-y-4"><h1 className="text-2xl font-extrabold">Backlink Gap</h1><Empty /><p className="text-center text-sm text-slate">Run a comparison on the Compare Domains page first.</p></div>;
  const me = compare[0], best = Math.max(...compare.slice(1).map((d: any) => d.moz.refDomains), 0), gap = best - me.moz.refDomains;
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Backlink Gap</h1>
    <p className="rounded-lg bg-surface p-4 text-sm ring-1 ring-white/10">{gap > 0 ? `Your best competitor has ${gap.toLocaleString()} more referring domains than you.` : 'You lead your competitors on referring domains.'} <span className="text-slate">(demo values)</span></p>
    <Card title="Referring domains"><div className="h-64"><ResponsiveContainer><BarChart data={compare.map((d: any) => ({ name: d.domain, Domains: d.moz.refDomains }))}><XAxis dataKey="name" stroke="#94A3B8" fontSize={12} /><YAxis stroke="#94A3B8" fontSize={12} /><Tooltip {...tip} /><Bar dataKey="Domains" fill="#1D4ED8" /></BarChart></ResponsiveContainer></div></Card></div>);
}
