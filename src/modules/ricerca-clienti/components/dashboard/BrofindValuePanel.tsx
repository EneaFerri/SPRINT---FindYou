import { Leaf, LineChart, Link2, UsersRound } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';

const pillars = [
  {
    title: 'Sostenibilità ambientale',
    tag: 'Impatto diretto',
    body: 'Ogni impianto RTO/VOC installato toglie solventi e COV dall\'aria. FindYou accelera il commerciale: più lead qualificati → più offerte → più impianti installati. KPI: emissioni potenzialmente abbattute per zona, stimate da settore ATECO e dimensione sito.',
    Icon: Leaf,
    accent: 'border-emerald-200 bg-emerald-50',
    iconColor: 'text-emerald-600',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Benessere dei dipendenti',
    tag: 'Persone al centro',
    body: 'Elimina le ore di prospecting ripetitivo e non strutturato. Il sales lavora su lead concreti e già qualificati. Il tecnico entra prima nel processo con dati organizzati. Risultato: lavoro più interattivo, più coinvolgente, meno dispersivo e frustrante.',
    Icon: UsersRound,
    accent: 'border-blue-200 bg-blue-50',
    iconColor: 'text-brofind-blue',
    tagColor: 'bg-blue-100 text-brofind-blue',
  },
  {
    title: 'ROI economico misurabile',
    tag: 'Efficienza pipeline',
    body: 'Pipeline più rapida, meno ore su lead a bassa probabilità. Offerte più mirate perché basate su dati reali di settore e dimensione. KPI verificabili con dati CRM: tasso di conversione lead → offerta → ordine, costo per lead qualificato.',
    Icon: LineChart,
    accent: 'border-amber-200 bg-amber-50',
    iconColor: 'text-amber-600',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Comunicazione tra reparti',
    tag: 'Linguaggio comune',
    body: 'Commerciale, Engineering, Management, Software e Marketing parlano sulla stessa base dati. Zero email di allineamento pre-visita. La scheda lead integra già contesto tecnico e azione sales: il passaggio di informazioni è strutturato, non informale.',
    Icon: Link2,
    accent: 'border-red-200 bg-red-50',
    iconColor: 'text-brofind-red',
    tagColor: 'bg-red-100 text-brofind-red',
  },
];

export const BrofindValuePanel = () => (
  <Card className="p-5">
    <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">
      Brofind Sustainability Sprint Challenge — Impatto ESG
    </p>
    <h2 className="mt-1 text-2xl font-black text-slate-950">
      Find You non sostituisce le persone: le aiuta a lavorare meglio.
    </h2>
    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
      La piattaforma mette in relazione territorio, opportunità commerciale e ipotesi tecnica.
      Il risultato è meno lavoro dispersivo, più comunicazione interna e priorità condivise su
      iniziative con valore ambientale diretto.
    </p>
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {pillars.map(({ title, tag, body, Icon, accent, iconColor, tagColor }) => (
        <div key={title} className={`rounded-lg border p-4 ${accent}`}>
          <div className="mb-3 flex items-start justify-between gap-2">
            <Icon className={`h-5 w-5 flex-none mt-0.5 ${iconColor}`} />
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tagColor}`}>{tag}</span>
          </div>
          <h3 className="font-bold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
        </div>
      ))}
    </div>
  </Card>
);
