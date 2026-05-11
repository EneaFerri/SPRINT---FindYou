import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { Badge } from '../../../../components/ui/Badge';
import type { Hotspot, PriorityLevel } from '../../types/hotspot';

const markerColor: Record<PriorityLevel, string> = {
  high: '#c9152f',
  medium: '#f59e0b',
  low: '#0b4f8a',
};

const markerIcon = (priority: PriorityLevel, selected: boolean) =>
  L.divIcon({
    className: '',
    html: `<div class="hotspot-pin ${selected ? 'hotspot-pin-selected' : ''}" style="--pin:${markerColor[priority]}"><span>${selected ? '✓' : ''}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });

export const HotspotMarker = ({
  hotspot,
  selected,
  onSelect,
}: {
  hotspot: Hotspot;
  selected: boolean;
  onSelect: (hotspot: Hotspot) => void;
}) => (
  <Marker
    icon={markerIcon(hotspot.priority, selected)}
    position={[hotspot.latitude, hotspot.longitude]}
    eventHandlers={{ click: () => onSelect(hotspot) }}
  >
    <Popup>
      <div className="w-64">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-950">{hotspot.name}</h3>
          <Badge priority={hotspot.priority}>{hotspot.priority}</Badge>
        </div>
        <p className="text-xs text-slate-600">{hotspot.municipality}</p>
        <p className="mt-2 text-xs leading-5 text-slate-700">{hotspot.scoreReason}</p>
        <div className="mt-3 rounded-lg bg-slate-50 p-2">
          <span className="text-xs font-semibold text-slate-500">Brofind Lead Score</span>
          <p className="text-xl font-black text-brofind-red">{hotspot.score}/100</p>
        </div>
      </div>
    </Popup>
  </Marker>
);
