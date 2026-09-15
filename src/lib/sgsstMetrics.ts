export type Status = 'good' | 'warning' | 'danger'

export interface MetricConfig {
  key: string
  label: string
  unit: string
  decimals: number
  evaluate: (value: number) => Status
  sgsst: string
}

export const SGSST_METRICS: MetricConfig[] = [
  {
    key: 'temperature',
    label: 'Temperatura',
    unit: '°C',
    decimals: 1,
    evaluate: (v) => (v >= 18 && v <= 26 ? 'good' : v >= 15 && v <= 29 ? 'warning' : 'danger'),
    sgsst:
      'El confort térmico incide directamente en la fatiga, la concentración y el desempeño. La Resolución 2400 de 1979 y las guías de ergonomía ambiental recomiendan mantener rangos térmicos estables en puestos de trabajo cerrados.',
  },
  {
    key: 'humidity',
    label: 'Humedad relativa',
    unit: '%',
    decimals: 0,
    evaluate: (v) => (v >= 30 && v <= 60 ? 'good' : v >= 20 && v <= 70 ? 'warning' : 'danger'),
    sgsst:
      'Niveles fuera de 30–60% de humedad relativa favorecen la proliferación de hongos y ácaros o resecan las vías respiratorias, factores de riesgo biológico contemplados en el SG-SST.',
  },
  {
    key: 'co2',
    label: 'CO₂',
    unit: 'ppm',
    decimals: 0,
    evaluate: (v) => (v <= 800 ? 'good' : v <= 1200 ? 'warning' : 'danger'),
    sgsst:
      'Concentraciones de CO₂ por encima de 1000–1200 ppm son un indicador indirecto de ventilación insuficiente, asociado a somnolencia, dolor de cabeza y menor productividad del personal.',
  },
]

export const STATUS_LABEL: Record<Status, string> = {
  good: 'Óptimo',
  warning: 'Atención',
  danger: 'Crítico',
}
