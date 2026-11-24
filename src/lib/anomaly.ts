export type Anomaly = { index: number; value: number; score: number; method: 'z-score' | 'moving-average'; severity: 'Critical' | 'High' | 'Medium' | 'Low' };
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const std = (a: number[]) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); };
const sev = (s: number): Anomaly['severity'] => { const a = Math.abs(s); return a >= 4 ? 'Critical' : a >= 3 ? 'High' : a >= 2.5 ? 'Medium' : 'Low'; };
/** Z = (x - mu) / sigma over the full series */
export function zScoreAnomalies(series: number[], threshold = 2): Anomaly[] {
  if (series.length < 3) return [];
  const m = mean(series), sd = std(series);
  if (sd === 0) return [];
  return series.flatMap((v, i) => { const z = (v - m) / sd; return Math.abs(z) >= threshold ? [{ index: i, value: v, score: +z.toFixed(2), method: 'z-score' as const, severity: sev(z) }] : []; });
}
/** Compares each point to the mean/std of the preceding window */
export function movingAverageAnomalies(series: number[], window = 7, k = 2.5): Anomaly[] {
  const out: Anomaly[] = [];
  for (let i = window; i < series.length; i++) {
    const w = series.slice(i - window, i), m = mean(w), sd = std(w) || 1e-9;
    const s = (series[i] - m) / sd;
    if (Math.abs(s) >= k) out.push({ index: i, value: series[i], score: +s.toFixed(2), method: 'moving-average', severity: sev(s) });
  }
  return out;
}
