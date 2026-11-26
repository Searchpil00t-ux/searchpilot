'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Brachiosaurus from '@/components/Brachiosaurus';
import { Gauge, Search, Link2, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  const router = useRouter(); const [domain, setDomain] = useState(''); const [comps, setComps] = useState(['', '', '']);
  const go = () => router.push('/dashboard');
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <nav className="flex items-center gap-3 py-5"><Brachiosaurus size={44} /><span className="text-xl font-extrabold tracking-tight">SearchPilot</span><Link href="/dashboard" className="ml-auto rounded-lg bg-royal px-4 py-2 text-sm font-bold hover:bg-bright">Open dashboard</Link></nav>
      <section className="py-12 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Guiding businesses towards better search visibility</h1>
        <div className="my-10 flex justify-center"><Brachiosaurus size={220} /></div>
        <div className="mx-auto max-w-2xl rounded-2xl bg-surface p-4 text-left ring-1 ring-white/10">
          <p className="text-sm text-slate">Enter your website and up to 3 competitors, then run the audit in the dashboard.</p>
          <input aria-label="Your website" value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourbusiness.com" className="mb-3 mt-2 w-full rounded-lg bg-obsidian px-4 py-3 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright" />
          <div className="grid gap-2 sm:grid-cols-3">{comps.map((c, i) => <input key={i} aria-label={`Competitor ${i + 1}`} value={c} onChange={e => setComps(comps.map((x, j) => j === i ? e.target.value : x))} placeholder={`Competitor ${i + 1}`} className="rounded-lg bg-obsidian px-3 py-2 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright" />)}</div>
          <button onClick={go} className="mt-4 w-full rounded-lg bg-royal py-3 font-bold transition hover:bg-bright hover:shadow-[0_0_24px_#3B82F680]">Open dashboard</button>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[[Gauge, 'Performance', 'Core Web Vitals, mobile and desktop'], [Search, 'Technical SEO', 'Real crawl of titles, headings, ALT, robots'], [Link2, 'Competitor intel', 'Side-by-side with up to 3 rivals'], [ShieldCheck, 'Domain authority', 'DA, PA, spam score, domain age'], [Activity, 'Anomaly detection', 'Z-score and moving-average alerts']].map(([I, t, s]: any) => <div key={t} className="rounded-xl bg-surface p-5 ring-1 ring-white/10"><I className="mb-3 text-glow" size={22} /><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-slate">{s}</p></div>)}</section>
    </main>
  );
}
