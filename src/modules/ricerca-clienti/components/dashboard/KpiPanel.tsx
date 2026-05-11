import { Card } from '../../../../components/ui/Card';

const kpis = [
  {
    value: '50',
    unit: 'zone BG',
    label: 'Zone industriali mappate',
    note: 'scalabile a tutta Italia',
  },
  {
    value: '-35%',
    unit: 'stimato',
    label: 'Tempo prospecting',
    note: 'verificabile con survey sales pre/post MVP',
  },
  {
    value: '5+',
    unit: 'reparti',
    label: 'Reparti connessi',
    note: 'commerciale, tecnico, mgmt, software, marketing',
  },
  {
    value: '∞',
    unit: 'scalabilità',
    label: 'Espansione geografica',
    note: 'da provincia BG a Nord Italia e oltre',
  },
];

export const KpiPanel = () => (
  <Card className="p-5">
    <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">
      BSSC-2026 — Criteri di misura
    </p>
    <h2 className="mt-1 text-2xl font-black text-slate-950">KPI di progetto</h2>
    <div className="mt-5 grid gap-3 grid-cols-2 xl:grid-cols-4">
      {kpis.map(({ value, unit, label, note }) => (
        <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-4xl font-black text-brofind-red leading-none">{value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{unit}</p>
          <p className="mt-2 font-semibold text-slate-950 text-sm">{label}</p>
          <p className="mt-1 text-xs text-slate-500 leading-5">{note}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs leading-6 text-slate-500 border-t border-slate-100 pt-3">
      KPI verificabili post-MVP con dati CRM: offerte generate da lead FindYou, conversion rate,
      impianti installati, emissioni abbattute stimate per settore ATECO (fonte ISPRA).
    </p>
  </Card>
);
