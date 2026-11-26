'use client';
import { useState } from 'react';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty } from '@/components/ui';
export default function OnPage() {
  const { data } = useAudit(); const [kw, setKw] = useState('');
  if (!data) return <Empty />;
  const o = data[0].onpage; if (!o) return <Card title="On-Page SEO"><p className="text-sm text-slate">Could not crawl {data[0].domain}.</p></Card>;
  const has = (t: string) => !!kw && t.toLowerCase().includes(kw.toLowerCase());
  const rows: [string, any][] = [['Title', `${o.title || 'Missing'} (${o.titleLen} chars)`], ['Meta description', `${o.metaLen} chars`], ['Canonical', o.canonical ?? 'None'], ['Robots meta', o.robotsMeta ?? 'None'], ['Word count', o.words], ['Images / missing ALT', `${o.images} / ${o.imagesNoAlt}`], ['Internal links', o.internalLinks], ['External links', o.externalLinks], ['Nofollow links', o.nofollow], ...[1, 2, 3, 4, 5, 6].map((n): [string, any] => [`H${n} tags`, o.headings['h' + n]])];
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">On-Page SEO: {data[0].domain}</h1>
    <Card title="Target keyword"><input aria-label="Target keyword" value={kw} onChange={e => setKw(e.target.value)} placeholder="e.g. running shoes" className="w-full rounded-lg bg-obsidian px-3 py-2 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-bright" />
      {kw && <ul className="mt-3 space-y-1 text-sm"><li className={has(o.title) ? 'text-green-400' : 'text-red-400'}>{has(o.title) ? 'Found' : 'Missing'} in title</li><li className={has(o.metaDescription) ? 'text-green-400' : 'text-red-400'}>{has(o.metaDescription) ? 'Found' : 'Missing'} in meta description</li></ul>}</Card>
    <Card><table className="w-full text-sm"><tbody>{rows.map(([l, v]) => <tr key={l} className="border-t border-white/10 first:border-0"><td className="py-2 text-slate">{l}</td><td className="py-2 font-mono">{String(v)}</td></tr>)}</tbody></table></Card></div>);
}
