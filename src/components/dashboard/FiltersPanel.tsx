import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { AbatementStatus, Hotspot, HotspotFilters, PriorityLevel } from '../../types/hotspot';
import { defaultFilters, uniqueSorted } from '../../services/hotspotFilters';

export const FiltersPanel = ({
  hotspots,
  filters,
  onChange,
}: {
  hotspots: Hotspot[];
  filters: HotspotFilters;
  onChange: (filters: HotspotFilters) => void;
}) => {
  const municipalities = uniqueSorted(hotspots.map((hotspot) => hotspot.municipality));
  const emissions = uniqueSorted(hotspots.flatMap((hotspot) => hotspot.potentialEmissions));
  const atecoCodes = uniqueSorted(hotspots.map((hotspot) => hotspot.atecoCode));

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Filtri demo</p>
          <h2 className="text-lg font-black text-slate-950">Qualifica territorio</h2>
        </div>
        <Filter className="h-5 w-5 text-brofind-red" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Select
          label="Comune"
          value={filters.municipality}
          onChange={(municipality) => onChange({ ...filters, municipality })}
          options={[['all', 'Tutti i comuni'], ...municipalities.map((value) => [value, value])]}
        />
        <Select
          label="Priorita"
          value={filters.priority}
          onChange={(priority) => onChange({ ...filters, priority: priority as PriorityLevel | 'all' })}
          options={[
            ['all', 'Tutte'],
            ['high', 'Alta'],
            ['medium', 'Media'],
            ['low', 'Bassa'],
          ]}
        />
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Score minimo: {filters.minScore}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(event) => onChange({ ...filters, minScore: Number(event.target.value) })}
            className="mt-2 w-full accent-brofind-red"
          />
        </div>
        <Select
          label="Emissione potenziale"
          value={filters.emission}
          onChange={(emission) => onChange({ ...filters, emission })}
          options={[['all', 'Tutte'], ...emissions.map((value) => [value, value])]}
        />
        <Select
          label="ATECO / settore"
          value={filters.ateco}
          onChange={(ateco) => onChange({ ...filters, ateco })}
          options={[['all', 'Tutti'], ...atecoCodes.map((value) => [value, value])]}
        />
        <Select
          label="Impianto abbattimento"
          value={filters.abatementStatus}
          onChange={(abatementStatus) =>
            onChange({ ...filters, abatementStatus: abatementStatus as AbatementStatus | 'all' })
          }
          options={[
            ['all', 'Tutti'],
            ['si', 'Si'],
            ['no', 'No'],
            ['non verificato', 'Non verificato'],
          ]}
        />
      </div>
      <Button variant="ghost" className="mt-4 w-full" onClick={() => onChange(defaultFilters)}>
        <RotateCcw className="h-4 w-4" />
        Reset filtri
      </Button>
    </Card>
  );
};

const Select = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-brofind-blue focus:ring-2 focus:ring-blue-100"
    >
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </label>
);
