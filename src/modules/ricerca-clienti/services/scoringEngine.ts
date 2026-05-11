import { defaultScoringWeights } from '../config/scoringWeights';
import { atecoRiskMock } from '../data/atecoRisk.mock';
import type { Hotspot } from '../types/hotspot';
import type { ScoreBreakdown, ScoreInput, ScoringWeights } from '../types/scoring';

const normalizeSiteSize = (sqm: number) => Math.min(100, Math.round((sqm / 90000) * 100));

const normalizeEmissions = (emissions: string[]) => Math.min(100, emissions.length * 22);

const abatementGapScore = (status: ScoreInput['knownAbatementPlant']) => {
  if (status === 'no') return 100;
  if (status === 'non verificato') return 72;
  return 20;
};

export const calculateBrofindScore = (
  input: ScoreInput,
  weights: ScoringWeights = defaultScoringWeights,
): ScoreBreakdown => {
  const sectorRisk = input.sectorRisk;
  const siteSize = normalizeSiteSize(input.estimatedSizeSqm);
  const potentialEmissions = normalizeEmissions(input.potentialEmissions);
  const missingAbatement = abatementGapScore(input.knownAbatementPlant);
  const strategicDensity = input.strategicDensity;

  const total = Math.round(
    sectorRisk * weights.sectorRisk +
      siteSize * weights.siteSize +
      potentialEmissions * weights.potentialEmissions +
      missingAbatement * weights.missingAbatement +
      strategicDensity * weights.strategicDensity,
  );

  return {
    total: Math.max(0, Math.min(100, total)),
    sectorRisk,
    siteSize,
    potentialEmissions,
    missingAbatement,
    strategicDensity,
  };
};

export const inferPriority = (score: number): Hotspot['priority'] => {
  if (score >= 75) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
};

export const enrichHotspotScores = (hotspots: Hotspot[]): Hotspot[] =>
  hotspots
    .map((hotspot) => {
      const atecoEntry = atecoRiskMock.find((e) => e.code === hotspot.atecoCode);
      const enriched = atecoEntry ? { ...hotspot, sectorRisk: atecoEntry.risk } : hotspot;
      const score = calculateBrofindScore(enriched).total;
      return {
        ...enriched,
        score,
        priority: inferPriority(score),
      };
    })
    .sort((a, b) => b.score - a.score);
