export type MetricKey = 'temperature' | 'humidity' | 'co2'

export interface LatestReading {
  temperature: number | null
  humidity: number | null
  co2: number | null
  time: string | null
}

export interface HistoryPoint {
  time: string
  temperature: number | null
  humidity: number | null
  co2: number | null
}

export type RangeKey = '1h' | '6h' | '24h' | '7d'

export const RANGE_LABELS: Record<RangeKey, string> = {
  '1h': '1 hora',
  '6h': '6 horas',
  '24h': '24 horas',
  '7d': '7 días',
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function fetchLatest(): Promise<LatestReading> {
  return get<LatestReading>('/api/latest')
}

export function fetchHistory(range: RangeKey): Promise<HistoryPoint[]> {
  return get<HistoryPoint[]>(`/api/history?range=${range}`)
}
