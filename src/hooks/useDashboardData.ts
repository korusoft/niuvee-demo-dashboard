import { useEffect, useRef, useState } from 'react'
import { fetchHistory, fetchLatest, type HistoryPoint, type LatestReading, type RangeKey } from '../lib/api'

const LATEST_POLL_MS = 15_000
const HISTORY_POLL_MS = 60_000

export function useDashboardData(range: RangeKey) {
  const [latest, setLatest] = useState<LatestReading | null>(null)
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const isFirstHistoryLoad = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function pollLatest() {
      try {
        const data = await fetchLatest()
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
  }, [])

  useEffect(() => {
    let cancelled = false
    isFirstHistoryLoad.current = true

    async function pollHistory() {
      try {
        if (isFirstHistoryLoad.current) setLoading(true)
        const data = await fetchHistory(range)
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
  }, [range])

  return { latest, history, error, loading }
}
