import { Construction } from 'lucide-react';

export const ConsulenzaPersonaleModule = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <div className="rounded-full bg-brofind-blue/10 p-6">
      <Construction className="h-12 w-12 text-brofind-blue opacity-60" />
    </div>
    <h2 className="text-2xl font-black text-slate-950">Consulenza e Personale</h2>
    <p className="max-w-md text-base text-slate-500">
      Questo modulo è in sviluppo. Supporterà la gestione di consulenze tecniche e delle risorse
      umane interne a Brofind.
    </p>
    <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
      Work in Progress
    </span>
  </div>
);
