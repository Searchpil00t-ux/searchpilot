'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceDot } from 'recharts';
import Brachiosaurus from '@/components/Brachiosaurus';
import { Gauge, Search, Link2, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [domain, setDomain] = useState(''); const [comps, setComps] = useState(['', '', '']);
  const [data, setData] = useState<any[] | null>(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  async function run() {
    setBusy(true); setErr('');
    const r = await fetch('/api/audit', { method: 'POST', body: JSON.stringify({ domain, competitors: comps.filter(Boolean) }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErr(j.error); setData(j.results);
  }
  const chart = data?.map(d => ({ name: d.domain, DA: d.moz.da, PA: d.moz.pa, Health: d.healthScore, Mobile: d.mobile.performance }));
  const first = data?.[0]; const dips = first?.anomalies.z ?? [];
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <nav className="flex items-center gap-3 py-5"><Brachiosaurus size={44} /><span className="text-xl font-extrabold tracking-tight">SearchPilot</span></nav>
      <section className="py-12 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Guiding businesses towards better search visibility</h1>
        <div className="my-10 flex justify-center"><Brachiosaurus size={220} /></div>
        <div className="mx-auto max-w-2xl rounded-2xl bg-surface p-4 text-left ring-1 ring-white/10">
          <label className="text-sm text-slate" htmlFor="d">Your website</label>
          <input id="d" value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourbusiness.com" className="mb-3 mt-1 w-full rounded-lg bg-obsidian px-4 py-3 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright" />
          <div className="grid gap-2 sm:grid-cols-3">{comps.map((c, i) => <input key={i} aria-label={`Competitor ${i + 1}`} value={c} onChange={e => setComps(comps.map((x, j) => j === i ? e.target.value : x))} placeholder={`Competitor ${i + 1}`} className="rounded-lg bg-obsidian px-3 py-2 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright" />)}</div>
          <button onClick={run} disabled={busy || !domain} className="mt-4 w-full rounded-lg bg-royal py-3 font-bold transition hover:bg-bright hover:shadow-[0_0_24px_#3B82F680] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow">{busy ? 'Running audit…' : 'Run free audit'}</button>
          {err && <p className="mt-3 text-sm text-red-400" role="alert">{err}</p>}
        </div>
      </section>
      {!data && <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[[Gauge, 'Performance', 'Core Web Vitals, mobile and desktop'], [Search, 'Technical SEO', 'Real crawl of titles, headings, ALT, robots'], [Link2, 'Competitor intel', 'Side-by-side with up to 3 rivals'], [ShieldCheck, 'Domain authority', 'DA, PA, spam score, domain age'], [Activity, 'Anomaly detection', 'Z-score and moving-average alerts']].map(([I, t, s]: any) => <div key={t} className="rounded-xl bg-surface p-5 ring-1 ring-white/10"><I className="mb-3 text-glow" size={22} /><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-slate">{s}</p></div>)}</section>}
      {data && <section className="space-y-8">
        <div className="overflow-x-auto rounded-2xl bg-white p-1 text-obsidian"><table className="w-full min-w-[640px] text-sm"><thead><tr className="text-left text-slate"><th className="p-3">Metric</th>{data.map(d => <th key={d.domain} className="p-3 font-mono">{d.domain}</th>)}</tr></thead><tbody className="font-mono">
          {[['Domain Authority', (d: any) => d.moz.da], ['Page Authority', (d: any) => d.moz.pa], ['Spam score %', (d: any) => d.moz.spam], ['Backlinks', (d: any) => d.moz.backlinks.toLocaleString()], ['Referring domains', (d: any) => d.moz.refDomains.toLocaleString()], ['Domain age (yrs)', (d: any) => d.age.ageYears], ['Expires', (d: any) => d.age.expires], ['SEO health', (d: any) => d.healthScore], ['Mobile speed', (d: any) => d.mobile.performance], ['Desktop speed', (d: any) => d.desktop.performance], ['LCP (s)', (d: any) => d.mobile.lcp], ['CLS', (d: any) => d.mobile.cls], ['INP (ms)', (d: any) => d.mobile.inp]].map(([l, f]: any) => <tr key={l} className="border-t border-slate/20"><td className="p-3 font-sans font-medium">{l}</td>{data.map(d => <td key={d.domain} className="p-3">{f(d)}</td>)}</tr>)}</tbody></table>
          <p className="p-3 text-xs text-slate">Moz-style metrics, backlinks and speed show demo values when MOZ and PAGESPEED keys are not set. Domain age comes from RDAP; when it is unreachable, demo values are used. Moz is a trademark of its owner; SearchPilot is not affiliated.</p></div>
        <div className="h-72 rounded-2xl bg-surface p-4 ring-1 ring-white/10"><ResponsiveContainer><BarChart data={chart}><XAxis dataKey="name" stroke="#94A3B8" fontSize={12} /><YAxis stroke="#94A3B8" fontSize={12} /><Tooltip contentStyle={{ background: '#111520', border: 0 }} /><Bar dataKey="DA" fill="#1D4ED8" /><Bar dataKey="Health" fill="#3B82F6" /><Bar dataKey="Mobile" fill="#94A3B8" /></BarChart></ResponsiveContainer></div>
        <div className="rounded-2xl bg-surface p-5 ring-1 ring-white/10"><h2 className="mb-1 font-bold">SEO health trend: {first.domain}</h2><p className="mb-3 text-sm text-slate">{dips.length ? `${dips.length} anomal${dips.length > 1 ? 'ies' : 'y'} flagged by Z-score` : 'No anomalies in the last 30 days'}</p>
          <div className="h-56"><ResponsiveContainer><LineChart data={first.trend.map((v: number, i: number) => ({ i, v }))}><XAxis dataKey="i" hide /><YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} /><Line dataKey="v" stroke="#3B82F6" dot={false} strokeWidth={2} />{dips.map((a: any) => <ReferenceDot key={a.index} x={a.index} y={a.value} r={6} fill="#ef4444" stroke="none" />)}</LineChart></ResponsiveContainer></div></div>
        {first.onpage && <div className="rounded-2xl bg-surface p-5 ring-1 ring-white/10"><h2 className="mb-3 font-bold">Issues found on {first.domain}</h2><ul className="space-y-2 text-sm">{first.onpage.issues.map((x: any, i: number) => <li key={i}><span className="mr-2 rounded bg-royal/30 px-2 py-0.5 font-mono text-xs">{x.severity}</span>{x.message}</li>)}</ul></div>}
      </section>}
    </main>
  );
}
