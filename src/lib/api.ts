export interface LatestReading {
  time: string | null
  [metric: string]: number | string | null
}

export interface HistoryPoint {
  time: string
  [metric: string]: number | string | null
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

export interface DashboardApi {
  fetchLatest: () => Promise<LatestReading>
  fetchHistory: (range: RangeKey) => Promise<HistoryPoint[]>
}

export function createDashboardApi(basePath: string): DashboardApi {
  return {
    fetchLatest: () => get<LatestReading>(`${basePath}/latest`),
    fetchHistory: (range: RangeKey) => get<HistoryPoint[]>(`${basePath}/history?range=${range}`),
  }
}

export const sgsstApi = createDashboardApi('/api')
export const energyApi = createDashboardApi('/api/energy')
export const agricultureApi = createDashboardApi('/api/agriculture')
