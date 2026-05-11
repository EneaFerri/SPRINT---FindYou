import { useMemo, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { MetricsCards } from './components/dashboard/MetricsCards';
import { FiltersPanel } from './components/dashboard/FiltersPanel';
import { HotspotList } from './components/dashboard/HotspotList';
import { HotspotDetailCard } from './components/dashboard/HotspotDetailCard';
import { BrofindValuePanel } from './components/dashboard/BrofindValuePanel';
import { KpiPanel } from './components/dashboard/KpiPanel';
import { FutureRoadmapPanel } from './components/dashboard/FutureRoadmapPanel';
import { HotspotMap } from './components/map/HotspotMap';
import { Modal } from '../../components/ui/Modal';
import { bergamoHotspotsMock } from './data/hotspots.mock';
import realHotspotsRaw from './data/bergamo_hotspots_real.json';
import { defaultFilters, filterHotspots } from './services/hotspotFilters';
import { enrichHotspotScores } from './services/scoringEngine';
import { exportHotspotsToCsv } from './services/csvExport';
import type { Hotspot, HotspotFilters } from './types/hotspot';

type DataSource = 'mock' | 'real';

const realHotspots = realHotspotsRaw as unknown as Hotspot[];

export const RicercaClientiModule = () => {
  const [dataSource, setDataSource] = useState<DataSource>('mock');

  const allHotspots = useMemo(
    () => enrichHotspotScores(dataSource === 'real' ? realHotspots : bergamoHotspotsMock),
    [dataSource],
  );

  const [filters, setFilters] = useState<HotspotFilters>(defaultFilters);
  const filteredHotspots = useMemo(
    () => filterHotspots(allHotspots, filters),
    [allHotspots, filters],
  );

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | undefined>(undefined);
  const [proposalOpen, setProposalOpen] = useState(false);

  const selectedHotspot =
    filteredHotspots.find((h) => h.id === selectedHotspotId) ?? filteredHotspots[0];

  const selectHotspot = (hotspot: Hotspot) => setSelectedHotspotId(hotspot.id);

  const handleToggleDataSource = () => {
    setDataSource((prev) => (prev === 'mock' ? 'real' : 'mock'));
    setSelectedHotspotId(undefined);
    setFilters(defaultFilters);
  };

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
            <FiltersPanel
              hotspots={allHotspots}
              filters={filters}
              onChange={setFilters}
              dataSource={dataSource}
              onToggleDataSource={handleToggleDataSource}
            />
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
        <KpiPanel />
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
