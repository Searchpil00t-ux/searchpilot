'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, tip } from '@/components/ui';
export default function Overview() {
  const { data } = useAudit(); if (!data) return <Empty />;
  const rows: [string, (d: any) => any][] = [['Domain Authority', d => d.moz.da], ['Page Authority', d => d.moz.pa], ['Spam score %', d => d.moz.spam], ['Backlinks', d => d.moz.backlinks.toLocaleString()], ['Referring domains', d => d.moz.refDomains.toLocaleString()], ['Domain age (yrs)', d => d.age.ageYears], ['Expires', d => d.age.expires], ['SEO health', d => d.healthScore], ['Mobile speed', d => d.mobile.performance], ['Desktop speed', d => d.desktop.performance], ['LCP (s)', d => d.mobile.lcp], ['Data source', d => d.mobile.source + ' / ' + d.age.source], ['CLS', d => d.mobile.cls], ['INP (ms)', d => d.mobile.inp]];
  const chart = data.map((d: any) => ({ name: d.domain, DA: d.moz.da, Health: d.healthScore, Mobile: d.mobile.performance }));
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Competitor comparison</h1>
    <div className="overflow-x-auto rounded-2xl bg-white text-obsidian"><table className="w-full min-w-[640px] text-sm"><thead><tr className="text-left text-slate"><th className="p-3">Metric</th>{data.map((d: any) => <th key={d.domain} className="p-3 font-mono">{d.domain}</th>)}</tr></thead><tbody className="font-mono">{rows.map(([l, f]) => <tr key={l} className="border-t border-slate/20"><td className="p-3 font-sans font-medium">{l}</td>{data.map((d: any) => <td key={d.domain} className="p-3">{f(d)}</td>)}</tr>)}</tbody></table>
      <p className="p-3 text-xs text-slate">Moz-style metrics, backlinks and speed show demo values until API keys are set. Domain age uses RDAP. SearchPilot is not affiliated with Moz.</p></div>
    <Card title="Authority, health and speed"><div className="h-72"><ResponsiveContainer><BarChart data={chart}><XAxis dataKey="name" stroke="#94A3B8" fontSize={12} /><YAxis stroke="#94A3B8" fontSize={12} /><Tooltip {...tip} /><Bar dataKey="DA" fill="#1D4ED8" /><Bar dataKey="Health" fill="#3B82F6" /><Bar dataKey="Mobile" fill="#94A3B8" /></BarChart></ResponsiveContainer></div></Card></div>);
}
