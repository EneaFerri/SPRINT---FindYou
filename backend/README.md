# BROFIND Find You - backend skeleton

Questo backend FastAPI e un placeholder scalabile per la fase MVP. La demo frontend funziona con
mock data locali e non richiede l'avvio del backend.

## Avvio opzionale

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Evoluzione prevista

- collegare PostgreSQL + PostGIS per geometrie, hotspot e aziende;
- spostare lo scoring in un servizio configurabile lato backend;
- aggiungere router per ingestion OSM, Registro Imprese/provider dati, ISPRA/AIA/AUA;
- esporre endpoint sicuri per export lead, assegnazione sales e integrazione CRM.
