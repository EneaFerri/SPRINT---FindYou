# BROFIND Find You - backend

Questo backend ha due componenti distinti:

1. **`app/`** — skeleton FastAPI per la fase MVP (non richiesto dalla demo a runtime)
2. **`data_extraction/`** — pipeline Python offline che genera `bergamo_hotspots_real.json`

## Pipeline di estrazione OSM (offline)

Genera i 50 hotspot reali usati dalla demo dal toggle "Fonte: OSM Reale".

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python data_extraction/run_extraction.py
# output: ../src/modules/ricerca-clienti/data/bergamo_hotspots_real.json
```

Script della pipeline:

| File | Ruolo |
|---|---|
| `run_extraction.py` | Entry point: orchestra, campiona 50 hotspot stratificati (40% high / 40% mid / 20% low) |
| `overpass_client.py` | Query Overpass API con retry e 3 endpoint pubblici; bbox provincia BG |
| `footprint_analyzer.py` | Clustering greedy 400m + scoring: area percentile × 0.40 + building type × 0.35 + zone × 0.25 |
| `hotspot_builder.py` | Geocoding Nominatim (zoom 12, 1.1s delay, verify=False macOS), business matching 600m |
| `ateco_mapper.py` | Mappa tag OSM → 28 codici ATECO + risk score (sincronizzato con `atecoRisk.mock.ts`) |

**Nota:** i risk score in `ateco_mapper.py` devono rimanere allineati con `atecoRisk.mock.ts`.
Se si aggiorna un risk in uno dei due file, aggiornare anche l'altro.

## App FastAPI (skeleton MVP)

```bash
uvicorn app.main:app --reload --port 8000
```

## Evoluzione prevista

- collegare PostgreSQL + PostGIS per geometrie, hotspot e aziende;
- spostare lo scoring in un servizio configurabile lato backend;
- aggiungere router per ingestion OSM, Registro Imprese/provider dati, ISPRA/AIA/AUA;
- sostituire `OverpassClient` con `CciaaClient` (stessa interfaccia duck-typed) per dati aziendali verificati;
- esporre endpoint sicuri per export lead, assegnazione sales e integrazione CRM.
