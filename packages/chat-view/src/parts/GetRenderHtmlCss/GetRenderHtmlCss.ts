import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

export const getRenderHtmlCss = (sessions: readonly ChatSession[], selectedSessionId: string): string => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  if (!selectedSession) {
    return ''
  }

  const cssRules = new Set<string>()

  for (const message of selectedSession.messages) {
    if (message.role !== 'assistant') {
      continue
    }

    const nodes = parseMessageContent(message.text)
    for (const node of nodes) {
      if (node.type !== 'custom-ui' || !node.css.trim()) {
        continue
      }
      cssRules.add(node.css)
    }
  }

  return [...cssRules].join('\n\n')
}
