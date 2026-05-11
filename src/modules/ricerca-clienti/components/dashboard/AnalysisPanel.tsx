import { Loader2, ScanSearch } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';

const ZONES = [
  { value: 'bergamo', label: 'Bergamo (BG)', active: true },
  { value: 'milano',  label: 'Milano (MI) — MVP', active: false },
  { value: 'brescia', label: 'Brescia (BS) — MVP', active: false },
  { value: 'torino',  label: 'Torino (TO) — MVP', active: false },
];

export const AnalysisPanel = ({
  onAnalyze,
  analysisRunning,
}: {
  onAnalyze: () => void;
  analysisRunning: boolean;
}) => (
  <Card className="p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">
          Analisi territorio
        </p>
        <h2 className="mt-0.5 text-xl font-black text-slate-950">
          Esplora zone industriali
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Seleziona una zona e avvia l'analisi per identificare hotspot industriali con il motore
          FindYou.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <select
          disabled={analysisRunning}
          defaultValue="bergamo"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-brofind-blue focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
        >
          {ZONES.map(({ value, label, active }) => (
            <option key={value} value={value} disabled={!active}>
              {label}
            </option>
          ))}
        </select>

        <Button
          variant="primary"
          onClick={onAnalyze}
          disabled={analysisRunning}
          className="shrink-0"
        >
          {analysisRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ScanSearch className="h-4 w-4" />
          )}
          {analysisRunning ? 'Analisi in corso...' : 'Avvia analisi'}
        </Button>
      </div>
    </div>
  </Card>
);
