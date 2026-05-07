import { MapContainer, TileLayer } from 'react-leaflet';
import { bergamoMapConfig, tileProviders } from '../../config/mapConfig';
import type { Hotspot } from '../../types/hotspot';
import { HotspotMarker } from './HotspotMarker';
import { MapLegend } from './MapLegend';

export const HotspotMap = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
}: {
  hotspots: Hotspot[];
  selectedHotspot?: Hotspot;
  onSelectHotspot: (hotspot: Hotspot) => void;
}) => (
  <section className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:min-h-[720px]">
    <div className="absolute left-4 top-4 z-[900] max-w-md rounded-lg bg-white/95 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Bergamo GIS Demo</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">Industrial hotspot map</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Marker simulati su comuni industrialmente plausibili: click per trasformare territorio,
        settore e segnali emissivi in lead qualificabili.
      </p>
    </div>
    <MapContainer
      center={bergamoMapConfig.center}
      zoom={bergamoMapConfig.zoom}
      scrollWheelZoom
      className="h-[520px] w-full lg:h-[720px]"
      maxBounds={[
        [bergamoMapConfig.bounds.south, bergamoMapConfig.bounds.west],
        [bergamoMapConfig.bounds.north, bergamoMapConfig.bounds.east],
      ]}
    >
      <TileLayer
        attribution={tileProviders.openStreetMap.attribution}
        url={tileProviders.openStreetMap.url}
      />
      {hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          selected={selectedHotspot?.id === hotspot.id}
          onSelect={onSelectHotspot}
        />
      ))}
    </MapContainer>
    <MapLegend />
  </section>
);
