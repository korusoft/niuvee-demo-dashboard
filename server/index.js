import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { queryApi, bucket, isConfigured } from './influx.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 8787
const MEASUREMENT = 'environment'
const FIELDS = ['temperature', 'humidity', 'co2']

const RANGE_PRESETS = {
  '1h': { start: '-1h', every: '1m' },
  '6h': { start: '-6h', every: '5m' },
  '24h': { start: '-24h', every: '15m' },
  '7d': { start: '-7d', every: '1h' },
}

const fieldFilter = FIELDS.map((f) => `r._field == "${f}"`).join(' or ')

const app = express()
app.use(cors())

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, influxConfigured: isConfigured() })
})

app.get('/api/latest', async (_req, res) => {
  if (!queryApi) return res.status(503).json({ error: 'InfluxDB not configured' })

  const flux = `
    from(bucket: "${bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
      |> filter(fn: (r) => ${fieldFilter})
      |> last()
  `

  try {
    const rows = await queryApi.collectRows(flux)
    const latest = { temperature: null, humidity: null, co2: null, time: null }
    for (const row of rows) {
      if (row._field in latest) {
        latest[row._field] = row._value
        if (!latest.time || row._time > latest.time) latest.time = row._time
      }
    }
    res.json(latest)
  } catch (err) {
    console.error('[api/latest] query failed:', err.message)
    res.status(502).json({ error: 'Failed to query InfluxDB' })
  }
})

app.get('/api/history', async (req, res) => {
  if (!queryApi) return res.status(503).json({ error: 'InfluxDB not configured' })

  const rangeKey = String(req.query.range || '6h')
  const preset = RANGE_PRESETS[rangeKey]
  if (!preset) {
    return res.status(400).json({ error: `Invalid range. Use one of: ${Object.keys(RANGE_PRESETS).join(', ')}` })
  }

  const flux = `
    from(bucket: "${bucket}")
      |> range(start: ${preset.start})
      |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
      |> filter(fn: (r) => ${fieldFilter})
      |> aggregateWindow(every: ${preset.every}, fn: mean, createEmpty: false)
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])
  `

  try {
    const rows = await queryApi.collectRows(flux)
    const series = rows.map((row) => ({
      time: row._time,
      temperature: row.temperature ?? null,
      humidity: row.humidity ?? null,
      co2: row.co2 ?? null,
    }))
    res.json(series)
  } catch (err) {
    console.error('[api/history] query failed:', err.message)
    res.status(502).json({ error: 'Failed to query InfluxDB' })
  }
})

// Serve the built frontend when running as a single production process.
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next()
  })
})

app.listen(PORT, () => {
  console.log(`[server] Niuvee dashboard API listening on http://localhost:${PORT}`)
  if (!isConfigured()) {
    console.warn('[server] InfluxDB env vars missing — set INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET')
  }
})
