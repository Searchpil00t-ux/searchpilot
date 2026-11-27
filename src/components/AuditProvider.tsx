'use client';
import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext<any>(null);
export const useAudit = () => useContext(Ctx);
export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [domain, setDomain] = useState(''); const [comps, setComps] = useState(['', '', '']);
  const [data, setData] = useState<any[] | null>(null); const [compare, setCompare] = useState<any[] | null>(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  async function call(competitors: string[], dom = domain) {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/audit', { method: 'POST', body: JSON.stringify({ domain: dom, competitors }) });
      const j = await r.json();
      if (!r.ok) { setErr(j.error); return null; }
      return j.results;
    } catch { setErr('Could not reach the server. Try again.'); return null; } finally { setBusy(false); }
  }
  async function run(d?: any) { const r = await call([], typeof d === 'string' ? d : domain); if (r) { setData(r); setCompare(null); } }
  async function runCompare() { const r = await call(comps.filter(Boolean)); if (r) setCompare(r); }
  useEffect(() => { try { const d = sessionStorage.getItem('sp_domain'); if (d) { sessionStorage.removeItem('sp_domain'); setDomain(d); run(d); } } catch {} }, []);
  return <Ctx.Provider value={{ domain, setDomain, comps, setComps, data, compare, busy, err, run, runCompare }}>{children}</Ctx.Provider>;
}
export function AuditBar() {
  const { domain, setDomain, busy, err, run } = useAudit();
  return (
    <div className="mb-6 rounded-2xl bg-surface p-4 ring-1 ring-white/10 print:hidden">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input aria-label="Your website" value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourbusiness.com" className="flex-1 rounded-lg bg-obsidian px-3 py-2 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright" />
        <button onClick={run} disabled={busy || !domain} className="rounded-lg bg-royal px-5 py-2 font-bold transition hover:bg-bright hover:shadow-[0_0_24px_#3B82F680] disabled:opacity-50">{busy ? 'Running…' : 'Run audit'}</button>
      </div>
      {err && <p role="alert" className="mt-2 text-sm text-red-400">{err}</p>}
    </div>
  );
}
