import { ArrowDownWideNarrow, MapPin } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Card } from '../../../../components/ui/Card';
import type { Hotspot } from '../../types/hotspot';

export const HotspotList = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
}: {
  hotspots: Hotspot[];
  selectedHotspot?: Hotspot;
  onSelectHotspot: (hotspot: Hotspot) => void;
}) => (
  <Card className="p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Lead radar</p>
        <h2 className="text-lg font-black text-slate-950">Hotspot ordinati per score</h2>
      </div>
      <ArrowDownWideNarrow className="h-5 w-5 text-brofind-red" />
    </div>
    <div className="space-y-2">
      {hotspots.map((hotspot) => {
        const selected = selectedHotspot?.id === hotspot.id;
        return (
          <button
            key={hotspot.id}
            onClick={() => onSelectHotspot(hotspot)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              selected
                ? 'border-brofind-red bg-red-50'
                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">{hotspot.name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {hotspot.municipality} · {hotspot.areaType}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-brofind-red">{hotspot.score}</p>
                <Badge priority={hotspot.priority}>{hotspot.priority}</Badge>
              </div>
            </div>
          </button>
        );
      })}
      {hotspots.length === 0 ? (
        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          Nessun hotspot con questi filtri. Abbassa la soglia score o amplia il comune.
        </div>
      ) : null}
    </div>
  </Card>
);
