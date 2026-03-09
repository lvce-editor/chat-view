import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { parseRenderHtmlArguments } from '../ParseRenderHtmlArguments/ParseRenderHtmlArguments.ts'

export const getRenderHtmlCss = (sessions: readonly ChatSession[], selectedSessionId: string): string => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  if (!selectedSession) {
    return ''
  }

  const cssRules = new Set<string>()

  for (const message of selectedSession.messages) {
    if (message.role !== 'assistant' || !message.toolCalls) {
      continue
    }
    for (const toolCall of message.toolCalls) {
      if (toolCall.name !== 'render_html') {
        continue
      }
      const parsed = parseRenderHtmlArguments(toolCall.arguments)
      if (!parsed || !parsed.css.trim()) {
        continue
      }
      cssRules.add(parsed.css)
    }
  }

  return Array.from(cssRules).join('\n\n')
}
