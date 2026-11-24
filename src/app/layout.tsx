import './globals.css';
export const metadata = { title: 'SearchPilot', description: 'Guiding businesses towards better search visibility' };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
