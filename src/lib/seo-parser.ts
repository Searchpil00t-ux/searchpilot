export type OnPage = { url: string; status: number; https: boolean; title: string; titleLen: number; metaDescription: string; metaLen: number; canonical: string | null; robotsMeta: string | null; headings: Record<string, number>; h1Count: number; images: number; imagesNoAlt: number; internalLinks: number; externalLinks: number; nofollow: number; words: number; robotsTxt: boolean; sitemap: boolean; issues: { severity: 'Critical' | 'High' | 'Medium' | 'Low'; message: string }[]; score: number };
const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? null;
async function exists(u: string) { try { return (await fetch(u, { signal: AbortSignal.timeout(6000) })).ok; } catch { return false; } }
export async function analyzeUrl(domain: string): Promise<OnPage> {
  const url = `https://${domain}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'follow', headers: { 'User-Agent': 'SearchPilotBot/1.0' } });
  const html = await res.text();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() ?? '';
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const metaDescription = metas.filter(m => attr(m, 'name')?.toLowerCase() === 'description').map(m => attr(m, 'content') ?? '')[0] ?? '';
  const robotsMeta = metas.filter(m => attr(m, 'name')?.toLowerCase() === 'robots').map(m => attr(m, 'content'))[0] ?? null;
  const canonical = (html.match(/<link\b[^>]*>/gi) ?? []).filter(l => attr(l, 'rel')?.toLowerCase() === 'canonical').map(l => attr(l, 'href'))[0] ?? null;
  const headings: Record<string, number> = {};
  for (let i = 1; i <= 6; i++) headings['h' + i] = (html.match(new RegExp(`<h${i}\\b`, 'gi')) ?? []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const imagesNoAlt = imgs.filter(t => !(attr(t, 'alt') ?? '').trim()).length;
  const links = html.match(/<a\b[^>]*>/gi) ?? [];
  let internal = 0, external = 0, nofollow = 0;
  for (const a of links) {
    const h = attr(a, 'href') ?? '';
    if (/^https?:\/\//i.test(h) && !h.includes(domain)) external++; else if (h && !h.startsWith('#') && !/^(mailto|tel|javascript):/i.test(h)) internal++;
    if (/nofollow/i.test(attr(a, 'rel') ?? '')) nofollow++;
  }
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(w => /\w/.test(w)).length;
  const [robotsTxt, sitemap] = await Promise.all([exists(`${url}/robots.txt`), exists(`${url}/sitemap.xml`)]);
  const issues: OnPage['issues'] = [];
  const add = (severity: any, message: string) => issues.push({ severity, message });
  if (res.status >= 400) add('Critical', `Page returned HTTP ${res.status}`);
  if (!title) add('Critical', 'Missing title tag'); else if (title.length > 60 || title.length < 30) add('Medium', `Title is ${title.length} characters (aim for 30–60)`);
  if (!metaDescription) add('High', 'Missing meta description'); else if (metaDescription.length > 160) add('Low', 'Meta description exceeds 160 characters');
  if (headings.h1 === 0) add('High', 'Missing H1'); else if (headings.h1 > 1) add('Medium', `${headings.h1} H1 tags found (use one)`);
  if (imagesNoAlt) add('Medium', `${imagesNoAlt} of ${imgs.length} images lack ALT text`);
  if (!canonical) add('Low', 'No canonical tag');
  if (/noindex/i.test(robotsMeta ?? '')) add('Critical', 'Page is set to noindex');
  if (!robotsTxt) add('Medium', 'robots.txt not found');
  if (!sitemap) add('Medium', 'sitemap.xml not found');
  if (words < 300) add('Low', `Thin content: ${words} words`);
  const w = { Critical: 25, High: 12, Medium: 6, Low: 2 };
  return { url, status: res.status, https: res.url.startsWith('https'), title, titleLen: title.length, metaDescription, metaLen: metaDescription.length, canonical, robotsMeta, headings, h1Count: headings.h1, images: imgs.length, imagesNoAlt, internalLinks: internal, externalLinks: external, nofollow, words, robotsTxt, sitemap, issues, score: Math.max(0, 100 - issues.reduce((s, i) => s + w[i.severity], 0)) };
}
