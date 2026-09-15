import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { MetricCard } from '../components/MetricCard'
import { HistoryChart } from '../components/HistoryChart'
import { RangeSelector } from '../components/RangeSelector'
import type { Theme } from '../hooks/useTheme'
import { useDashboardData } from '../hooks/useDashboardData'
import { energyApi } from '../lib/api'
import { ENERGY_METRICS } from '../lib/energyMetrics'
import type { RangeKey } from '../lib/api'

const LIVE_WINDOW_MS = 5 * 60 * 1000

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

export default function EnergyDashboard({ theme, onToggleTheme }: Props) {
  const [range, setRange] = useState<RangeKey>('6h')
  const { latest, history, error, loading } = useDashboardData(energyApi, range)

  const isLive =
    !error && !!latest?.time && Date.now() - new Date(latest.time).getTime() < LIVE_WINDOW_MS

  return (
    <AdminLayout
      title="Monitoreo de Energía"
      subtitle="Sabaneta, C.C. Aves María — medidor eléctrico"
      theme={theme}
      onToggleTheme={onToggleTheme}
      isLive={isLive}
    >
      {error && (
        <div className="banner banner--error">
          Fuente de datos de energía no disponible ({error}). Este módulo se conecta a una
          instancia de InfluxDB independiente, pendiente de configuración.
        </div>
      )}

      <section className="metrics-grid">
        {ENERGY_METRICS.map((config) => (
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
          <h2>Histórico de consumo</h2>
          <RangeSelector value={range} onChange={setRange} />
        </div>

        {loading && history.length === 0 && !error ? (
          <div className="chart-placeholder">Cargando datos del medidor…</div>
        ) : (
          <div className="charts-grid">
            {ENERGY_METRICS.map((config) => (
              <HistoryChart key={config.key} config={config} data={history} />
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
