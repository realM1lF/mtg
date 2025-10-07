# MTG Explorer

Ein Astro-Projekt (React + TypeScript) als Grundlage für eine GitHub-Pages-Website rund um Magic: The Gathering.

## Voraussetzungen

- Docker (läuft bereits)
- [DDEV](https://ddev.readthedocs.io)
- Node/npm innerhalb des DDEV-Containers (`ddev npm ...`)

## Projektstruktur

```
/
├── .ddev/
├── public/
├── src/
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Lokale Entwicklung

```
ddev npm install
ddev npm run dev
```

Anschließend steht die Seite unter `https://mtg.ddev.site` zur Verfügung.

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
