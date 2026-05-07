export interface OsmIndustrialAreaCandidate {
  osmId: string;
  name?: string;
  geometry: unknown;
  tags: Record<string, string>;
}

export const fetchOsmIndustrialAreas = async (): Promise<OsmIndustrialAreaCandidate[]> => {
  throw new Error('Future adapter: connect authorized OpenStreetMap/Overpass ingestion here.');
};
