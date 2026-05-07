export const MapLegend = () => (
  <div className="absolute bottom-4 left-4 z-[900] rounded-lg bg-white/95 p-3 shadow-lg ring-1 ring-slate-200 backdrop-blur">
    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Priorita hotspot</p>
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-brofind-red" />
        Alta - azione commerciale rapida
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-brofind-amber" />
        Media - qualifica mirata
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-brofind-blue" />
        Bassa - monitoraggio
      </div>
    </div>
  </div>
);
