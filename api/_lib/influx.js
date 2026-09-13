import { InfluxDB } from '@influxdata/influxdb-client'

const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
export const bucket = process.env.INFLUX_BUCKET || 'env_monitor'

const client = url && token ? new InfluxDB({ url, token }) : null
export const queryApi = client && org ? client.getQueryApi(org) : null

export const MEASUREMENT = 'environment'
export const FIELDS = ['temperature', 'humidity', 'co2']
export const FIELD_FILTER = FIELDS.map((f) => `r._field == "${f}"`).join(' or ')

export const RANGE_PRESETS = {
  '1h': { start: '-1h', every: '1m' },
  '6h': { start: '-6h', every: '5m' },
  '24h': { start: '-24h', every: '15m' },
  '7d': { start: '-7d', every: '1h' },
}
