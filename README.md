# Niuvee IoT — Panel de demostración SG-SST

Dashboard de demostración que muestra datos ambientales reales (temperatura, humedad, CO₂)
capturados por un sensor **SCD40** instalado en una oficina en Sabaneta, C.C. Aves María.
Los datos se almacenan en InfluxDB y se consultan en tiempo real.

Este es un proyecto de **demostración comercial**, no una app de producción: prioriza
pulido visual y datos en vivo por encima de funcionalidad completa.

## Stack

- **Frontend:** Vite + React + TypeScript, Recharts para gráficas.
- **Backend:** Express, expone `/api/latest` y `/api/history` como proxy hacia InfluxDB
  (el token de InfluxDB nunca llega al navegador).
- **Datos:** InfluxDB (`env_monitor` bucket, measurement `environment`, campos
  `temperature`, `humidity`, `co2`).

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa INFLUX_TOKEN con el token real
npm run dev:all        # levanta Vite (5173) + API Express (8787) juntos
```

Abre http://localhost:5173 — Vite hace proxy de `/api/*` hacia el servidor Express.

## Build de producción

```bash
npm run build   # compila el frontend a dist/
npm start        # sirve dist/ + /api/* desde un solo proceso Express
```

## Despliegue

### Render (recomendado — un solo servicio Node)

Incluye `render.yaml`. En el dashboard de Render:

1. New → Blueprint → apunta al repo (usa `render.yaml`).
2. Configura las variables de entorno: `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`,
   `INFLUX_BUCKET`.
3. Render ejecuta `npm install && npm run build` y luego `npm start`.

### Vercel (funciones serverless)

Incluye `vercel.json` y funciones en `api/` (`api/latest.js`, `api/history.js`) que
reutilizan la misma lógica de consulta a InfluxDB.

1. Importa el repo en Vercel.
2. Configura las mismas variables de entorno (`INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`,
   `INFLUX_BUCKET`) en Project Settings → Environment Variables.
3. Vercel detecta Vite automáticamente y despliega `api/*.js` como funciones serverless.

## Variables de entorno

Ver `.env.example`. **Nunca** commitees `.env` con el token real (ya está en `.gitignore`).

## Atribución

Powered by [Niuvee IoT](https://niuvee.com).
