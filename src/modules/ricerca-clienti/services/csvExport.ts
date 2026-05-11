import type { Hotspot } from '../types/hotspot';

const csvEscape = (value: string | number) => {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

export const exportHotspotsToCsv = (hotspots: Hotspot[]) => {
  const headers = [
    'id',
    'comune',
    'azienda',
    'ATECO',
    'score',
    'priorita',
    'emissioni_potenziali',
    'dimensione_stimata_mq',
    'prossima_azione',
  ];

  const rows = hotspots.map((hotspot) => [
    hotspot.id,
    hotspot.municipality,
    hotspot.mockCompany,
    hotspot.atecoCode,
    hotspot.score,
    hotspot.priority,
    hotspot.potentialEmissions.join(', '),
    hotspot.estimatedSizeSqm,
    hotspot.suggestedSalesAction,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `brofind-find-you-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
