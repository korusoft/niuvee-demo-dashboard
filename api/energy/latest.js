import { queryApi, bucket, MEASUREMENT, FIELDS, FIELD_ALIASES, FIELD_FILTER } from '../_lib/influxEnergy.js'

export default async function handler(req, res) {
  if (!queryApi) return res.status(503).json({ error: 'InfluxDB (energía) not configured' })

  const flux = `
    from(bucket: "${bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
      |> filter(fn: (r) => ${FIELD_FILTER})
      |> last()
  `

  try {
    const rows = await queryApi.collectRows(flux)
    const latest = { time: null }
    for (const field of FIELDS) latest[FIELD_ALIASES[field] ?? field] = null
    for (const row of rows) {
      if (FIELDS.includes(row._field)) {
        latest[FIELD_ALIASES[row._field] ?? row._field] = row._value
        if (!latest.time || row._time > latest.time) latest.time = row._time
      }
    }
    res.status(200).json(latest)
  } catch (err) {
    console.error('[api/energy/latest] query failed:', err.message)
    res.status(502).json({ error: 'Failed to query InfluxDB' })
  }
}
