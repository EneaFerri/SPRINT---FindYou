import { Bot, DatabaseZap, Map, Rocket } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';

const phases = [
  {
    title: 'Fase 0 — Demo Challenge',
    period: 'Maggio 2026 ✅',
    done: true,
    Icon: Rocket,
    items: [
      'mappa interattiva Bergamo',
      '50 hotspot reali OSM + mock',
      'Brofind Lead Score (5 fattori)',
      'filtri comune / ATECO / priorità',
      'export CSV per CRM',
      'toggle dati reali / demo',
      'storytelling ESG integrato',
    ],
  },
  {
    title: 'Fase 1 — MVP',
    period: 'Luglio–Settembre 2026',
    done: false,
    Icon: Map,
    items: [
      'database PostgreSQL + PostGIS',
      'integrazione CCIAA / Registro Imprese',
      'matching aziende con ATECO reale',
      'utenti interni multi-reparto',
      'export lead per sales + CRM',
    ],
  },
  {
    title: 'Fase 2 — Lead Intelligence',
    period: 'Settembre–Ottobre 2026',
    done: false,
    Icon: DatabaseZap,
    items: [
      'fonti ISPRA / AIA / AUA emissioni',
      'scoring configurabile per reparto',
      'esclusione clienti esistenti',
      'assegnazione lead a sales',
      'KPI dashboard management',
    ],
  },
  {
    title: 'Fase 3 — AI e automazione',
    period: 'Ottobre–Dicembre 2026',
    done: false,
    Icon: Bot,
    items: [
      'Claude AI API: enrichment ATECO',
      'bozza offerta RTO/VOC automatica',
      'computer vision capannoni/camini',
      'integrazione CRM nativa',
      'alert nuove opportunità',
    ],
  },
];

export const FutureRoadmapPanel = () => (
  <Card className="p-5">
    <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Roadmap scalabile</p>
    <h2 className="mt-1 text-2xl font-black text-slate-950">Da demo locale a piattaforma GIS-AI</h2>
    <p className="mt-2 text-sm leading-6 text-slate-500">
      Sviluppo in 4 fasi — la Fase 0 è già operativa. Le fasi successive sono condizionate all'esito
      della BSSC-2026.
    </p>
    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {phases.map(({ title, period, done, items, Icon }) => (
        <div
          key={title}
          className={`rounded-lg border p-4 shadow-sm ${
            done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <Icon className={`h-5 w-5 flex-none mt-0.5 ${done ? 'text-emerald-600' : 'text-brofind-red'}`} />
            {done && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                LIVE
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-950">{title}</h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-400">{period}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className={`mt-2 h-1.5 w-1.5 flex-none rounded-full ${done ? 'bg-emerald-500' : 'bg-brofind-blue'}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Card>
);
