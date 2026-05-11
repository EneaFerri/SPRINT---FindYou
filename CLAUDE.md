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

This is a **React 18 + TypeScript + Vite** single-page application styled with Tailwind CSS. The frontend is fully self-contained — the backend (`backend/`) is a FastAPI skeleton predisposed for a future MVP and is not used by the running demo.

### Data flow

```
hotspots.mock.ts  →  enrichHotspotScores()  →  App state  →  components
                      scoringEngine.ts
```

`App.tsx` is the single stateful component. It holds `filters` and `selectedHotspotId`, derives `filteredHotspots` via `useMemo`, and passes slices down to leaf components as props. No global state library is used.

### Scoring engine (`src/services/scoringEngine.ts`)

`enrichHotspotScores` re-computes the Brofind Lead Score for every hotspot at app startup. `calculateBrofindScore` combines five normalised sub-scores with configurable weights from `src/config/scoringWeights.ts`:

| Factor | Weight |
|---|---|
| Sector risk (ATECO) | 35% |
| Site size | 20% |
| Potential emissions count | 20% |
| Missing/unverified abatement plant | 15% |
| Strategic density | 10% |

Score thresholds: ≥ 75 → `high`, ≥ 55 → `medium`, < 55 → `low`.

To tune scoring, edit `src/config/scoringWeights.ts`; to change sub-score normalisation logic, edit `scoringEngine.ts`.

### Multi-module architecture

`App.tsx` holds a `currentModule: ModuleId` state and renders either the `LandingPage` or an `AppShell`-wrapped module. To add a new module: create `src/modules/<name>/`, add a card to `LandingPage.tsx`, and add a case in `App.tsx`.

```
src/
  App.tsx                     ← state-based router (no react-router)
  pages/LandingPage.tsx       ← 3-card module selector
  modules/
    ricerca-clienti/          ← active module (hotspot map + scoring)
      RicercaClientiModule.tsx
      components/dashboard/
      components/map/
      data/                   ← mock hotspots and ATECO risk table
      services/               ← scoringEngine, csvExport, hotspotFilters, futureIntegrations/
      types/                  ← Hotspot, HotspotFilters, ScoreBreakdown, ScoringWeights
      config/                 ← scoringWeights, mapConfig
    ricerca-fornitori/        ← WIP module
    consulenza-personale/     ← WIP module
  components/
    layout/                   ← AppShell (wraps Header + main), Header (back button + logos), Sidebar
    ui/                       ← Card, Button, Badge, Modal, Stat (shared across all modules)
```

`Badge.tsx` defines `PriorityLevel` locally (`'high' | 'medium' | 'low'`) so it has no dependency on module-specific types.

### Backend skeleton (`backend/`)

FastAPI app with a `/api/hotspots` router and a scoring service that mirrors the frontend logic. CORS is pre-configured for `localhost:5173`. Intended to be replaced with a real PostgreSQL + PostGIS data source in the MVP phase.

## Constraints

- No external APIs, API keys, AI/LLM calls, or personal data — this is a sales demo
- Map tiles come from OpenStreetMap via Leaflet (no Google Maps)
- All hotspot data is mock and must stay clearly labelled as such
