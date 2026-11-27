'use client';
import { useAudit } from '@/components/AuditProvider';
import { Empty } from '@/components/ui';
import { demoKeywords } from '@/lib/demo';
export default function KeywordGap() {
  const { compare } = useAudit();
  if (!compare) return <div className="space-y-4"><h1 className="text-2xl font-extrabold">Keyword Gap</h1><Empty /><p className="text-center text-sm text-slate">Run a comparison on the Compare Domains page first.</p></div>;
  const sets = compare.map((d: any) => demoKeywords(d.domain));
  const names = sets[0].map((k: any) => k.term.split(' ').slice(1).join(' '));
  return (<div className="space-y-4"><h1 className="text-2xl font-extrabold">Keyword Gap</h1><p className="text-xs text-slate">Demo data. Lower position is better; green marks where you rank best.</p>
    <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-white/10"><table className="w-full min-w-[560px] text-sm"><thead><tr className="text-left text-slate"><th className="p-3">Keyword theme</th>{compare.map((d: any) => <th key={d.domain} className="font-mono">{d.domain}</th>)}</tr></thead><tbody className="font-mono">
      {names.map((n: string, r: number) => { const pos = sets.map((s: any) => s[r].position), best = Math.min(...pos); return <tr key={n} className="border-t border-white/10"><td className="p-3 font-sans">{n}</td>{pos.map((p: number, c: number) => <td key={c} className={p === best && c === 0 ? 'text-green-400' : ''}>{p}</td>)}</tr>; })}</tbody></table></div></div>);
}
