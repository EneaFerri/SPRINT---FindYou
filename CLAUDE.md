# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start dev server (accessible on LAN)
npm run dev         # → http://localhost:5173

# Type-check + production build
npm run build

# Preview production build
npm run preview
```

**Optional Python backend:**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # → http://localhost:8000
```

There is no test suite. Type safety is enforced by `tsc` (run implicitly via `npm run build`).

## Architecture

**React 18 + TypeScript + Vite** SPA styled with Tailwind CSS. The frontend is fully self-contained — the backend (`backend/`) is a FastAPI skeleton not used by the running demo.

### Multi-module routing

`App.tsx` holds a `currentModule: ModuleId` state. On `'landing'` it renders `LandingPage`; on any other value it renders `AppShell` wrapping the corresponding module component. No routing library is used.

```
src/
  App.tsx                      ← state-based router; exports ModuleId type
  pages/LandingPage.tsx        ← 3-card module selector; imports ModuleId from App.tsx
  modules/
    ricerca-clienti/           ← active module (hotspot map + lead scoring)
      RicercaClientiModule.tsx ← owns all state (filters, selectedHotspot, dataSource, proposalOpen)
      components/
        dashboard/             ← MetricsCards, FiltersPanel, HotspotList, HotspotDetailCard,
        map/                      BrofindValuePanel, KpiPanel, FutureRoadmapPanel, HotspotMap, markers
      data/                    ← hotspots.mock.ts (28 mock), atecoRisk.mock.ts (28 codici),
                                  bergamo_hotspots_real.json (50 hotspot OSM reali)
      services/                ← scoringEngine.ts, csvExport.ts, hotspotFilters.ts,
                                  futureIntegrations/ (placeholder stubs)
      types/                   ← hotspot.ts (Hotspot, HotspotFilters), scoring.ts
      config/                  ← scoringWeights.ts, mapConfig.ts
    ricerca-fornitori/         ← WIP module
    consulenza-personale/      ← WIP module
  components/
    layout/                    ← AppShell (wraps Header + <main>), Header (back button + logos),
                                  Sidebar (scrollable right column)
    ui/                        ← Card, Button, Badge, Modal, Stat — shared across all modules
presentation/
  index.html                   ← presentazione PDF 9 pagine per BSSC-2026 (Chrome → Cmd+P → A4)
backend/
  data_extraction/             ← pipeline OSM offline: run_extraction.py, overpass_client.py,
                                  footprint_analyzer.py, hotspot_builder.py, ateco_mapper.py
```

**Adding a new module:** create `src/modules/<name>/`, add a card object to the `modules` array in `LandingPage.tsx`, add a case in `App.tsx`.

### Data flow (Ricerca Clienti)

```
hotspots.mock.ts          ┐
                          ├→  enrichHotspotScores()  →  RicercaClientiModule state  →  components
bergamo_hotspots_real.json┘   scoringEngine.ts
                              (uses atecoRiskMock as single source of truth for sectorRisk)
```

`RicercaClientiModule.tsx` is the only stateful component. It holds a `dataSource: 'mock' | 'real'` toggle that switches between the two datasets. `filteredHotspots` is derived via `useMemo`. No global state library is used.

**ATECO coverage:** `atecoRisk.mock.ts` contains 28 codes ordered by risk (95→38), plus `'non ancora verificato'`. `enrichHotspotScores` looks up each hotspot's `atecoCode` in this table and overrides `sectorRisk` with the table value — making `atecoRisk.mock.ts` the single source of truth. The filter dropdown in `FiltersPanel` is populated dynamically from `hotspot.atecoCode` values present in the loaded dataset.

### Scoring engine

`enrichHotspotScores` in `src/modules/ricerca-clienti/services/scoringEngine.ts` re-computes the Brofind Lead Score at module mount. `calculateBrofindScore` combines five normalised sub-scores with weights from `src/modules/ricerca-clienti/config/scoringWeights.ts`:

| Factor | Weight |
|---|---|
| Sector risk (ATECO) | 35% |
| Site size | 20% |
| Potential emissions count | 20% |
| Missing/unverified abatement plant | 15% |
| Strategic density | 10% |

Score thresholds: ≥ 75 → `high`, ≥ 55 → `medium`, < 55 → `low`.

### Shared UI notes

`Badge.tsx` defines `PriorityLevel` locally (`'high' | 'medium' | 'low'`) so it has no dependency on module-specific types. All other `src/components/ui/` primitives are fully generic.

### Backend skeleton (`backend/`)

FastAPI app with a `/api/hotspots` router and a scoring service that mirrors the frontend logic. CORS is pre-configured for `localhost:5173`. Intended to be replaced with a real PostgreSQL + PostGIS data source in the MVP phase.

## Constraints

- No external APIs, API keys, AI/LLM calls, or personal data at runtime — this is a sales demo
- Map tiles come from OpenStreetMap via Leaflet (no Google Maps)
- Mock hotspot data must stay clearly labelled as such
- Real OSM data (`bergamo_hotspots_real.json`) was generated offline via `backend/data_extraction/`; Overpass/Nominatim were called only during extraction, not at runtime
- `ateco_mapper.py` risk values must stay in sync with `atecoRisk.mock.ts`
