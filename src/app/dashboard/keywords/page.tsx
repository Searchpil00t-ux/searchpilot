'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, tip } from '@/components/ui';
import { demoKeywords } from '@/lib/demo';
export default function Keywords() {
  const { data } = useAudit(); const [sel, setSel] = useState(0);
  if (!data) return <Empty />;
  const kws = demoKeywords(data[0].domain), k = kws[sel];
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Keyword rank tracking</h1>
    <p className="text-xs text-slate">Demo data. Connect Google Search Console for real rankings.</p>
    <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-white/10"><table className="w-full min-w-[640px] text-sm"><thead><tr className="text-left text-slate"><th className="p-3">Keyword</th><th>Position</th><th>Change</th><th>Volume</th><th>KD%</th><th>Intent</th></tr></thead><tbody className="font-mono">
      {kws.map((x, i) => { const ch = x.prev - x.position; return <tr key={x.term} onClick={() => setSel(i)} className={`cursor-pointer border-t border-white/10 ${i === sel ? 'bg-royal/20' : ''}`}><td className="p-3 font-sans">{x.term}</td><td>{x.position}</td><td className={ch < 0 ? 'text-red-400' : 'text-green-400'}>{ch > 0 ? '+' : ''}{ch}{ch <= -5 ? ' drop' : ''}</td><td>{x.volume.toLocaleString()}</td><td>{x.kd}</td><td className="font-sans">{x.intent}</td></tr>; })}</tbody></table></div>
    <Card title={`Position history: ${k.term}`}><div className="h-56"><ResponsiveContainer><LineChart data={k.hist.map((v, n) => ({ n: n + 1, v }))}><XAxis dataKey="n" stroke="#94A3B8" fontSize={12} /><YAxis reversed stroke="#94A3B8" fontSize={12} domain={[1, 'auto']} /><Tooltip {...tip} /><Line dataKey="v" stroke="#3B82F6" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card></div>);
}
