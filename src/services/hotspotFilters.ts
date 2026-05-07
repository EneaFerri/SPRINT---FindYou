import type { Hotspot, HotspotFilters } from '../types/hotspot';

export const defaultFilters: HotspotFilters = {
  municipality: 'all',
  priority: 'all',
  minScore: 0,
  emission: 'all',
  ateco: 'all',
  abatementStatus: 'all',
};

export const filterHotspots = (hotspots: Hotspot[], filters: HotspotFilters): Hotspot[] =>
  hotspots.filter((hotspot) => {
    const municipalityMatch =
      filters.municipality === 'all' || hotspot.municipality === filters.municipality;
    const priorityMatch = filters.priority === 'all' || hotspot.priority === filters.priority;
    const scoreMatch = hotspot.score >= filters.minScore;
    const emissionMatch =
      filters.emission === 'all' || hotspot.potentialEmissions.includes(filters.emission);
    const atecoMatch = filters.ateco === 'all' || hotspot.atecoCode === filters.ateco;
    const abatementMatch =
      filters.abatementStatus === 'all' ||
      hotspot.knownAbatementPlant === filters.abatementStatus;

    return (
      municipalityMatch &&
      priorityMatch &&
      scoreMatch &&
      emissionMatch &&
      atecoMatch &&
      abatementMatch
    );
  });

export const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort();
