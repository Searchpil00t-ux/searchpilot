export type DomainAge = { created: string | null; expires: string | null; ageYears: number | null; source: 'rdap' | 'demo' };
function hash(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
export function demoAge(domain: string): DomainAge {
  const yrs = 2 + (hash(domain) % 18), c = new Date(); c.setFullYear(c.getFullYear() - yrs);
  const e = new Date(); e.setMonth(e.getMonth() + 1 + (hash(domain) % 11));
  return { created: c.toISOString().slice(0, 10), expires: e.toISOString().slice(0, 10), ageYears: yrs, source: 'demo' };
}
export async function lookupDomainAge(domain: string): Promise<DomainAge> {
  try {
    const r = await fetch(`https://rdap.org/domain/${domain}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('rdap ' + r.status);
    const j = await r.json();
    const ev = (a: string) => j.events?.find((e: any) => e.eventAction === a)?.eventDate ?? null;
    const created = ev('registration'), expires = ev('expiration');
    const ageYears = created ? +((Date.now() - new Date(created).getTime()) / 3.156e10).toFixed(1) : null;
    return { created: created?.slice(0, 10) ?? null, expires: expires?.slice(0, 10) ?? null, ageYears, source: 'rdap' };
  } catch { return demoAge(domain); }
}
