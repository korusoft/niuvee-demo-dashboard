import { queryApi, bucket, MEASUREMENT, FIELDS, FIELD_ALIASES, FIELD_FILTER, RANGE_PRESETS } from '../_lib/influxEnergy.js'

export default async function handler(req, res) {
  if (!queryApi) return res.status(503).json({ error: 'InfluxDB (energía) not configured' })

  const rangeKey = String(req.query.range || '6h')
  const preset = RANGE_PRESETS[rangeKey]
  if (!preset) {
    return res.status(400).json({ error: `Invalid range. Use one of: ${Object.keys(RANGE_PRESETS).join(', ')}` })
  }

  const flux = `
    from(bucket: "${bucket}")
      |> range(start: ${preset.start})
      |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
      |> filter(fn: (r) => ${FIELD_FILTER})
      |> aggregateWindow(every: ${preset.every}, fn: mean, createEmpty: false)
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])
  `

  try {
    const rows = await queryApi.collectRows(flux)
    const series = rows.map((row) => {
      const point = { time: row._time }
      for (const field of FIELDS) point[FIELD_ALIASES[field] ?? field] = row[field] ?? null
      return point
    })
    res.status(200).json(series)
  } catch (err) {
    console.error('[api/energy/history] query failed:', err.message)
    res.status(502).json({ error: 'Failed to query InfluxDB' })
  }
}
