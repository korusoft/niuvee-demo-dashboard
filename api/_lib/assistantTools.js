import { queryApi, bucket } from './influx.js'
import {
  queryApi as energyQueryApi,
  bucket as energyBucket,
  MEASUREMENT as ENERGY_MEASUREMENT,
  FIELDS as ENERGY_FIELDS,
  FIELD_ALIASES as ENERGY_FIELD_ALIASES,
} from './influxEnergy.js'
import { generateSeries as generateAgricultureSeries } from './mockAgriculture.js'
import { deriveElectricalMetrics } from './energySimulation.js'

// Constantes propias (no importadas de influx.js/influxEnergy.js): en el path Render
// (server/) viven inline en server/index.js en vez de exportarse, así que se duplican
// aquí para que este módulo sea idéntico entre server/ y api/_lib/.
const RANGE_KEYS = ['1h', '6h', '24h', '7d']
const MEASUREMENT = 'environment'
const FIELD_FILTER = ['temperature', 'humidity', 'co2'].map((f) => `r._field == "${f}"`).join(' or ')
const ENERGY_FIELD_FILTER = ENERGY_FIELDS.map((f) => `r._field == "${f}"`).join(' or ')
const RANGE_PRESETS = {
  '1h': { start: '-1h', every: '1m' },
  '6h': { start: '-6h', every: '5m' },
  '24h': { start: '-24h', every: '15m' },
  '7d': { start: '-7d', every: '1h' },
}

// Mismos umbrales que src/lib/sgsstMetrics.ts / energyMetrics.ts / agricultureMetrics.ts,
// duplicados aquí porque el backend corre como JS plano (sin paso de build de TS).
const THRESHOLDS = {
  temperature: {
    unit: '°C',
    evaluate: (v) => (v >= 18 && v <= 26 ? 'good' : v >= 15 && v <= 29 ? 'warning' : 'danger'),
    guidance:
      'El confort térmico incide directamente en la fatiga, la concentración y el desempeño. La Resolución 2400 de 1979 y las guías de ergonomía ambiental recomiendan mantener rangos térmicos estables en puestos de trabajo cerrados.',
  },
  humidity: {
    unit: '%',
    evaluate: (v) => (v >= 30 && v <= 60 ? 'good' : v >= 20 && v <= 70 ? 'warning' : 'danger'),
    guidance:
      'Niveles fuera de 30–60% de humedad relativa favorecen la proliferación de hongos y ácaros o resecan las vías respiratorias, factores de riesgo biológico contemplados en el SG-SST.',
  },
  co2: {
    unit: 'ppm',
    evaluate: (v) => (v <= 800 ? 'good' : v <= 1200 ? 'warning' : 'danger'),
    guidance:
      'Concentraciones de CO₂ por encima de 1000–1200 ppm son un indicador indirecto de ventilación insuficiente, asociado a somnolencia, dolor de cabeza y menor productividad del personal.',
  },
  power: {
    unit: 'W',
    evaluate: (v) => (v <= 300 ? 'good' : v <= 450 ? 'warning' : 'danger'),
    guidance:
      'El consumo eléctrico en tiempo real permite identificar picos de demanda y detectar oportunidades de eficiencia energética antes de que impacten la factura.',
  },
  voltage: {
    unit: 'V',
    evaluate: (v) => (v >= 110 && v <= 120 ? 'good' : v >= 105 && v <= 127 ? 'warning' : 'danger'),
    guidance:
      'En Colombia la red residencial/comercial opera entre 110-120V. Desviaciones sostenidas pueden indicar mala regulación de la acometida y acelerar el desgaste de equipos.',
  },
  current: {
    unit: 'A',
    evaluate: (v) => (v <= 3 ? 'good' : v <= 5 ? 'warning' : 'danger'),
    guidance:
      'Picos de corriente sostenidos por encima del diseño del cableado son un riesgo de sobrecalentamiento del circuito.',
  },
  frequency: {
    unit: 'Hz',
    evaluate: (v) => (v >= 59.9 && v <= 60.1 ? 'good' : v >= 59.5 && v <= 60.5 ? 'warning' : 'danger'),
    guidance:
      'La frecuencia nominal de la red en Colombia es 60Hz; variaciones importantes suelen asociarse a inestabilidad de la red o del respaldo eléctrico.',
  },
  powerFactor: {
    unit: '',
    evaluate: (v) => (v >= 0.95 ? 'good' : v >= 0.9 ? 'warning' : 'danger'),
    guidance:
      'Un factor de potencia bajo implica más corriente para la misma potencia útil, generando pérdidas y posibles penalizaciones en la factura eléctrica.',
  },
  soil_moisture: {
    unit: '%',
    evaluate: (v) => (v >= 35 && v <= 65 ? 'good' : v >= 25 && v <= 75 ? 'warning' : 'danger'),
    guidance:
      'La humedad del suelo fuera de rango indica riego insuficiente o exceso de agua, afectando directamente el rendimiento del cultivo.',
  },
  soil_temp: {
    unit: '°C',
    evaluate: (v) => (v >= 15 && v <= 28 ? 'good' : v >= 10 && v <= 32 ? 'warning' : 'danger'),
    guidance: 'La temperatura del suelo influye en la germinación y absorción de nutrientes de las plantas.',
  },
  light: {
    unit: 'klux',
    evaluate: (v) => (v >= 20 && v <= 80 ? 'good' : v >= 10 && v <= 100 ? 'warning' : 'danger'),
    guidance: 'La luminosidad disponible determina la eficiencia fotosintética del cultivo monitoreado.',
  },
}

