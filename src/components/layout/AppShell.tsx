import { Header } from './Header';

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-brofind-mist text-slate-900">
    <Header />
    <main className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">{children}</main>
  </div>
);
