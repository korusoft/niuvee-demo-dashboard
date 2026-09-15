import { generateSeries } from '../_lib/mockAgriculture.js'

export default async function handler(req, res) {
  const rangeKey = String(req.query.range || '6h')
  const series = generateSeries(rangeKey)
  if (!series) {
    return res.status(400).json({ error: 'Invalid range. Use one of: 1h, 6h, 24h, 7d' })
  }
  res.status(200).json(series)
}
