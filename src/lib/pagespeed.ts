export type Speed = { performance: number; lcp: number; cls: number; inp: number; fcp: number; ttfb: number; source: 'pagespeed' | 'demo' };
function hash(s: string) { let h = 0; for (const c of s) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h; }
export function demoSpeed(domain: string, strategy: string): Speed {
  const h = hash(domain + strategy), base = 55 + (h % 40) - (strategy === 'mobile' ? 12 : 0);
  return { performance: Math.max(20, Math.min(99, base)), lcp: +(1.2 + (h % 30) / 10).toFixed(2), cls: +((h % 25) / 100).toFixed(3), inp: 90 + (h % 300), fcp: +(0.8 + (h % 15) / 10).toFixed(2), ttfb: 120 + (h % 600), source: 'demo' };
}
export async function getSpeed(domain: string, strategy: 'mobile' | 'desktop'): Promise<Speed> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return demoSpeed(domain, strategy);
  try {
    const u = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent('https://' + domain)}&strategy=${strategy}&key=${key}`;
    const j = await (await fetch(u, { signal: AbortSignal.timeout(60000) })).json();
    const a = j.lighthouseResult.audits;
    return { performance: Math.round(j.lighthouseResult.categories.performance.score * 100), lcp: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(2), cls: +a['cumulative-layout-shift'].numericValue.toFixed(3), inp: Math.round(j.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile ?? a['max-potential-fid']?.numericValue ?? 0), fcp: +(a['first-contentful-paint'].numericValue / 1000).toFixed(2), ttfb: Math.round(a['server-response-time'].numericValue), source: 'pagespeed' };
  } catch { return demoSpeed(domain, strategy); }
}
