'use client';
import { useAudit } from '@/components/AuditProvider';
import Brachiosaurus from '@/components/Brachiosaurus';
import { Empty } from '@/components/ui';
const verdict = (n: number) => n >= 80 ? 'Strong' : n >= 60 ? 'Fair' : 'Needs attention';
export default function Reports() {
  const { data, compare } = useAudit(); if (!data) return <Empty />;
  const me = data[0], o = me.onpage, all = compare && compare[0]?.domain === me.domain ? compare : data, rivals = all.slice(1);
  const fixes = (o?.issues ?? []).slice(0, 5);
  function csv() {
    const h = ['domain', 'DA', 'PA', 'spam', 'backlinks', 'refDomains', 'ageYears', 'health', 'mobile', 'desktop', 'LCP', 'CLS', 'INP'];
    const rows = all.map((d: any) => [d.domain, d.moz.da, d.moz.pa, d.moz.spam, d.moz.backlinks, d.moz.refDomains, d.age.ageYears, d.healthScore, d.mobile.performance, d.desktop.performance, d.mobile.lcp, d.mobile.cls, d.mobile.inp].join(','));
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([[h.join(','), ...rows].join('\n')], { type: 'text/csv' })); a.download = 'searchpilot-report.csv'; a.click();
  }
  return (<div className="space-y-6"><h1 className="text-2xl font-extrabold print:hidden">Reports and export</h1>
    <div className="flex gap-3 print:hidden"><button onClick={csv} className="rounded-lg bg-royal px-5 py-2 font-bold hover:bg-bright">Download CSV</button><button onClick={() => window.print()} className="rounded-lg bg-surface px-5 py-2 font-bold ring-1 ring-white/20 hover:ring-bright">Download PDF</button></div>
    <article className="rounded-2xl bg-white p-8 text-obsidian">
      <header className="mb-6 flex items-center gap-4 border-b border-slate/30 pb-4"><Brachiosaurus size={64} /><div><p className="text-2xl font-extrabold">SearchPilot SEO Report</p><p className="text-sm text-slate">{me.domain} · {new Date().toLocaleDateString()}</p></div></header>
      <h2 className="text-lg font-bold">Summary</h2>
      <p className="mt-1 text-sm">Your search health is <b>{verdict(me.healthScore)}</b> ({me.healthScore}/100). Your site loads {me.mobile.performance >= 90 ? 'fast' : me.mobile.performance >= 50 ? 'at an average speed' : 'slowly'} on phones (score {me.mobile.performance}/100).{rivals.length > 0 && ` Compared with ${rivals.length} competitor${rivals.length > 1 ? 's' : ''}, your health score is ${me.healthScore >= Math.max(...rivals.map((r: any) => r.healthScore)) ? 'the highest' : 'not the highest'} in this group.`}</p>
      <h2 className="mt-6 text-lg font-bold">Top things to fix first</h2>
      {fixes.length ? <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">{fixes.map((x: any, i: number) => <li key={i}><b>{x.severity}:</b> {x.message}</li>)}</ol> : <p className="mt-1 text-sm">No issues were found on your home page.</p>}
      <h2 className="mt-6 text-lg font-bold">Side-by-side</h2>
      <table className="mt-1 w-full text-sm"><thead><tr className="text-left text-slate"><th className="py-2">Site</th><th>Authority</th><th>Health</th><th>Mobile</th><th>Desktop</th></tr></thead><tbody>{all.map((d: any) => <tr key={d.domain} className="border-t border-slate/20"><td className="py-2 font-mono">{d.domain}</td><td>{d.moz.da}</td><td>{d.healthScore}</td><td>{d.mobile.performance}</td><td>{d.desktop.performance}</td></tr>)}</tbody></table>
      <p className="mt-6 text-xs text-slate">Speed and domain age may be live or demo depending on your setup. Authority values are demo until a Moz key is connected.</p>
    </article></div>);
}
