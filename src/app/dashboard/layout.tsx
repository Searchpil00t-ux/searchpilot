'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Gauge, SearchCheck, FileSearch, KeyRound, Link2, BellRing, FileDown, Users, GitCompare, ArrowLeftRight } from 'lucide-react';
import Brachiosaurus from '@/components/Brachiosaurus';
import { AuditProvider, AuditBar } from '@/components/AuditProvider';
const groups: [string, [string, string, any][]][] = [
  ['Project', [['/dashboard', 'Dashboard', LayoutDashboard]]],
  ['Site Performance', [['/dashboard/site-audit', 'Site Audit', SearchCheck], ['/dashboard/performance', 'Performance', Gauge], ['/dashboard/on-page', 'On-Page SEO', FileSearch]]],
  ['Competitive Analysis', [['/dashboard/compare', 'Compare Domains', Users], ['/dashboard/keyword-gap', 'Keyword Gap', GitCompare], ['/dashboard/backlink-gap', 'Backlink Gap', ArrowLeftRight]]],
  ['Keyword Research', [['/dashboard/keywords', 'Rank Tracking', KeyRound]]],
  ['Authority', [['/dashboard/backlinks', 'Backlink Analytics', Link2]]],
  ['Monitoring', [['/dashboard/alerts', 'Alerts', BellRing], ['/dashboard/reports', 'Reports', FileDown]]],
];
export default function DashLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <AuditProvider>
      <div className="min-h-screen md:flex">
        <aside className="border-b border-white/10 bg-surface p-3 md:w-60 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r print:hidden">
          <Link href="/" className="mb-3 flex items-center gap-2 px-2"><Brachiosaurus size={36} /><span className="font-extrabold">SearchPilot</span></Link>
          <nav>{groups.map(([title, items]) => <div key={title} className="mb-3"><p className="px-3 pb-1 pt-2 text-xs uppercase tracking-wide text-slate">{title}</p>
            <div className="flex gap-1 overflow-x-auto md:flex-col">{items.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${path === href ? 'bg-royal text-white' : 'text-slate hover:bg-white/5 hover:text-white'}`}><Icon size={16} />{label}</Link>)}</div></div>)}</nav>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:p-8"><AuditBar />{children}</main>
      </div>
    </AuditProvider>
  );
}
