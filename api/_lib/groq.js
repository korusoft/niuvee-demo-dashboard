const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'openai/gpt-oss-120b'
const MAX_TOOL_ROUNDS = 3

const SYSTEM_PROMPT = `Eres el asistente de datos del dashboard de monitoreo IoT de Niuvee.

Reglas estrictas:
- Solo puedes responder usando los resultados de las funciones disponibles (get_environment_summary, get_energy_summary, get_agriculture_summary, get_sgsst_recommendations). Nunca inventes cifras, fechas ni tendencias que no vengan de esas funciones.
- Nunca generes código, consultas Flux/SQL, fórmulas ni scripts. Si la pregunta requiere eso, dilo explícitamente y ofrece en su lugar una respuesta con las funciones disponibles.
- Si la pregunta no puede responderse con las funciones disponibles, dilo con claridad y sugiere qué sí puedes consultar: picos y promedios de temperatura/humedad/CO2, consumo eléctrico (potencia, tensión, corriente, frecuencia, factor de potencia), condiciones de cultivo, o recomendaciones SG-SST.
- Responde siempre en español, de forma breve y concreta, citando las cifras relevantes (con su unidad) que te devuelvan las funciones.
- Las horas que devuelven las funciones ya están en hora local de Colombia (Sabaneta), en formato de 24 horas con dos dígitos (HH:MM, ej. "06:15", "14:00"). Cítalas exactamente así, sin convertirlas a formato de 12 horas, sin agregar a.m./p.m. y sin agregar "UTC".
- Si el usuario no especifica un rango de tiempo, usa "6h" por defecto.`

export function isConfigured() {
  return Boolean(process.env.GROQ_API_KEY)
}

async function callGroq(messages, tools) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, tools, tool_choice: 'auto', temperature: 0.2 }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Groq API error ${res.status}: ${text.slice(0, 300)}`)
  }

  return res.json()
}

export async function runAssistant({ messages, pageContext, tools, toolImplementations }) {
  const systemContent = pageContext
    ? `${SYSTEM_PROMPT}\n\nEl usuario está viendo actualmente el dashboard de ${pageContext}.`
    : SYSTEM_PROMPT

  const conversation = [{ role: 'system', content: systemContent }, ...messages]

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const data = await callGroq(conversation, tools)
    const message = data.choices?.[0]?.message
    if (!message) throw new Error('Respuesta inválida de Groq')

    if (message.tool_calls?.length) {
      conversation.push(message)
      for (const call of message.tool_calls) {
        const impl = toolImplementations[call.function.name]
        let result
        try {
          const args = call.function.arguments ? JSON.parse(call.function.arguments) : {}
          result = impl ? await impl(args) : { error: `Función desconocida: ${call.function.name}` }
        } catch (err) {
          result = { error: err.message }
        }
        conversation.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
      }
      continue
    }

    return message.content ?? ''
  }

  throw new Error('El asistente no pudo completar la respuesta (demasiadas llamadas a funciones).')
}
