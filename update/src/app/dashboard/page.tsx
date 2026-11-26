'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, Badge, tip } from '@/components/ui';
export default function Dashboard() {
  const { data } = useAudit(); if (!data) return <Empty />;
  const d = data[0], issues = d.onpage?.issues ?? [];
  const stats: [string, any][] = [['SEO health', d.healthScore], ['Domain Authority', d.moz.da], ['Page Authority', d.moz.pa], ['Spam score', d.moz.spam + '%'], ['Backlinks', d.moz.backlinks.toLocaleString()], ['Referring domains', d.moz.refDomains.toLocaleString()], ['Mobile speed', d.mobile.performance], ['Desktop speed', d.desktop.performance], ['Domain age', d.age.ageYears + ' yrs'], ['Expires', d.age.expires ?? 'n/a']];
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Dashboard: {d.domain}</h1>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">{stats.map(([l, v]) => <div key={l} className="rounded-2xl bg-surface p-4 ring-1 ring-white/10"><p className="text-xs text-slate">{l}</p><p className="font-mono text-xl font-bold">{v}</p></div>)}</div>
    <p className="text-xs text-slate">Speed: {d.mobile.source === 'pagespeed' ? 'live' : 'demo'} · Domain age: {d.age.source === 'rdap' ? 'live' : 'demo'} · Authority and backlinks: demo</p>
    <div className="grid gap-6 md:grid-cols-2"><Card title="SEO health trend (demo series)"><div className="h-56"><ResponsiveContainer><LineChart data={d.trend.map((v: number, n: number) => ({ n, v }))}><XAxis dataKey="n" hide /><YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} /><Tooltip {...tip} /><Line dataKey="v" stroke="#3B82F6" dot={false} strokeWidth={2} />{d.anomalies.z.map((a: any) => <ReferenceDot key={a.index} x={a.index} y={a.value} r={6} fill="#ef4444" stroke="none" />)}</LineChart></ResponsiveContainer></div></Card>
      <Card title="Top issues">{issues.length ? <ul className="space-y-2 text-sm">{issues.slice(0, 6).map((x: any, i: number) => <li key={i}><Badge s={x.severity} />{x.message}</li>)}</ul> : <p className="text-sm text-slate">No issues found.</p>}</Card></div></div>);
}
