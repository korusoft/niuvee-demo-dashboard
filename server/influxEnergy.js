import { InfluxDB } from '@influxdata/influxdb-client'

const url = process.env.INFLUX_ENERGY_URL
const token = process.env.INFLUX_ENERGY_TOKEN
const org = process.env.INFLUX_ENERGY_ORG
export const bucket = process.env.INFLUX_ENERGY_BUCKET || 'energy_monitor'

const client = url && token ? new InfluxDB({ url, token }) : null

export const queryApi = client && org ? client.getQueryApi(org) : null

export function isConfigured() {
  return Boolean(queryApi)
}

export const MEASUREMENT = 'Server'
export const FIELDS = ['Consumo_total']
// Maps real Influx field names to the app-facing keys used by the frontend.
export const FIELD_ALIASES = { Consumo_total: 'power' }
