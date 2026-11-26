'use client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, tip } from '@/components/ui';
import { demoBacklinks } from '@/lib/demo';
export default function Backlinks() {
  const { data } = useAudit(); if (!data) return <Empty />;
  const d = data[0], b = demoBacklinks(d.domain), m = d.moz;
  const stats: [string, any][] = [['Domain Authority', m.da], ['Page Authority', m.pa], ['Spam score', m.spam + '%'], ['Backlinks', m.backlinks.toLocaleString()], ['Referring domains', m.refDomains.toLocaleString()], ['Follow ratio', b.follow + '%']];
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Backlinks and authority: {d.domain}</h1>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-6">{stats.map(([l, v]) => <div key={l} className="rounded-2xl bg-surface p-4 ring-1 ring-white/10"><p className="text-xs text-slate">{l}</p><p className="font-mono text-xl font-bold">{v}</p></div>)}</div>
    <p className="text-xs text-slate">Demo values until a Moz API key is connected. SearchPilot is not affiliated with Moz.</p>
    <div className="grid gap-6 md:grid-cols-2"><Card title="New vs lost links"><div className="h-56"><ResponsiveContainer><LineChart data={b.flow}><XAxis dataKey="m" stroke="#94A3B8" fontSize={12} /><YAxis stroke="#94A3B8" fontSize={12} /><Tooltip {...tip} /><Line dataKey="New" stroke="#3B82F6" strokeWidth={2} /><Line dataKey="Lost" stroke="#ef4444" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
      <Card title="Anchor text (%)"><div className="h-56"><ResponsiveContainer><BarChart data={b.anchors} layout="vertical"><XAxis type="number" stroke="#94A3B8" fontSize={12} /><YAxis type="category" dataKey="name" width={110} stroke="#94A3B8" fontSize={11} /><Tooltip {...tip} /><Bar dataKey="value" fill="#1D4ED8" /></BarChart></ResponsiveContainer></div></Card></div>
    <Card title="Suspicious links flagged"><ul className="space-y-1 font-mono text-sm text-red-300">{b.toxic.map((t: string) => <li key={t}>{t}</li>)}</ul></Card></div>);
}
