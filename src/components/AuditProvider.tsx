'use client';
import { createContext, useContext, useState } from 'react';
const Ctx = createContext<any>(null);
export const useAudit = () => useContext(Ctx);
export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [domain, setDomain] = useState(''); const [comps, setComps] = useState(['', '', '']);
  const [data, setData] = useState<any[] | null>(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  async function run() {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/audit', { method: 'POST', body: JSON.stringify({ domain, competitors: comps.filter(Boolean) }) });
      const j = await r.json();
      if (!r.ok) setErr(j.error); else setData(j.results);
    } catch { setErr('Could not reach the server. Try again.'); }
    setBusy(false);
  }
  return <Ctx.Provider value={{ domain, setDomain, comps, setComps, data, busy, err, run }}>{children}</Ctx.Provider>;
}
export function AuditBar() {
  const { domain, setDomain, comps, setComps, busy, err, run } = useAudit();
  const cls = 'rounded-lg bg-obsidian px-3 py-2 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright';
  return (
    <div className="mb-6 rounded-2xl bg-surface p-4 ring-1 ring-white/10 print:hidden">
      <div className="grid gap-2 md:grid-cols-4">
        <input aria-label="Your website" value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourbusiness.com" className={cls} />
        {comps.map((c: string, i: number) => <input key={i} aria-label={`Competitor ${i + 1}`} value={c} onChange={e => setComps(comps.map((x: string, j: number) => j === i ? e.target.value : x))} placeholder={`Competitor ${i + 1}`} className={cls} />)}
      </div>
      <button onClick={run} disabled={busy || !domain} className="mt-3 rounded-lg bg-royal px-5 py-2 font-bold transition hover:bg-bright hover:shadow-[0_0_24px_#3B82F680] disabled:opacity-50">{busy ? 'Running audit…' : 'Run audit'}</button>
      {err && <p role="alert" className="mt-2 text-sm text-red-400">{err}</p>}
    </div>
  );
}
