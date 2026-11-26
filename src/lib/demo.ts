function hash(s: string) { let h = 11; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function rnd(seed: number) { let h = seed; return () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; }; }
const intents = ['Informational', 'Commercial', 'Transactional', 'Navigational'];
export function demoKeywords(domain: string) {
  const brand = domain.split('.')[0], r = rnd(hash(domain));
  return ['reviews', 'pricing', 'near me', 'best options', 'how to choose', 'alternatives', 'buy online', 'guide'].map((s, i) => {
    const start = 4 + Math.floor(r() * 30), hist: number[] = [start];
    for (let d = 1; d < 14; d++) hist.push(Math.max(1, hist[d - 1] + Math.round((r() - 0.5) * 4)));
    if (i % 3 === 0) hist[13] = hist[12] + 9;
    return { term: `${brand} ${s}`, position: hist[13], prev: hist[12], volume: 100 + Math.floor(r() * 9000), kd: 10 + Math.floor(r() * 80), intent: intents[i % 4], hist };
  });
}
export function demoBacklinks(domain: string) {
  const r = rnd(hash(domain) + 5), brand = domain.split('.')[0];
  const anchors = [[brand, 38], ['click here', 12], ['website', 9], ['https://' + domain, 14], ['best ' + brand, 7], ['other', 20]].map(([name, v]: any) => ({ name, value: v + Math.floor(r() * 6) }));
  const flow = Array.from({ length: 12 }, (_, i) => ({ m: `M${i + 1}`, New: 10 + Math.floor(r() * 60), Lost: 4 + Math.floor(r() * 35) }));
  const toxic = ['cheap-links-seo.xyz', 'free-backlinks-4u.top', 'casino-directory.click'].slice(0, 1 + Math.floor(r() * 3));
  return { anchors, flow, follow: 60 + Math.floor(r() * 30), toxic };
}
