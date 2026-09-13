import { queryApi, bucket, MEASUREMENT, FIELD_FILTER } from './_lib/influx.js'

export default async function handler(req, res) {
  if (!queryApi) return res.status(503).json({ error: 'InfluxDB not configured' })

  const flux = `
    from(bucket: "${bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
      |> filter(fn: (r) => ${FIELD_FILTER})
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
    res.status(200).json(latest)
  } catch (err) {
    console.error('[api/latest] query failed:', err.message)
    res.status(502).json({ error: 'Failed to query InfluxDB' })
  }
}
