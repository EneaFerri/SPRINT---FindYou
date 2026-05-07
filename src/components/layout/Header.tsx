import { Factory, Leaf, Radar, UsersRound } from 'lucide-react';

export const Header = () => (
  <header className="relative overflow-hidden border-b border-slate-200 bg-white">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brofind-red via-brofind-blue to-brofind-cyan" />
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[1fr_auto] lg:px-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brofind-red ring-1 ring-red-100">
            <Radar className="h-4 w-4" />
            Demo Challenge - Bergamo
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brofind-blue ring-1 ring-blue-100">
            <Leaf className="h-4 w-4" />
            Green industrial intelligence
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
          BROFIND <span className="text-brofind-red">— Find You</span>
        </h1>
        <p className="mt-2 text-lg font-semibold text-brofind-blue">
          Industrial Hotspot Intelligence Platform
        </p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Da una mappa a una lista di prospect ambientali qualificati. Una demo locale per
          trasformare aree industriali, segnali tecnici e priorita commerciali in un linguaggio
          comune tra sales, engineering e management.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 self-end rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
        {[
          ['Sales', 'prospecting mirato', UsersRound],
          ['Tecnico', 'contesto prima del contatto', Factory],
          ['Green', 'diffusione abbattimento emissioni', Leaf],
        ].map(([title, body, Icon]) => (
          <div key={title as string} className="min-w-0 rounded-lg bg-white p-3 shadow-sm">
            <Icon className="mb-2 h-5 w-5 text-brofind-red" />
            <p className="text-sm font-bold text-slate-950">{title as string}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{body as string}</p>
          </div>
        ))}
      </div>
    </div>
  </header>
);
