'use client';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, Badge } from '@/components/ui';
export default function SiteAudit() {
  const { data } = useAudit(); if (!data) return <Empty />;
  const d = data[0], o = d.onpage;
  if (!o) return <Card title="Site Audit"><p className="text-sm text-slate">SearchPilot could not crawl {d.domain}. The site may block bots or be offline.</p></Card>;
  const order = ['Critical', 'High', 'Medium', 'Low'];
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Site Audit: {d.domain}</h1>
    <div className="grid gap-4 sm:grid-cols-5"><Card title="Health"><p className="font-mono text-4xl font-bold">{o.score}</p></Card>
      {order.map(s => <Card key={s} title={s}><p className="font-mono text-3xl font-bold">{o.issues.filter((x: any) => x.severity === s).length}</p></Card>)}</div>
    <Card title="Issues">{o.issues.length === 0 ? <p className="text-sm text-slate">No issues found.</p> : <ul className="space-y-2 text-sm">{[...o.issues].sort((a: any, b: any) => order.indexOf(a.severity) - order.indexOf(b.severity)).map((x: any, i: number) => <li key={i}><Badge s={x.severity} />{x.message}</li>)}</ul>}</Card>
    <Card title="Checks"><ul className="grid gap-2 text-sm sm:grid-cols-2">{[['HTTPS', o.https], ['robots.txt', o.robotsTxt], ['sitemap.xml', o.sitemap], ['Canonical tag', !!o.canonical], ['Indexable', !/noindex/i.test(o.robotsMeta ?? '')]].map(([l, ok]: any) => <li key={l}><span className={ok ? 'text-green-400' : 'text-red-400'}>{ok ? 'Pass' : 'Fail'}</span> {l}</li>)}</ul></Card>
    <p className="text-xs text-slate">Live crawl of the home page only. Full-site broken-link and orphan-page checks are not built yet.</p></div>);
}
