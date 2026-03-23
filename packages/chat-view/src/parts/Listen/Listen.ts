import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatState } from '../ChatState/ChatState.ts'
import { appendMessageToSelectedSession } from '../AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { clearSlashCommands, registerSlashCommand } from '../SlashCommandRegistry/SlashCommandRegistry.ts'
import { getCommandHelpText } from '../GetCommandHelpText/GetCommandHelpText.ts'
import { initializeChatCoordinatorWorker } from '../InitializeChatCoordinatorWorker/InitializeChatCoordinatorWorker.ts'
import { initializeChatMathWorker } from '../InitializeChatMathWorker/InitializeChatMathWorker.ts'
import { initializeChatNetworkWorker } from '../InitializeChatNetworkWorker/InitializeChatNetworkWorker.ts'
import { initializeChatStorageWorker } from '../InitializeChatStorageWorker/InitializeChatStorageWorker.ts'
import { initializeChatToolWorker } from '../InitializeChatToolWorker/InitializeChatToolWorker.ts'
import { initializeClipBoardWorker } from '../InitializeClipBoardWorker/InitializeClipBoardWorker.ts'
import { initializeOpenerWorker } from '../InitializeOpenerWorker/InitializeOpenerWorker.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { registerCommands } from '../StatusBarStates/StatusBarStates.ts'
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
  const updatedSessions = appendMessageToSelectedSession(state.sessions, state.selectedSessionId, assistantMessage)
  const updatedSelectedSession = updatedSessions.find((session) => session.id === state.selectedSessionId)
  if (updatedSelectedSession) {
    await saveChatSession(updatedSelectedSession)
  }
  return withClearedComposer({
    ...state,
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
      }
    })
    const updatedSelectedSession = updatedSessions.find((session) => session.id === state.selectedSessionId)
    if (updatedSelectedSession) {
      await saveChatSession(updatedSelectedSession)
    }
    return withClearedComposer({
      ...state,
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
    const assistantText = ['```md', toMarkdownTranscript(selectedSession), '```'].join('\n')
    return appendAssistantMessage(state, assistantText)
  })
}

export const listen = async (): Promise<void> => {
  registerSlashCommands()
  registerCommands(CommandMap.commandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)
  await Promise.all([
    initializeChatCoordinatorWorker(),
    initializeChatMathWorker(),
    initializeChatNetworkWorker(),
    initializeChatStorageWorker(),
    initializeChatToolWorker(),
    initializeClipBoardWorker(),
    initializeOpenerWorker(),
  ])
}
