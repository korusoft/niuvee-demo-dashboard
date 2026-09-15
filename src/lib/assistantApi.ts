export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function postChat(messages: ChatMessage[], pageContext: string | null): Promise<string> {
  const res = await fetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, pageContext }),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return body.reply as string
}
