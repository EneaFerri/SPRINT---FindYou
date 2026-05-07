# BROFIND - Find You

Industrial Hotspot Intelligence Platform

Demo tecnica locale per visualizzare hotspot industriali nella provincia di Bergamo e trasformarli
in lead ambientali qualificabili per impianti RTO, VOC, scrubber, filtrazione e trattamento aria.

La demo non usa dati personali reali, scraping, Google Maps API, API key o chiamate AI esterne.
Tutti gli hotspot sono mock realistici e servono solo per raccontare il potenziale del prodotto.

## Cosa mostra la demo

- mappa Leaflet/OpenStreetMap centrata su Bergamo e provincia;
- 22 hotspot mock distribuiti in comuni industrialmente plausibili;
- marker con priorita alta, media e bassa;
- scheda lead con azienda mock, ATECO simulato, emissioni potenziali e prossima azione;
- filtri frontend per comune, priorita, score minimo, emissioni, ATECO e stato impianto;
- Brofind Lead Score calcolato da un motore separato e configurabile;
- export CSV dei lead filtrati;
- placeholder elegante per generazione futura di bozza offerta;
- pannelli di valore interno e roadmap tecnica.

## Prerequisiti

- Node.js 18 o superiore
- npm 9 o superiore

Backend opzionale:

- Python 3.11+
- FastAPI/Uvicorn, installabili da `backend/requirements.txt`

## Installazione

```bash
cd find-you-demo
npm install
```

## Avvio demo frontend

```bash
npm run dev
```

Aprire poi l'URL mostrato da Vite, di default:

```text
http://localhost:5173
```

## Build di verifica

```bash
npm run build
```

## Backend skeleton opzionale

Il frontend funziona senza backend. La cartella `backend/` e predisposta per un futuro servizio
FastAPI.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Struttura cartelle

```text
find-you-demo/
  README.md
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  tailwind.config.js
  postcss.config.js
  src/
    main.tsx
    App.tsx
    styles/globals.css
    data/
      hotspots.mock.ts
      atecoRisk.mock.ts
    types/
      hotspot.ts
      scoring.ts
    config/
      scoringWeights.ts
      mapConfig.ts
    services/
      scoringEngine.ts
      csvExport.ts
      hotspotFilters.ts
      futureIntegrations/
    components/
      layout/
      map/
      dashboard/
      ui/
  backend/
    README.md
    app/
      main.py
      routers/hotspots.py
      services/scoring_service.py
      models/hotspot.py
    requirements.txt
```

## Cosa e mock

- hotspot, aziende, ATECO, score iniziali e note tecniche;
- stato del matching azienda e presenza impianto di abbattimento;
- emissioni potenziali;
- azione "Salva Lead";
- generazione bozza offerta;
- endpoint backend.

## Score Engine demo

Il calcolo e in `src/services/scoringEngine.ts` e usa pesi configurati in
`src/config/scoringWeights.ts`:

- rischio ATECO / settore: 35%;
- dimensione sito: 20%;
- emissioni potenziali: 20%;
- assenza o mancata verifica impianto noto: 15%;
- densita industriale / area strategica: 10%.

La struttura consente di aggiungere parametri futuri senza accoppiare la logica ai componenti React.

## Predisposizione PostgreSQL + PostGIS

Per la fase MVP, il backend potra introdurre:

- tabella `industrial_hotspots` con colonna `geometry(Point, 4326)` o poligoni industriali;
- tabella `companies` con dati aziendali verificati e codice ATECO;
- tabella `lead_scores` con breakdown, pesi e audit trail;
- indici GiST su geometrie PostGIS;
- job di ingestion da OpenStreetMap, provider aziendali autorizzati e fonti ambientali pubbliche.

Il frontend dovrebbe poi sostituire i mock con un repository API, mantenendo invariati filtri,
scheda lead e mappa.

## Roadmap tecnica

Fase 0 - Demo Challenge:

- mappa Bergamo;
- mock hotspot;
- score demo;
- filtri;
- export CSV;
- storytelling del valore Brofind.

Fase 1 - MVP:

- ingestion dati OpenStreetMap;
- database PostGIS;
- matching aziende;
- ATECO;
- gestione utenti interni;
- export lead per sales.

Fase 2 - Lead Intelligence:

- integrazione Registro Imprese o provider dati aziendali;
- fonti ambientali pubbliche come ISPRA/AIA/AUA;
- scoring configurabile da admin;
- esclusione clienti gia esistenti;
- assegnazione lead al commerciale.

Fase 3 - AI e automazione:

- computer vision su immagini satellitari o dataset autorizzati;
- riconoscimento capannoni, camini e cluster produttivi;
- generazione semi-automatica di proposta RTO/VOC/Scrubber;
- integrazione CRM;
- alert nuove opportunita.

## Principi e vincoli rispettati

- nessun dato personale reale;
- nessuno scraping;
- nessuna API key;
- nessuna Google Maps API;
- nessuna chiamata a OpenAI, Claude o altri LLM;
- OpenStreetMap come base map tramite Leaflet;
- architettura modulare pronta per integrazioni future;
- demo specifica per Brofind Find You, pensata per sales, tecnico e management.
