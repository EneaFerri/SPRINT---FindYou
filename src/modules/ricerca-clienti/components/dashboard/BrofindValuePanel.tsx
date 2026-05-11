import { Leaf, LineChart, Network, UsersRound, Wrench, Zap } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';

const benefits = [
  {
    title: 'Sales piu rapido',
    body: "Riduce tempo di prospecting e porta subito l'attenzione su zone e aziende candidate.",
    Icon: Zap,
  },
  {
    title: 'Tecnico prima nel processo',
    body: 'Organizza contesto preliminare: settore, emissioni plausibili, dimensione e impianti noti.',
    Icon: Wrench,
  },
  {
    title: 'Linguaggio comune',
    body: 'Crea una base condivisa tra commerciale, engineering e management per decidere priorita.',
    Icon: UsersRound,
  },
  {
    title: 'Pipeline data-driven',
    body: 'Rende piu chiaro il passaggio da opportunita territoriale a possibile soluzione ambientale.',
    Icon: LineChart,
  },
  {
    title: 'Contributo dei colleghi',
    body: 'Permette di aggiungere fonti dati, regole di scoring e conoscenza di settore.',
    Icon: Network,
  },
  {
    title: 'Impatto green concreto',
    body: 'Aiuta a diffondere impianti di abbattimento emissioni dove il bisogno puo essere reale.',
    Icon: Leaf,
  },
];

export const BrofindValuePanel = () => (
  <Card className="p-5">
    <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">
      Perche e utile per Brofind
    </p>
    <h2 className="mt-1 text-2xl font-black text-slate-950">
      Find You non sostituisce le persone: le aiuta a lavorare meglio.
    </h2>
    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
      La demo mette in relazione territorio, opportunita commerciale e ipotesi tecnica. Il risultato
      e meno lavoro dispersivo, piu comunicazione interna e priorita condivise su iniziative con
      valore ambientale.
    </p>
    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {benefits.map(({ title, body, Icon }) => (
        <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <Icon className="mb-3 h-5 w-5 text-brofind-red" />
          <h3 className="font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
        </div>
      ))}
    </div>
  </Card>
);
