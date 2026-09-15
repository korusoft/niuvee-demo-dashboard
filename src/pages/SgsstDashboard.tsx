import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { MetricCard } from '../components/MetricCard'
import { HistoryChart } from '../components/HistoryChart'
import { RangeSelector } from '../components/RangeSelector'
import type { Theme } from '../hooks/useTheme'
import { useDashboardData } from '../hooks/useDashboardData'
import { sgsstApi } from '../lib/api'
import { SGSST_METRICS } from '../lib/sgsstMetrics'
import type { RangeKey } from '../lib/api'

const LIVE_WINDOW_MS = 5 * 60 * 1000

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

export default function SgsstDashboard({ theme, onToggleTheme }: Props) {
  const [range, setRange] = useState<RangeKey>('6h')
  const { latest, history, error, loading } = useDashboardData(sgsstApi, range)

  const isLive =
    !error && !!latest?.time && Date.now() - new Date(latest.time).getTime() < LIVE_WINDOW_MS

  return (
    <AdminLayout
      title="Monitoreo SG-SST"
      subtitle="Sabaneta, C.C. Aves María — sensor NV-ENV-40"
      theme={theme}
      onToggleTheme={onToggleTheme}
      isLive={isLive}
    >
      {error && (
        <div className="banner banner--error">
          No se pudo conectar con la fuente de datos ({error}). Mostrando la última información
          disponible.
        </div>
      )}

      <section className="metrics-grid">
        {SGSST_METRICS.map((config) => (
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
            {SGSST_METRICS.map((config) => (
              <HistoryChart key={config.key} config={config} data={history} />
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
