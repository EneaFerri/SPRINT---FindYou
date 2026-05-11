import { ArrowRight, Construction, Search, Users, Wrench } from 'lucide-react';
import type { ModuleId } from '../App';

const modules: {
  id: ModuleId;
  title: string;
  description: string;
  Icon: React.ElementType;
  active: boolean;
}[] = [
  {
    id: 'ricerca-clienti',
    title: 'Ricerca Clienti',
    description:
      'Identifica hotspot industriali ad alto potenziale nella provincia di Bergamo. Mappa GIS, Brofind Lead Score e schede lead pronte per sales e tecnico.',
    Icon: Search,
    active: true,
  },
  {
    id: 'ricerca-fornitori',
    title: 'Ricerca Fornitori',
    description:
      'Qualifica e monitora fornitori strategici per Brofind. Analisi di mercato, scoring e gestione delle relazioni con il procurement.',
    Icon: Wrench,
    active: false,
  },
  {
    id: 'consulenza-personale',
    title: 'Consulenza e Personale',
    description:
      'Gestione di consulenze tecniche e risorse umane interne. Supporto alle attività operative e di sviluppo professionale.',
    Icon: Users,
    active: false,
  },
];

export const LandingPage = ({ onSelect }: { onSelect: (module: ModuleId) => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-brofind-mist px-6 py-16">
    <div className="w-full max-w-5xl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brofind-red via-brofind-blue to-brofind-cyan" />
        <img
          src="/assets/logo-sprint.png"
          alt="BROFIND Find You"
          className="w-full max-w-[600px] object-contain"
        />
        <p className="mt-3 text-lg font-semibold text-brofind-blue">
          Industrial Intelligence Platform
        </p>
        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
          Seleziona il modulo con cui vuoi lavorare. Ogni area copre un reparto specifico di
          Brofind.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brofind-red/30 bg-white px-4 py-2 text-sm font-semibold text-brofind-red shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brofind-red" />
          BROFIND SUSTAINABILITY SPRINT CHALLENGE 2026 — Innovation Pod: A. Monguzzi · E. Ferri · M. Mancuso · M. Varacalli
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {modules.map(({ id, title, description, Icon, active }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`group relative flex flex-col rounded-2xl border p-6 text-left shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brofind-blue ${
              active
                ? 'border-brofind-red/30 bg-white hover:border-brofind-red hover:shadow-lg'
                : 'border-slate-200 bg-white/70 hover:border-brofind-blue/40 hover:bg-white hover:shadow-md'
            }`}
          >
            {active ? (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                LIVE
              </span>
            ) : (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                <Construction className="h-3 w-3" />
                Work in Progress
              </span>
            )}

            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                active ? 'bg-brofind-red text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{description}</p>

            <div
              className={`mt-5 flex items-center gap-1 text-sm font-semibold transition ${
                active
                  ? 'text-brofind-red group-hover:gap-2'
                  : 'text-slate-400 group-hover:text-brofind-blue group-hover:gap-2'
              }`}
            >
              {active ? 'Apri modulo' : 'Anteprima'}
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);
