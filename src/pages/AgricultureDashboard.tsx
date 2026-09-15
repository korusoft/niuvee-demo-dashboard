import { useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { MetricCard } from '../components/MetricCard'
import { HistoryChart } from '../components/HistoryChart'
import { RangeSelector } from '../components/RangeSelector'
import type { Theme } from '../hooks/useTheme'
import { useDashboardData } from '../hooks/useDashboardData'
import { agricultureApi } from '../lib/api'
import { AGRICULTURE_METRICS } from '../lib/agricultureMetrics'
import type { RangeKey } from '../lib/api'

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

export default function AgricultureDashboard({ theme, onToggleTheme }: Props) {
  const [range, setRange] = useState<RangeKey>('6h')
  const { latest, history, error, loading } = useDashboardData(agricultureApi, range)

  return (
    <AdminLayout
      title="Monitoreo Agrícola"
      subtitle="Cultivo piloto — sensores de suelo simulados"
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
      <div className="banner banner--info">
        Este módulo muestra <strong>datos simulados</strong> con fines demostrativos: aún no hay
        un sensor físico instalado en campo.
      </div>

      {error && (
        <div className="banner banner--error">
          No se pudo generar la simulación ({error}).
        </div>
      )}

      <section className="metrics-grid">
        {AGRICULTURE_METRICS.map((config) => (
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
          <h2>Histórico simulado</h2>
          <RangeSelector value={range} onChange={setRange} />
        </div>

        {loading && history.length === 0 ? (
          <div className="chart-placeholder">Generando simulación…</div>
        ) : (
          <div className="charts-grid">
            {AGRICULTURE_METRICS.map((config) => (
              <HistoryChart key={config.key} config={config} data={history} />
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
