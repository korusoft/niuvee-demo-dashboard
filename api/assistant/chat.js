import { isConfigured as isGroqConfigured, runAssistant } from '../_lib/groq.js'
import { TOOLS, TOOL_IMPLEMENTATIONS } from '../_lib/assistantTools.js'

const PAGE_CONTEXT_LABELS = { sgsst: 'SG-SST', energia: 'Energía', agricultura: 'Agricultura' }
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 15
const rateLimitHits = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const hits = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  hits.push(now)
  rateLimitHits.set(ip, hits)
  return hits.length <= RATE_LIMIT_MAX
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!isGroqConfigured()) {
    return res.status(503).json({ error: 'Asistente no configurado (falta GROQ_API_KEY)' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes, intenta de nuevo en unos minutos.' })
  }

  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : []
  const messages = rawMessages
    .slice(-12)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }))

  if (messages.length === 0) {
    return res.status(400).json({ error: 'No se recibió ningún mensaje.' })
  }

  const pageContext = PAGE_CONTEXT_LABELS[req.body?.pageContext] ?? null

  try {
    const reply = await runAssistant({ messages, pageContext, tools: TOOLS, toolImplementations: TOOL_IMPLEMENTATIONS })
    res.status(200).json({ reply })
  } catch (err) {
    console.error('[api/assistant/chat] failed:', err.message)
    res.status(502).json({ error: 'No se pudo obtener respuesta del asistente.' })
  }
}
