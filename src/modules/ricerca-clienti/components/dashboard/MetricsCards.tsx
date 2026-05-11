import { Building2, Factory, MapPinned, Percent, Ruler } from 'lucide-react';
import { Stat } from '../../../../components/ui/Stat';
import type { Hotspot } from '../../types/hotspot';

const formatSqm = (sqm: number) => `${Math.round(sqm / 1000).toLocaleString('it-IT')}k m²`;

export const MetricsCards = ({ hotspots }: { hotspots: Hotspot[] }) => {
  const total = hotspots.length;
  const high = hotspots.filter((hotspot) => hotspot.priority === 'high').length;
  const totalSize = hotspots.reduce((sum, hotspot) => sum + hotspot.estimatedSizeSqm, 0);
  const municipalities = new Set(hotspots.map((hotspot) => hotspot.municipality)).size;
  const atecoSimulated = Math.round(
    (hotspots.filter((hotspot) => hotspot.atecoCode !== 'non ancora verificato').length /
      Math.max(1, total)) *
      100,
  );

  const items = [
    { label: 'Hotspot filtrati', value: total, helper: 'lead candidate visibili', Icon: MapPinned },
    { label: 'Alta priorita', value: high, helper: 'score >= 75', Icon: Factory },
    { label: 'Superficie stimata', value: formatSqm(totalSize), helper: 'mock industrial footprint', Icon: Ruler },
    { label: 'Comuni coperti', value: municipalities, helper: 'Bergamo e provincia', Icon: Building2 },
    { label: 'ATECO simulato', value: `${atecoSimulated}%`, helper: 'dato demo, non ufficiale', Icon: Percent },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map(({ label, value, helper, Icon }) => (
        <div key={label} className="relative">
          <Icon className="absolute right-4 top-4 h-5 w-5 text-brofind-red/70" />
          <Stat label={label} value={value} helper={helper} />
        </div>
      ))}
    </div>
  );
};
