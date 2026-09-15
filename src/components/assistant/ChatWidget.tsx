import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAssistant } from '../../context/AssistantContext'
import { CloseIcon, RobotIcon, SendIcon, TrashIcon } from '../layout/icons'

const SUGGESTIONS = [
  'Picos de CO₂ hoy',
  'Resumen de consumo de energía',
  'Recomendaciones SG-SST',
  'Condiciones del cultivo',
  'Tensión y corriente ahora',
]

export function ChatWidget() {
  const location = useLocation()
  const { messages, sending, error, send, clear } = useAssistant()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')

  if (location.pathname === '/asistente') return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    send(draft)
    setDraft('')
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel__header">
            <span>Asistente Niuvee</span>
            <div className="chat-panel__header-actions">
              {messages.length > 0 && (
                <button
                  className="chat-panel__close"
                  onClick={clear}
                  aria-label="Limpiar conversación"
                  title="Limpiar conversación"
                >
                  <TrashIcon size={15} />
                </button>
              )}
              <button className="chat-panel__close" onClick={() => setOpen(false)} aria-label="Cerrar asistente">
                <CloseIcon size={16} />
              </button>
            </div>
          </div>

          <div className="chat-panel__body">
            {messages.length === 0 && (
              <div className="chat-suggestions">
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

          <form className="chat-panel__input" onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Pregunta sobre tus métricas…"
              maxLength={500}
            />
            <button type="submit" aria-label="Enviar" disabled={sending || !draft.trim()}>
              <SendIcon size={16} />
            </button>
          </form>
        </div>
      )}

      <div className="chat-widget__launcher-row">
        {!open && <span className="chat-widget__label">Agente IA!</span>}
        <button className="chat-widget__launcher" onClick={() => setOpen((v) => !v)} aria-label="Abrir asistente">
          <RobotIcon size={24} />
        </button>
      </div>
    </div>
  )
}
