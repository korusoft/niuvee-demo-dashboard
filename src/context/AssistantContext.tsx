import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { postChat, type ChatMessage } from '../lib/assistantApi'

interface ChatEntry extends ChatMessage {
  id: string
}

interface AssistantState {
  messages: ChatEntry[]
  sending: boolean
  error: string | null
  send: (text: string) => void
  clear: () => void
}

const AssistantContext = createContext<AssistantState | null>(null)

const PAGE_CONTEXT_BY_PATH: Record<string, string> = {
  '/sgsst': 'sgsst',
  '/energia': 'energia',
  '/agricultura': 'agricultura',
}

function nextId() {
  return Math.random().toString(36).slice(2)
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatEntry[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || sending) return

      const userEntry: ChatEntry = { id: nextId(), role: 'user', content: trimmed }
      const history = [...messages, userEntry]
      setMessages(history)
      setSending(true)
      setError(null)

      const pageContext = PAGE_CONTEXT_BY_PATH[location.pathname] ?? null

      postChat(
        history.map(({ role, content }) => ({ role, content })),
        pageContext
      )
        .then((reply) => {
          setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }])
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Error desconocido')
        })
        .finally(() => setSending(false))
    },
    [messages, sending, location.pathname]
  )

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const value = useMemo(
    () => ({ messages, sending, error, send, clear }),
    [messages, sending, error, send, clear]
  )

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export function useAssistant() {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error('useAssistant debe usarse dentro de AssistantProvider')
  return ctx
}
