import type { MetricConfig } from './sgsstMetrics'

export const AGRICULTURE_METRICS: MetricConfig[] = [
  {
    key: 'soil_moisture',
    label: 'Humedad del suelo',
    unit: '%',
    decimals: 0,
    evaluate: (v) => (v >= 35 && v <= 65 ? 'good' : v >= 25 && v <= 75 ? 'warning' : 'danger'),
    sgsst:
      'La humedad del suelo fuera de rango indica riego insuficiente o exceso de agua, afectando directamente el rendimiento del cultivo.',
  },
  {
    key: 'soil_temp',
    label: 'Temperatura del suelo',
    unit: '°C',
    decimals: 1,
    evaluate: (v) => (v >= 15 && v <= 28 ? 'good' : v >= 10 && v <= 32 ? 'warning' : 'danger'),
    sgsst:
      'La temperatura del suelo influye en la germinación y absorción de nutrientes de las plantas.',
  },
  {
    key: 'light',
    label: 'Luminosidad',
    unit: 'klux',
    decimals: 1,
    evaluate: (v) => (v >= 20 && v <= 80 ? 'good' : v >= 10 && v <= 100 ? 'warning' : 'danger'),
    sgsst: 'La luminosidad disponible determina la eficiencia fotosintética del cultivo monitoreado.',
  },
]
