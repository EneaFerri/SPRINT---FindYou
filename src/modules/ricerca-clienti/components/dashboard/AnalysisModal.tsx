import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

const STEPS = [
  'Connessione Overpass API — Bergamo bbox: 45.40/9.40 → 45.92/10.10',
  '834 edifici industriali rilevati — avvio clustering (raggio 400 m)',
  '219 cluster identificati — campionamento stratificato 40/40/20%',
  'Geocoding comuni: 42 / 42 via Nominatim (zoom 12)',
  'Calcolo Brofind Lead Score — 28 codici ATECO applicati',
  'Analisi completata — 50 hotspot pronti',
];

const SUMMARY = [
  '50 hotspot industriali identificati',
  '42 comuni nella provincia di Bergamo',
  '28 codici ATECO — Brofind Lead Score calcolato',
];

export const AnalysisModal = ({
  open,
  currentStep,
  onComplete,
}: {
  open: boolean;
  currentStep: number;
  onComplete: () => void;
}) => {
  if (!open) return null;

  const done = currentStep >= STEPS.length;
  const progress = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          {done ? (
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
          ) : (
            <Loader2 className="h-6 w-6 shrink-0 animate-spin text-brofind-red" />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">
              FindYou Engine
            </p>
            <h2 className="text-lg font-black text-slate-950">
              {done ? 'Analisi completata' : 'Analisi territorio in corso...'}
            </h2>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brofind-red transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps or summary */}
        {done ? (
          <ul className="mb-6 space-y-2">
            {SUMMARY.map((line) => (
              <li key={line} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mb-6 space-y-2.5">
            {STEPS.map((text, i) => {
              const stepNum = i + 1;
              const isDone = currentStep > stepNum - 1 && currentStep >= stepNum;
              const isRunning = currentStep === stepNum - 1 && !done;
              return (
                <li key={text} className="flex items-start gap-2.5 text-sm">
                  {isDone ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  ) : isRunning ? (
                    <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-brofind-blue" />
                  ) : (
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-slate-300">
                      ○
                    </span>
                  )}
                  <span
                    className={
                      isDone
                        ? 'text-slate-700'
                        : isRunning
                          ? 'font-semibold text-slate-950'
                          : 'text-slate-400'
                    }
                  >
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer */}
        {done && (
          <div className="flex justify-end">
            <Button variant="primary" onClick={onComplete}>
              Vedi risultati →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
