import { useState, type FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { AdminLayout } from '../components/layout/AdminLayout'
import { SendIcon, TrashIcon } from '../components/layout/icons'
import { useAssistant } from '../context/AssistantContext'
import type { Theme } from '../hooks/useTheme'

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

const SUGGESTIONS = [
  'Picos de temperatura y CO₂ en las últimas 24h',
  'Resumen de consumo de energía',
  'Recomendaciones SG-SST',
  'Condiciones del cultivo',
  'Tensión y factor de potencia',
  'Tendencia de humedad relativa',
]

export default function AssistantPage({ theme, onToggleTheme }: Props) {
  const { messages, sending, error, send, clear } = useAssistant()
  const [draft, setDraft] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    send(draft)
    setDraft('')
  }

  return (
    <AdminLayout
      title="Asistente"
      subtitle="Consultas sobre tus métricas"
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
      <div className="assistant-page">
        {messages.length > 0 && (
          <div className="assistant-page__toolbar">
            <button className="assistant-page__clear" onClick={clear}>
              <TrashIcon size={14} />
              Limpiar conversación
            </button>
          </div>
        )}

        <div className="assistant-page__transcript">
          {messages.length === 0 && (
            <div className="chat-suggestions chat-suggestions--page">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble chat-bubble--${m.role}`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          ))}
          {sending && <div className="chat-bubble chat-bubble--assistant chat-bubble--loading">Pensando…</div>}
          {error && <div className="chat-error">{error}</div>}
        </div>

        <form className="assistant-page__input" onSubmit={handleSubmit}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Pregunta sobre tus métricas…"
            maxLength={500}
          />
          <button type="submit" disabled={sending || !draft.trim()}>
            <SendIcon size={16} />
            Enviar
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
