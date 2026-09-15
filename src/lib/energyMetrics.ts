import type { MetricConfig } from './sgsstMetrics'

export const ENERGY_METRICS: MetricConfig[] = [
  {
    key: 'power',
    label: 'Consumo eléctrico',
    unit: 'W',
    decimals: 0,
    evaluate: (v) => (v <= 300 ? 'good' : v <= 450 ? 'warning' : 'danger'),
    sgsst:
      'El consumo eléctrico en tiempo real permite identificar picos de demanda y detectar oportunidades de eficiencia energética antes de que impacten la factura.',
  },
]
