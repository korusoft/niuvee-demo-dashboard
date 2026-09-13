# Niuvee SG-SST Demo Dashboard — Project Summary

## Purpose

A **sales/demo** dashboard for Niuvee IoT (https://niuvee.com), framed around SG-SST
(Colombian occupational health & safety) compliance. It shows live environmental
readings to demonstrate the platform to prospective customers. Explicitly not a
production app — prioritizes visual polish and real data over feature completeness.

## Data source

- Sensor branded **NV-ENV-40** (hardware: SCD40) installed in an office in Sabaneta,
  C.C. Aves María.
- Stored in InfluxDB at `https://influx.niuvee.com`, org `013b75c532505959`,
  bucket `env_monitor`.
- Influx schema: measurement `environment`, fields `temperature`, `humidity`, `co2`
  (also `rssi`, unused in the UI), tags `board=ESP8266`, `device=esp8266-lab-01`,
  `location=Laboratorio_iot_env`, `sensor=SCD40`.
- The InfluxDB API token lives only in `CLAUDE.md` (gitignored, never committed) and
  in `.env` locally / the hosting platform's env vars in production — never in the
  repo or the client bundle.

## Stack & architecture

- **Frontend:** Vite + React + TypeScript, Recharts for charts, plain CSS with
  light/dark theme tokens (`src/index.css`, `src/App.css`).
- **Backend (Render path):** Express server (`server/index.js`) proxies InfluxDB
  queries and serves the built `dist/` — single Node process, deploy via
  `render.yaml`.
- **Backend (Vercel path):** Equivalent logic duplicated as serverless functions in
  `api/latest.js` / `api/history.js` / `api/_lib/influx.js`, so the same repo deploys
  to either platform. Deliberately duplicated rather than shared, since Render (long-
  running process) and Vercel (serverless) have different runtime models.
- **Endpoints:** `GET /api/latest` (current values), `GET /api/history?range=1h|6h|24h|7d`
  (aggregated time series via Flux `aggregateWindow`), `GET /api/health`.
- Frontend polls `/api/latest` every 15s and `/api/history` every 60s.

## UI behavior

- Three metric cards (Temperature, Humidity, CO₂) with current value, status badge
  (good/warning/critical against SG-SST-flavored thresholds in `src/lib/thresholds.ts`),
  sparkline, and a short SG-SST relevance blurb per metric.
- Small-multiple time-series charts (one per metric, own y-axis — never dual-axis)
  with a range selector (1h/6h/24h/7d). **Default range: 6h.**
- **Default theme: dark** (still toggleable to light; choice persists in
  `localStorage` under `niuvee-theme`).
- Chart palette validated for colorblind-safety via the `dataviz` skill's
  `validate_palette.js` (blue/orange/aqua categorical slots).
- Niuvee IoT attribution in header and footer; footer also disclaims it's a demo,
  not a certified SG-SST system.

## Deployment

- **Repo:** https://github.com/korusoft/niuvee-demo-dashboard (branch `main`).
- **Render:** Blueprint deploy from `render.yaml` — set `INFLUX_URL`, `INFLUX_TOKEN`,
  `INFLUX_ORG`, `INFLUX_BUCKET` as env vars in the Render dashboard (marked
  `sync: false` so they're never read from a committed file). Free plan cold-starts
  after inactivity (~30s) — worth a heads-up before a live customer demo.
- **Vercel:** zero-config Vite detection + `api/` functions; same env vars set in
  Project Settings.

## Current state (as of 2026-09-13)

- Scaffolded from scratch, live-tested against the real Influx instance (schema
  confirmed by direct Flux queries), `tsc -b && vite build` clean.
- Two commits pushed to `main`: initial build, then a follow-up renaming the sensor
  label to NV-ENV-40 and defaulting to dark mode.
- Not yet visually verified in an actual browser (no Chrome extension connection in
  the dev environment) — only HTTP/API-level verification done so far.
- Render/Vercel deployment not yet confirmed live by the user as of this writing.
