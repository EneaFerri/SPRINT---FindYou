import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import type { AbatementStatus, Hotspot, HotspotFilters, PriorityLevel } from '../../types/hotspot';
import { defaultFilters, uniqueSorted } from '../../services/hotspotFilters';

type DataSource = 'mock' | 'real';

export const FiltersPanel = ({
  hotspots,
  filters,
  onChange,
  dataSource,
  onToggleDataSource,
}: {
  hotspots: Hotspot[];
  filters: HotspotFilters;
  onChange: (filters: HotspotFilters) => void;
  dataSource: DataSource;
  onToggleDataSource: () => void;
}) => {
  const municipalities = uniqueSorted(hotspots.map((h) => h.municipality));
  const emissions = uniqueSorted(hotspots.flatMap((h) => h.potentialEmissions));
  const atecoCodes = uniqueSorted(hotspots.map((h) => h.atecoCode));

  const isReal = dataSource === 'real';

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Filtri</p>
          <h2 className="text-lg font-black text-slate-950">Qualifica territorio</h2>
        </div>
        <Filter className="h-5 w-5 text-brofind-red" />
      </div>

      {/* Data source toggle */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
              isReal
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isReal ? 'Fonte: OSM Reale' : 'Fonte: Demo Mock'}
          </span>
        </div>
        <button
          onClick={onToggleDataSource}
          className="rounded-md px-2.5 py-1 text-xs font-bold transition hover:bg-white hover:shadow-sm"
          style={{ color: isReal ? '#059669' : '#475569' }}
        >
          {isReal ? 'Usa Mock' : 'Usa Dati Reali'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Select
          label="Comune"
          value={filters.municipality}
          onChange={(municipality) => onChange({ ...filters, municipality })}
          options={[['all', 'Tutti i comuni'], ...municipalities.map((v) => [v, v])]}
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
            onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
            className="mt-2 w-full accent-brofind-red"
          />
        </div>
        <Select
          label="Emissione potenziale"
          value={filters.emission}
          onChange={(emission) => onChange({ ...filters, emission })}
          options={[['all', 'Tutte'], ...emissions.map((v) => [v, v])]}
        />
        <Select
          label="ATECO / settore"
          value={filters.ateco}
          onChange={(ateco) => onChange({ ...filters, ateco })}
          options={[['all', 'Tutti'], ...atecoCodes.map((v) => [v, v])]}
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
      onChange={(e) => onChange(e.target.value)}
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
