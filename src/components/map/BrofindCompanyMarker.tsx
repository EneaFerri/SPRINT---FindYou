import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { Building2, MapPin } from 'lucide-react';
import { brofindCompanyLocation } from '../../config/mapConfig';

const brofindIcon = L.divIcon({
  className: '',
  html: `
    <div class="brofind-map-label">
      <div class="brofind-map-pin"></div>
      <div class="brofind-map-wordmark">BROFIND</div>
    </div>
  `,
  iconSize: [150, 58],
  iconAnchor: [20, 50],
  popupAnchor: [48, -42],
});

export const BrofindCompanyMarker = () => (
  <Marker icon={brofindIcon} position={brofindCompanyLocation.coordinates}>
    <Popup>
      <div className="w-64">
        <div className="mb-2 flex items-center gap-2 text-brofind-red">
          <Building2 className="h-5 w-5" />
          <h3 className="text-base font-black">BROFIND</h3>
        </div>
        <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
          <MapPin className="h-4 w-4 text-brofind-blue" />
          {brofindCompanyLocation.address}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          Riferimento aziendale del progetto Find You: da qui la piattaforma aiuta sales, tecnico e
          management a leggere il territorio industriale.
        </p>
      </div>
    </Popup>
  </Marker>
);
