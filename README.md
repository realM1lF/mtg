# MTG Explorer

Ein Astro-Projekt (React + TypeScript) als Grundlage für eine GitHub-Pages-Website rund um Magic: The Gathering.

## Voraussetzungen

- Docker + [DDEV](https://ddev.readthedocs.io)
- Node/npm innerhalb des DDEV-Containers (`ddev npm ...`)
- Optional: Supabase-Projekt für Persistenz/Alerts (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`)

## Projektstruktur

```
/
├── .ddev/
├── public/
├── src/
│   ├── components/
│   │   ├── CardSearch.tsx
│   │   ├── SimilarCardsDrawer.tsx
│   │   ├── Watchlist.tsx
│   │   ├── WatchlistApp.tsx
│   │   └── WatchlistShell.tsx
│   ├── lib/
│   │   ├── scryfall.ts
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   ├── index.astro
│   │   └── cards.astro
│   └── utils/
│       └── formatPrice.ts
├── supabase/
│   └── edge-functions/check-price/
│       └── index.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Lokale Entwicklung

```
ddev npm install
ddev npm run dev -- --host 0.0.0.0
```

- Devserver erreichbar unter `http://mtg.ddev.site:4321`
- Kartenliste (Scryfall-Demo): `http://mtg.ddev.site:4321/cards`

## Funktionen

- Suche nach Karten via Scryfall, Watchlist mit LocalStorage + optionaler Supabase-Synchronisation.
- Similar-Cards-Drawer: Vorschläge anhand Farbe/Typ/Keywords, direkt zur Watchlist hinzufügbar.
- Platzhalter für Preisalarme (`supabase/edge-functions/check-price`), Supabase-Konfiguration erforderlich.

## Supabase Setup (optional)

1. Supabase-Projekt erstellen, Tabelle `watchlist` anlegen (`card_id text primary key`, `payload jsonb`).
2. Edge Function `check-price` deployen (logik noch Platzhalter).
3. Env-Variablen setzen: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.

## Build & Preview

```
ddev npm run build
ddev npm run preview
```

Das Build-Ergebnis landet im Ordner `dist/`.

## Deployment über GitHub Pages

1. Repository zu GitHub pushen.
2. GitHub Action (`.github/workflows/deploy.yml`) baut das Projekt und veröffentlicht nach `gh-pages`.
3. In den Repository-Einstellungen GitHub Pages auf Branch `gh-pages` konfigurieren.
