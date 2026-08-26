import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSessionPreservingMessages } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { getCommandHelpText } from '../GetCommandHelpText/GetCommandHelpText.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { clearSlashCommands, registerSlashCommand } from '../SlashCommandRegistry/SlashCommandRegistry.ts'
import { toMarkdownTranscript } from '../ToMarkdownTranscript/ToMarkdownTranscript.ts'
import { withClearedComposer } from '../WithClearedComposer/WithClearedComposer.ts'

const appendAssistantMessage = async (state: ChatState, assistantText: string): Promise<ChatState> => {
  const assistantMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    text: assistantText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
  const parsedMessages = await parseAndStoreMessageContent(state.parsedMessages, assistantMessage)
  const messages = [...state.messages, assistantMessage]
  const updatedSessions = state.sessions.map((session) => {
    if (session.id !== state.selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: [],
      status: 'finished' as const,
    }
  })
  const updatedSelectedSession = updatedSessions.find((session) => session.id === state.selectedSessionId)
  if (updatedSelectedSession) {
    await saveChatSessionPreservingMessages(updatedSelectedSession, messages)
  }
  return withClearedComposer({
    ...state,
    messages,
    parsedMessages,
    sessions: updatedSessions,
  })
}

export const registerSlashCommands = (): void => {
  clearSlashCommands()
  registerSlashCommand('new', async (state) => {
    const nextState = await createSession(state)
    return withClearedComposer({
      ...nextState,
      viewMode: 'detail',
    })
  })

  registerSlashCommand('clear', async (state) => {
    const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
    if (!selectedSession) {
      return withClearedComposer(state)
    }
    const updatedSessions = state.sessions.map((session) => {
      if (session.id !== state.selectedSessionId) {
        return session
      }
      return {
        ...session,
        messages: [],
        status: 'idle' as const,
      }
    })
    const updatedSelectedSession = updatedSessions.find((session) => session.id === state.selectedSessionId)
    if (updatedSelectedSession) {
      await saveChatSessionPreservingMessages(updatedSelectedSession, [])
    }
    return withClearedComposer({
      ...state,
      messages: [],
      sessions: updatedSessions,
    })
  })

  registerSlashCommand('help', async (state) => {
    return appendAssistantMessage(state, getCommandHelpText())
  })

  registerSlashCommand('export', async (state) => {
    const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
    if (!selectedSession) {
      return withClearedComposer(state)
    }
    const assistantText = ['```md', toMarkdownTranscript({ ...selectedSession, messages: state.messages }), '```'].join('\n')
    return appendAssistantMessage(state, assistantText)
  })
}
