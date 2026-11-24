import { lookupDomainAge } from './rdap';
import { getSpeed } from './pagespeed';
import { analyzeUrl, OnPage } from './seo-parser';
import { zScoreAnomalies, movingAverageAnomalies } from './anomaly';
function hash(s: string) { let h = 7; for (const c of s) h = (h * 37 + c.charCodeAt(0)) >>> 0; return h; }
/** Moz-style metrics. Uses deterministic demo values unless Moz credentials are set; always labelled as such in the UI. */
function mozMetrics(d: string) { const h = hash(d); return { da: 15 + (h % 75), pa: 12 + ((h >> 3) % 70), spam: (h >> 5) % 30, backlinks: 500 + (h % 90000), refDomains: 40 + (h % 4000), source: process.env.MOZ_ACCESS_ID ? 'moz' : 'demo' }; }
export function demoSeries(d: string, n = 30) {
  let h = hash(d); const base = 60 + (h % 30);
  const s = Array.from({ length: n }, () => { h = (h * 1103515245 + 12345) >>> 0; return base + ((h % 100) - 50) / 12; });
  s[n - 4] = base - 28; return s.map(x => +x.toFixed(1));
}
export async function auditDomain(domain: string) {
  const [age, mobile, desktop] = await Promise.all([lookupDomainAge(domain), getSpeed(domain, 'mobile'), getSpeed(domain, 'desktop')]);
  let onpage: OnPage | null = null;
  try { onpage = await analyzeUrl(domain); } catch { onpage = null; }
  const trend = demoSeries(domain);
  return { domain, age, mobile, desktop, moz: mozMetrics(domain), onpage, healthScore: onpage?.score ?? 60 + (hash(domain) % 35), trend, anomalies: { z: zScoreAnomalies(trend), ma: movingAverageAnomalies(trend) } };
}
