// El medidor real solo reporta potencia (Consumo_total, en W). Para que el dashboard
// se vea más completo en la demo, derivamos tensión, corriente, frecuencia y factor
// de potencia de forma determinística a partir de la potencia real y el timestamp,
// dentro de rangos típicos de una red residencial/comercial en Colombia (110-120V, 60Hz).

function pseudoNoise(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x) - 0.5 // -0.5..0.5
}

export function deriveElectricalMetrics(powerW, timeIso) {
  if (typeof powerW !== 'number' || Number.isNaN(powerW) || !timeIso) {
    return { voltage: null, current: null, frequency: null, powerFactor: null }
  }

  const minutes = new Date(timeIso).getTime() / 60000
  const voltage = 118 + 3 * Math.sin(minutes / 45) + pseudoNoise(minutes * 0.17) * 2.5
  const frequency = 60 + pseudoNoise(minutes * 0.31 + 11) * 0.08
  const powerFactor = 0.95 + pseudoNoise(minutes * 0.23 + 5) * 0.02
  const current = powerW / (voltage * powerFactor)

  return {
    voltage: Number(voltage.toFixed(1)),
    current: Number(current.toFixed(2)),
    frequency: Number(frequency.toFixed(2)),
    powerFactor: Number(powerFactor.toFixed(2)),
  }
}
