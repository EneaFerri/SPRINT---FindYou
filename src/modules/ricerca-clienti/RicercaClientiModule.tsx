import { useMemo, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { MetricsCards } from './components/dashboard/MetricsCards';
import { FiltersPanel } from './components/dashboard/FiltersPanel';
import { HotspotList } from './components/dashboard/HotspotList';
import { HotspotDetailCard } from './components/dashboard/HotspotDetailCard';
import { BrofindValuePanel } from './components/dashboard/BrofindValuePanel';
import { FutureRoadmapPanel } from './components/dashboard/FutureRoadmapPanel';
import { HotspotMap } from './components/map/HotspotMap';
import { Modal } from '../../components/ui/Modal';
import { bergamoHotspotsMock } from './data/hotspots.mock';
import { defaultFilters, filterHotspots } from './services/hotspotFilters';
import { enrichHotspotScores } from './services/scoringEngine';
import { exportHotspotsToCsv } from './services/csvExport';
import type { Hotspot, HotspotFilters } from './types/hotspot';

export const RicercaClientiModule = () => {
  const allHotspots = useMemo(() => enrichHotspotScores(bergamoHotspotsMock), []);
  const [filters, setFilters] = useState<HotspotFilters>(defaultFilters);
  const filteredHotspots = useMemo(
    () => filterHotspots(allHotspots, filters),
    [allHotspots, filters],
  );
  const [selectedHotspotId, setSelectedHotspotId] = useState(allHotspots[0]?.id);
  const [proposalOpen, setProposalOpen] = useState(false);

  const selectedHotspot =
    filteredHotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? filteredHotspots[0];

  const selectHotspot = (hotspot: Hotspot) => setSelectedHotspotId(hotspot.id);

  return (
    <>
      <div className="space-y-5">
        <MetricsCards hotspots={filteredHotspots} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
          <HotspotMap
            hotspots={filteredHotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={selectHotspot}
          />
          <Sidebar>
            <FiltersPanel hotspots={allHotspots} filters={filters} onChange={setFilters} />
            <HotspotDetailCard
              hotspot={selectedHotspot}
              onExport={() => exportHotspotsToCsv(filteredHotspots)}
              onProposal={() => setProposalOpen(true)}
            />
            <HotspotList
              hotspots={filteredHotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={selectHotspot}
            />
          </Sidebar>
        </div>
        <BrofindValuePanel />
        <FutureRoadmapPanel />
      </div>
      <Modal
        open={proposalOpen}
        title="Genera Bozza Offerta - funzione futura"
        onClose={() => setProposalOpen(false)}
      >
        Funzione prevista in fase futura: generazione semi-automatica di una proposta
        RTO/VOC/Scrubber basata su settore, dimensione sito, emissioni potenziali e dati aziendali
        verificati. In questa demo non vengono chiamati servizi AI, LLM, API esterne o dati
        sensibili.
      </Modal>
    </>
  );
};
