import { useState } from 'react'
import { Header } from './components/Header'
import { MetricCard } from './components/MetricCard'
import { HistoryChart } from './components/HistoryChart'
import { RangeSelector } from './components/RangeSelector'
import { Footer } from './components/Footer'
import { useTheme } from './hooks/useTheme'
import { useDashboardData } from './hooks/useDashboardData'
import { METRICS } from './lib/thresholds'
import type { RangeKey } from './lib/api'

const LIVE_WINDOW_MS = 5 * 60 * 1000

export default function App() {
  const { theme, toggle } = useTheme()
  const [range, setRange] = useState<RangeKey>('6h')
  const { latest, history, error, loading } = useDashboardData(range)

  const isLive =
    !error && !!latest?.time && Date.now() - new Date(latest.time).getTime() < LIVE_WINDOW_MS

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={toggle} isLive={isLive} />

      <main className="app-main">
        {error && (
          <div className="banner banner--error">
            No se pudo conectar con la fuente de datos ({error}). Mostrando la última información
            disponible.
          </div>
        )}

        <section className="metrics-grid">
          {METRICS.map((config) => (
            <MetricCard
              key={config.key}
              config={config}
              value={latest ? latest[config.key] : null}
              history={history}
            />
          ))}
        </section>

        <section className="history-section">
          <div className="history-section__header">
            <h2>Histórico de mediciones</h2>
            <RangeSelector value={range} onChange={setRange} />
          </div>

          {loading && history.length === 0 ? (
            <div className="chart-placeholder">Cargando datos del sensor…</div>
          ) : (
            <div className="charts-grid">
              {METRICS.map((config) => (
                <HistoryChart key={config.key} config={config} data={history} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
