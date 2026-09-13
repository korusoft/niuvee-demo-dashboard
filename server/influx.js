import { InfluxDB } from '@influxdata/influxdb-client'

const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
export const bucket = process.env.INFLUX_BUCKET || 'env_monitor'

if (!url || !token || !org) {
  console.warn(
    '[influx] Missing INFLUX_URL / INFLUX_TOKEN / INFLUX_ORG env vars — API will return errors until configured.'
  )
}

const client = url && token ? new InfluxDB({ url, token }) : null

export const queryApi = client && org ? client.getQueryApi(org) : null

export function isConfigured() {
  return Boolean(queryApi)
}
