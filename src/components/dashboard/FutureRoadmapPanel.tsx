import { Bot, DatabaseZap, Map, Rocket } from 'lucide-react';
import { Card } from '../ui/Card';

const phases = [
  {
    title: 'Fase 0 - Demo Challenge',
    Icon: Rocket,
    items: ['mappa Bergamo', 'mock hotspot', 'score demo', 'filtri', 'export CSV', 'storytelling Brofind'],
  },
  {
    title: 'Fase 1 - MVP',
    Icon: Map,
    items: [
      'ingestion OpenStreetMap',
      'database PostgreSQL + PostGIS',
      'matching aziende',
      'ATECO',
      'utenti interni',
      'export lead per sales',
    ],
  },
  {
    title: 'Fase 2 - Lead Intelligence',
    Icon: DatabaseZap,
    items: [
      'Registro Imprese o provider dati',
      'fonti ISPRA/AIA/AUA',
      'scoring configurabile',
      'esclusione clienti esistenti',
      'assegnazione lead',
    ],
  },
  {
    title: 'Fase 3 - AI e automazione',
    Icon: Bot,
    items: [
      'computer vision autorizzata',
      'riconoscimento camini/capannoni',
      'bozza proposta RTO/VOC/Scrubber',
      'integrazione CRM',
      'alert nuove opportunita',
    ],
  },
];

export const FutureRoadmapPanel = () => (
  <Card className="p-5">
    <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Roadmap scalabile</p>
    <h2 className="mt-1 text-2xl font-black text-slate-950">Da mock locale a piattaforma GIS-AI</h2>
    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {phases.map(({ title, items, Icon }) => (
        <div key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <Icon className="mb-3 h-5 w-5 text-brofind-red" />
          <h3 className="font-bold text-slate-950">{title}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brofind-blue" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Card>
);
