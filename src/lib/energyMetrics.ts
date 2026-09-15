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
  {
    key: 'voltage',
    label: 'Tensión',
    unit: 'V',
    decimals: 1,
    evaluate: (v) => (v >= 110 && v <= 120 ? 'good' : v >= 105 && v <= 127 ? 'warning' : 'danger'),
    sgsst:
      'En Colombia la red residencial/comercial opera entre 110-120V. Desviaciones sostenidas fuera de rango pueden indicar mala regulación de la acometida y acelerar el desgaste de los equipos conectados.',
  },
  {
    key: 'current',
    label: 'Corriente',
    unit: 'A',
    decimals: 2,
    evaluate: (v) => (v <= 3 ? 'good' : v <= 5 ? 'warning' : 'danger'),
    sgsst:
      'La corriente consumida refleja la carga real del circuito monitoreado; picos sostenidos por encima del diseño del cableado son un riesgo de sobrecalentamiento.',
  },
  {
    key: 'frequency',
    label: 'Frecuencia',
    unit: 'Hz',
    decimals: 2,
    evaluate: (v) => (v >= 59.9 && v <= 60.1 ? 'good' : v >= 59.5 && v <= 60.5 ? 'warning' : 'danger'),
    sgsst:
      'La frecuencia nominal de la red en Colombia es 60Hz. Variaciones importantes suelen asociarse a inestabilidad de la red eléctrica o del generador que la respalda.',
  },
  {
    key: 'powerFactor',
    label: 'Factor de potencia',
    unit: '',
    decimals: 2,
    evaluate: (v) => (v >= 0.95 ? 'good' : v >= 0.9 ? 'warning' : 'danger'),
    sgsst:
      'Un factor de potencia bajo implica más corriente para la misma potencia útil, generando pérdidas y, en algunos casos, penalizaciones en la factura eléctrica.',
  },
]
