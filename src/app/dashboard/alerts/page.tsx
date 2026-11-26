'use client';
import { useAudit } from '@/components/AuditProvider';
import { Card, Empty, Badge } from '@/components/ui';
export default function Alerts() {
  const { data } = useAudit(); if (!data) return <Empty />;
  const items = data.flatMap((d: any) => [...d.anomalies.z, ...d.anomalies.ma].map((a: any) => ({ ...a, domain: d.domain })));
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold">Alerts center</h1>
    <Card title="Detected anomalies">{items.length === 0 ? <p className="text-sm text-slate">No anomalies detected.</p> : <ul className="space-y-2 text-sm">{items.map((a: any, i: number) => <li key={i}><Badge s={a.severity} /><span className="font-mono">{a.domain}</span>: SEO health hit {a.value} on day {a.index + 1} ({a.method}, score {a.score})</li>)}</ul>}</Card>
    <p className="text-xs text-slate">Uses Z = (x − μ) / σ and a 7-day moving average on a demo 30-day series. Email alerts are not set up yet.</p></div>);
}