function normalizeRange(range) {
  return RANGE_KEYS.includes(range) ? range : '6h'
}

// La oficina monitoreada está en Sabaneta, Colombia. Formateamos las horas a hora
// local antes de dárselas al modelo para que no las reporte en UTC.
const TIME_ZONE = 'America/Bogota'

function formatLocalTime(iso) {
  if (!iso) return null
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

function summarizeField(series, field) {
  const points = series.filter((p) => typeof p[field] === 'number')
  if (points.length === 0) return null

  let sum = 0
  let min = points[0]
  let max = points[0]
  for (const p of points) {
    sum += p[field]
    if (p[field] < min[field]) min = p
    if (p[field] > max[field]) max = p
  }
  const avg = sum / points.length
  const threshold = THRESHOLDS[field]

  return {
    unit: threshold?.unit ?? '',
    avg: Number(avg.toFixed(2)),
    min: { value: min[field], time: formatLocalTime(min.time) },
    max: { value: max[field], time: formatLocalTime(max.time) },
    peak: { value: max[field], time: formatLocalTime(max.time) },
    status: threshold ? threshold.evaluate(avg) : 'good',
  }
}

async function fetchSgsstSeries(range) {
  if (!queryApi) throw new Error('InfluxDB not configured')
  const preset = RANGE_PRESETS[range]
  const flux = `
    from(bucket: "${bucket}")
      |> range(start: ${preset.start})
      |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
      |> filter(fn: (r) => ${FIELD_FILTER})
      |> aggregateWindow(every: ${preset.every}, fn: mean, createEmpty: false)
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])
  `
  const rows = await queryApi.collectRows(flux)
  return rows.map((row) => ({
    time: row._time,
    temperature: row.temperature ?? null,
    humidity: row.humidity ?? null,
    co2: row.co2 ?? null,
  }))
}

async function fetchEnergySeries(range) {
  if (!energyQueryApi) throw new Error('InfluxDB (energía) not configured')
  const preset = RANGE_PRESETS[range]
  const flux = `
    from(bucket: "${energyBucket}")
      |> range(start: ${preset.start})
      |> filter(fn: (r) => r._measurement == "${ENERGY_MEASUREMENT}")
      |> filter(fn: (r) => ${ENERGY_FIELD_FILTER})
      |> aggregateWindow(every: ${preset.every}, fn: mean, createEmpty: false)
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])
  `
  const rows = await energyQueryApi.collectRows(flux)
  return rows.map((row) => {
    const point = { time: row._time }
    for (const field of ENERGY_FIELDS) point[ENERGY_FIELD_ALIASES[field] ?? field] = row[field] ?? null
    Object.assign(point, deriveElectricalMetrics(point.power, point.time))
    return point
  })
}

export async function getEnvironmentSummary({ range }) {
  const r = normalizeRange(range)
  const series = await fetchSgsstSeries(r)
  return {
    range: r,
    temperature: summarizeField(series, 'temperature'),
    humidity: summarizeField(series, 'humidity'),
    co2: summarizeField(series, 'co2'),
  }
}

export async function getEnergySummary({ range }) {
  const r = normalizeRange(range)
  const series = await fetchEnergySeries(r)
  return {
    range: r,
    power: summarizeField(series, 'power'),
    voltage: summarizeField(series, 'voltage'),
    current: summarizeField(series, 'current'),
    frequency: summarizeField(series, 'frequency'),
    powerFactor: summarizeField(series, 'powerFactor'),
  }
}

export async function getAgricultureSummary({ range }) {
  const r = normalizeRange(range)
  const series = generateAgricultureSeries(r) ?? []
  return {
    range: r,
    soil_moisture: summarizeField(series, 'soil_moisture'),
    soil_temp: summarizeField(series, 'soil_temp'),
    light: summarizeField(series, 'light'),
  }
}

export async function getSgsstRecommendations({ range }) {
  const summary = await getEnvironmentSummary({ range })
  const findings = []
  for (const field of ['temperature', 'humidity', 'co2']) {
    const stat = summary[field]
    if (!stat || stat.status === 'good') continue
    findings.push({
      metric: field,
      status: stat.status,
      avg: stat.avg,
      unit: stat.unit,
      peak: stat.peak,
      guidance: THRESHOLDS[field].guidance,
    })
  }
  return { range: summary.range, allGood: findings.length === 0, findings }
}

export const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_environment_summary',
      description:
        'Resumen de temperatura, humedad y CO2 del sensor SG-SST (promedio, mínimo, máximo y pico) para un rango de tiempo.',
      parameters: {
        type: 'object',
        properties: { range: { type: 'string', enum: RANGE_KEYS, description: 'Rango de tiempo a consultar' } },
        required: ['range'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_energy_summary',
      description:
        'Resumen eléctrico (potencia, tensión, corriente, frecuencia y factor de potencia) para un rango de tiempo, incluyendo picos de consumo.',
      parameters: {
        type: 'object',
        properties: { range: { type: 'string', enum: RANGE_KEYS, description: 'Rango de tiempo a consultar' } },
        required: ['range'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_agriculture_summary',
      description: 'Resumen de humedad del suelo, temperatura del suelo y luminosidad para un rango de tiempo.',
      parameters: {
        type: 'object',
        properties: { range: { type: 'string', enum: RANGE_KEYS, description: 'Rango de tiempo a consultar' } },
        required: ['range'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_sgsst_recommendations',
      description:
        'Hallazgos y justificación normativa SG-SST para las métricas ambientales fuera de rango óptimo en el período consultado.',
      parameters: {
        type: 'object',
        properties: { range: { type: 'string', enum: RANGE_KEYS, description: 'Rango de tiempo a evaluar' } },
        required: ['range'],
      },
    },
  },
]

export const TOOL_IMPLEMENTATIONS = {
  get_environment_summary: getEnvironmentSummary,
  get_energy_summary: getEnergySummary,
  get_agriculture_summary: getAgricultureSummary,
  get_sgsst_recommendations: getSgsstRecommendations,
}
