import { useEffect, useRef, useState } from 'react'
import type { DashboardApi, HistoryPoint, LatestReading, RangeKey } from '../lib/api'

const LATEST_POLL_MS = 15_000
const HISTORY_POLL_MS = 60_000

export function useDashboardData(api: DashboardApi, range: RangeKey) {
  const [latest, setLatest] = useState<LatestReading | null>(null)
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const isFirstHistoryLoad = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function pollLatest() {
      try {
        const data = await api.fetchLatest()
        if (!cancelled) {
          setLatest(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    }

    pollLatest()
    const id = setInterval(pollLatest, LATEST_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [api])

  useEffect(() => {
    let cancelled = false
    isFirstHistoryLoad.current = true

    async function pollHistory() {
      try {
        if (isFirstHistoryLoad.current) setLoading(true)
        const data = await api.fetchHistory(range)
        if (!cancelled) {
          setHistory(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        if (!cancelled) {
          setLoading(false)
          isFirstHistoryLoad.current = false
        }
      }
    }

    pollHistory()
    const id = setInterval(pollHistory, HISTORY_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [api, range])

  return { latest, history, error, loading }
}
