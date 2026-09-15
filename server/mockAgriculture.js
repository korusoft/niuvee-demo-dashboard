// Generador de datos simulados para el dashboard de Agricultura (no hay sensor físico
// todavía). Es determinístico en función del timestamp, así que la curva se ve continua
// y realista en lugar de saltar al azar entre lecturas.

export const RANGE_PRESETS = {
  '1h': { startMs: 60 * 60 * 1000, everyMs: 60 * 1000 },
  '6h': { startMs: 6 * 60 * 60 * 1000, everyMs: 5 * 60 * 1000 },
  '24h': { startMs: 24 * 60 * 60 * 1000, everyMs: 15 * 60 * 1000 },
  '7d': { startMs: 7 * 24 * 60 * 60 * 1000, everyMs: 60 * 60 * 1000 },
}

function pseudoNoise(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x) - 0.5 // -0.5..0.5
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

function valuesAt(timeMs) {
  const minutes = timeMs / 60000
  const hour = new Date(timeMs).getHours() + new Date(timeMs).getMinutes() / 60

  const soil_moisture = clamp(
    50 + 8 * Math.sin(minutes / 180) + pseudoNoise(minutes * 0.13) * 4,
    20,
    85
  )

  const soil_temp = clamp(
    21 + 4 * Math.sin(((hour - 9) / 24) * 2 * Math.PI) + pseudoNoise(minutes * 0.09 + 7) * 1.2,
    10,
    34
  )

  const daylight = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI))
  const light = clamp(daylight * 85 + pseudoNoise(minutes * 0.21 + 3) * 6, 0, 100)

  return {
    soil_moisture: Number(soil_moisture.toFixed(1)),
    soil_temp: Number(soil_temp.toFixed(1)),
    light: Number(light.toFixed(1)),
  }
}

export function generateLatest() {
  const now = Date.now()
  return { time: new Date(now).toISOString(), ...valuesAt(now) }
}

export function generateSeries(rangeKey) {
  const preset = RANGE_PRESETS[rangeKey]
  if (!preset) return null

  const now = Date.now()
  const start = now - preset.startMs
  const points = []
  for (let t = start; t <= now; t += preset.everyMs) {
    points.push({ time: new Date(t).toISOString(), ...valuesAt(t) })
  }
  return points
}
