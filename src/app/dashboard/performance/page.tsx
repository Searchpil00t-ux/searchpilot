'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, tip } from '@/components/ui';
export default function Performance() {
  const { data } = useAudit(); const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile'); const [i, setI] = useState(0);
  if (!data) return <Empty />;
  const d = data[Math.min(i, data.length - 1)], s = d[mode], col = s.performance >= 90 ? '#22c55e' : s.performance >= 50 ? '#eab308' : '#ef4444';
  const m: [string, string, boolean][] = [['LCP', `${s.lcp}s`, s.lcp <= 2.5], ['CLS', String(s.cls), s.cls <= 0.1], ['INP', `${s.inp}ms`, s.inp <= 200], ['FCP', `${s.fcp}s`, s.fcp <= 1.8], ['TTFB', `${s.ttfb}ms`, s.ttfb <= 800]];
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Performance and Core Web Vitals</h1>
    <div className="flex flex-wrap gap-2">{data.map((x: any, n: number) => <button key={x.domain} onClick={() => setI(n)} className={`rounded-lg px-3 py-1.5 font-mono text-sm ${n === i ? 'bg-royal' : 'bg-surface text-slate'}`}>{x.domain}</button>)}
      {(['mobile', 'desktop'] as const).map(k => <button key={k} onClick={() => setMode(k)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${mode === k ? 'bg-bright' : 'bg-surface text-slate'}`}>{k}</button>)}</div>
    <p className="text-xs text-slate">Data source: {s.source === 'pagespeed' ? 'Google PageSpeed (live)' : 'demo values'}</p>
    <div className="grid gap-4 md:grid-cols-6"><div className="rounded-2xl bg-surface p-5 text-center ring-1 ring-white/10"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full font-mono text-3xl font-bold" style={{ border: `6px solid ${col}` }}>{s.performance}</div><p className="mt-2 text-sm text-slate">Lighthouse</p></div>
      {m.map(([l, v, ok]) => <div key={l} className="rounded-2xl bg-surface p-5 ring-1 ring-white/10"><p className="text-sm text-slate">{l}</p><p className="font-mono text-2xl font-bold">{v}</p><p className={`text-xs ${ok ? 'text-green-400' : 'text-red-400'}`}>{ok ? 'Good' : 'Needs work'}</p></div>)}</div>
    <Card title="30-day trend (demo series)"><div className="h-56"><ResponsiveContainer><LineChart data={d.trend.map((v: number, n: number) => ({ n, v }))}><XAxis dataKey="n" hide /><YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} /><Tooltip {...tip} /><Line dataKey="v" stroke="#3B82F6" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card></div>);
}
