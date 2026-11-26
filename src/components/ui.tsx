import Brachiosaurus from './Brachiosaurus';
export const Card = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="rounded-2xl bg-surface p-5 ring-1 ring-white/10">{title && <h2 className="mb-3 font-bold">{title}</h2>}{children}</div>
);
export const Empty = () => (
  <div className="flex flex-col items-center py-16 text-center"><Brachiosaurus size={140} />
    <h2 className="mt-4 text-xl font-bold">No audit yet</h2>
    <p className="mt-1 max-w-sm text-sm text-slate">Enter your website above and click Run audit. Every tool in the sidebar will fill with data.</p></div>
);
export const Badge = ({ s }: { s: string }) => {
  const c: any = { Critical: 'bg-red-500/20 text-red-300', High: 'bg-orange-500/20 text-orange-300', Medium: 'bg-yellow-500/20 text-yellow-200', Low: 'bg-royal/30 text-blue-200' };
  return <span className={`mr-2 rounded px-2 py-0.5 font-mono text-xs ${c[s] ?? c.Low}`}>{s}</span>;
};
export const tip = { contentStyle: { background: '#111520', border: 0 } };
