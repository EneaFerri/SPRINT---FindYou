import { ClipboardList, Download, FileText, Save, Wrench } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import type { Hotspot } from '../../types/hotspot';

export const HotspotDetailCard = ({
  hotspot,
  onExport,
  onProposal,
}: {
  hotspot?: Hotspot;
  onExport: () => void;
  onProposal: () => void;
}) => {
  if (!hotspot) {
    return (
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">Scheda hotspot</p>
        <h2 className="mt-1 text-lg font-black text-slate-950">Seleziona un marker o un lead</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          La scheda laterale mostra azienda mock, ATECO simulato, ragione dello score e azione
          consigliata per sales e tecnico.
        </p>
      </Card>
    );
  }

  const isRealOsm = hotspot.companyMatchStatus === 'reale-OSM';
  const isRealCciaa = hotspot.companyMatchStatus === 'reale-CCIAA';
  const isReal = isRealOsm || isRealCciaa;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brofind-blue">
            {isReal ? 'Scheda lead reale' : 'Scheda lead demo'}
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{hotspot.name}</h2>
          <p className="text-sm text-slate-500">{hotspot.municipality} · {hotspot.areaType}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-brofind-red">{hotspot.score}</p>
          <Badge priority={hotspot.priority}>{hotspot.priority}</Badge>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <div className={`rounded-lg p-3 ${isReal ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}>
          {isRealOsm ? (
            <>
              <p className="font-bold text-slate-950">Azienda da verificare — dati OSM</p>
              <p className="mt-1 text-slate-600">
                ATECO {hotspot.atecoCode}: {hotspot.atecoDescription}
              </p>
              <a
                href="https://www.infocamere.it"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                Cerca su Registro Imprese →
              </a>
            </>
          ) : isRealCciaa ? (
            <>
              <p className="font-bold text-slate-950">{hotspot.mockCompany}</p>
              <p className="mt-1 text-slate-600">
                ATECO {hotspot.atecoCode}: {hotspot.atecoDescription}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-slate-950">{hotspot.mockCompany}</p>
              <p className="mt-1 text-slate-600">
                ATECO {hotspot.atecoCode}: {hotspot.atecoDescription}
              </p>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Info label="Dimensione stimata" value={`${hotspot.estimatedSizeSqm.toLocaleString('it-IT')} m²`} />
          <Info label="Impianto noto" value={hotspot.knownAbatementPlant} />
          <Info
            label="Fonte dati"
            value={
              isRealOsm ? 'OpenStreetMap'
              : isRealCciaa ? 'Registro Imprese'
              : hotspot.companyMatchStatus
            }
          />
          <Info label="Settore rischio" value={`${hotspot.sectorRisk}/100`} />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Emissioni potenziali</p>
          <div className="flex flex-wrap gap-2">
            {hotspot.potentialEmissions.map((emission) => (
              <Badge key={emission} tone="blue">
                {emission}
              </Badge>
            ))}
          </div>
        </div>
        <Detail icon={<ClipboardList />} label="Motivo dello score" text={hotspot.scoreReason} />
        <Detail icon={<Save />} label="Prossima azione sales" text={hotspot.suggestedSalesAction} />
        <Detail icon={<Wrench />} label="Note per team tecnico" text={hotspot.technicalNotes} />
        <Detail icon={<FileText />} label="Valore collaborativo" text={hotspot.internalCollaborationValue} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button onClick={() => window.alert('Lead salvato nella demo locale. In MVP sara collegato al CRM o database.')}>
          <Save className="h-4 w-4" />
          Salva Lead
        </Button>
        <Button variant="ghost" onClick={onExport}>
          <Download className="h-4 w-4" />
          Esporta CSV
        </Button>
        <Button variant="secondary" onClick={onProposal} className="col-span-2">
          <FileText className="h-4 w-4" />
          Genera Bozza Offerta
        </Button>
        <Button
          variant="ghost"
          disabled
          className="col-span-2"
          title="Placeholder per scheda tecnica futura"
        >
          <Wrench className="h-4 w-4" />
          Apri Scheda Tecnica
        </Button>
      </div>
    </Card>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 font-bold text-slate-950">{value}</p>
  </div>
);

const Detail = ({
  icon,
  label,
  text,
}: {
  icon: React.ReactElement;
  label: string;
  text: string;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brofind-blue">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm leading-6 text-slate-600">{text}</p>
  </div>
);
