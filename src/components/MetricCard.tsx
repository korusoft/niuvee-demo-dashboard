import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import type { HistoryPoint } from '../lib/api'
import type { MetricConfig } from '../lib/thresholds'
import { StatusBadge } from './StatusBadge'

interface Props {
  config: MetricConfig
  value: number | null
  history: HistoryPoint[]
}

export function MetricCard({ config, value, history }: Props) {
  const status = value != null ? config.evaluate(value) : null
  const sparkData = history.map((p) => ({ v: p[config.key] }))
  const seriesColor = `var(--series-${config.key})`

  return (
    <div className="metric-card">
      <div className="metric-card__top">
        <span className="metric-card__label">{config.label}</span>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="metric-card__value-row">
        <span className="metric-card__value">
          {value != null ? value.toFixed(config.decimals) : '—'}
        </span>
        <span className="metric-card__unit">{config.unit}</span>
      </div>

      <div className="metric-card__spark">
        {sparkData.length > 1 && (
          <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={sparkData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${config.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={seriesColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={seriesColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={seriesColor}
                strokeWidth={2}
                fill={`url(#spark-${config.key})`}
                isAnimationActive={false}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="metric-card__sgsst">{config.sgsst}</p>
    </div>
  )
}
