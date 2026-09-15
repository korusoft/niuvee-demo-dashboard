import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HistoryPoint } from '../lib/api'
import type { MetricConfig } from '../lib/sgsstMetrics'

interface Props {
  config: MetricConfig
  data: HistoryPoint[]
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

function ChartTooltip({ active, payload, config }: any) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  const value = point.value
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__time">{formatTime(point.payload.time)}</div>
      <div className="chart-tooltip__row">
        <span className="chart-tooltip__key" style={{ background: `var(--series-${config.key})` }} />
        <span className="chart-tooltip__value">
          {value != null ? value.toFixed(config.decimals) : '—'} {config.unit}
        </span>
      </div>
    </div>
  )
}

export function HistoryChart({ config, data }: Props) {
  const seriesColor = `var(--series-${config.key})`

  return (
    <div className="history-chart">
      <div className="history-chart__title">
        {config.label} {config.unit && <span className="history-chart__unit">({config.unit})</span>}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id={`fill-${config.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={seriesColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={seriesColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--gridline)" vertical={false} strokeDasharray="0" />
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            stroke="var(--baseline)"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            tickLine={false}
            minTickGap={32}
          />
          <YAxis
            stroke="var(--baseline)"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            tickLine={false}
            width={44}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<ChartTooltip config={config} />} cursor={{ stroke: 'var(--baseline)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey={config.key}
            stroke={seriesColor}
            strokeWidth={2}
            fill={`url(#fill-${config.key})`}
            isAnimationActive={false}
            connectNulls
            dot={false}
            activeDot={{ r: 4, fill: seriesColor, stroke: 'var(--surface-1)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
