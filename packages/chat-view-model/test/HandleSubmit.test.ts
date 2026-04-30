/* cspell:ignore worktree worktrees */

/* cspell:ignore worktree worktrees */

import { expect, test } from '@jest/globals'
import type { ChatMessage } from '../src/parts/ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../src/parts/ChatSession/ChatSession.ts'
import type { HandleSubmitDependencies, HandleSubmitState } from '../src/parts/HandleSubmit/HandleSubmit.ts'
import { handleSubmit } from '../src/parts/HandleSubmit/HandleSubmit.ts'

const createState = (): HandleSubmitState => {
  return {
    agentMode: 'agent',
    aiSessionTitleGenerationEnabled: false,
    assetDir: '/tmp/assets',
    authAccessToken: '',
    authEnabled: false,
    backendUrl: '',
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    composerAttachments: [
      {
        attachmentId: 'attachment-1',
        displayType: 'text-file',
        mimeType: 'text/plain',
        name: 'notes.txt',
        size: 12,
        textContent: 'hello from file',
      },
    ],
    composerAttachmentsHeight: 34,
    composerHeight: 40,
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: 'hello',
    emitStreamingFunctionCallEvents: false,
    focus: 'composer',
    focused: true,
    inputSource: 'user',
    lastSubmittedSessionId: '',
    maxToolCalls: 10,
    messagesAutoScrollEnabled: true,
    messagesScrollTop: 0,
    mockAiResponseDelay: 0,
    mockApiCommandId: '',
    mockOpenApiRequests: [],
    models: [{ id: 'model-1', name: 'Model 1' }],
    nextMessageId: 1,
    openApiApiBaseUrl: '',
    openApiApiKey: '',
    openRouterApiBaseUrl: '',
    openRouterApiKey: '',
    parsedMessages: [],
    passIncludeObfuscation: false,
    platform: 0,
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    reasoningEffort: 'medium',
    runMode: 'local',
    selectedModelId: 'model-1',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    streamingEnabled: false,
    systemPrompt: '',
    toolEnablement: {},
    uid: 1,
    useChatCoordinatorWorker: false,
    useChatNetworkWorkerForRequests: false,
    useChatToolWorker: false,
    useMockApi: false,
    useOwnBackend: false,
    viewMode: 'detail',
    webSearchEnabled: false,
  }
}

const appendMessageToSelectedSession = (sessions: readonly ChatSession[], sessionId: string, message: ChatMessage): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== sessionId) {
      return session
    }
    return {
      ...session,
      messages: [...session.messages, message],
    }
  })
}

const createDependencies = (): HandleSubmitDependencies<HandleSubmitState> => {
  return {
    appendChatViewEvent: async (): Promise<void> => {},
    appendMessageToSelectedSession,
    createBackgroundChatWorktree: async (): Promise<{ readonly branchName: string; readonly workspaceUri: string }> => ({
      branchName: 'main',
      workspaceUri: 'file:///workspace',
    }),
    executeSlashCommand: async (state) => state,
    focusInput: (state) => ({ ...state, focus: 'composer', focused: true }),
    generateSessionId: () => 'session-2',
    getAiResponse: async () => ({
      id: 'assistant-final',
      role: 'assistant',
      text: 'Mock AI response: I received "hello".',
      time: '10:01',
    }),
    getAiSessionTitle: async () => '',
    getChatSession: async () => undefined,
    getChatSessionStatus: (session) => session.status || 'idle',
    getComposerAttachments: async () => [],
    getMentionContextMessage: async () => undefined,
    getMinComposerHeightForState: () => 40,
    getNextAutoScrollTop: (messagesScrollTop) => messagesScrollTop + 1,
    getSlashCommand: () => undefined,
    getSseEventType: () => 'sse-response-part',
    getStatusBarState: () => undefined,
    getSystemPromptForAgentMode: (systemPrompt) => systemPrompt,
    getWorkspacePath: async () => 'file:///workspace',
    handleTextChunkFunction: async (_uid, _sessionId, _messageId, _chunk, state) => state,
    handleToolCallsChunkFunction: async (_uid, _sessionId, _messageId, _toolCalls, state) => state,
    isDefaultSessionTitle: () => true,
    isStreamingFunctionCallEvent: () => false,
    parseAndStoreMessageContent: async (parsedMessages, message) => [...parsedMessages, { id: message.id, parsedContent: [], text: message.text }],
    rerender: async (): Promise<void> => {},
    saveChatSession: async (_session): Promise<void> => {},
    setStatusBarState: (_uid, _oldState, _newState): void => {},
    syncBackendAuth: async (): Promise<undefined> => undefined,
    updateMessageTextInSelectedSession: async (sessions, parsedMessages, sessionId, messageId, text) => ({
      parsedMessages: [...parsedMessages, { id: messageId, parsedContent: [], text }],
      sessions: sessions.map((session) => {
        if (session.id !== sessionId) {
          return session
        }
        return {
          ...session,
          messages: session.messages.map((message) => {
            if (message.id !== messageId) {
              return message
            }
            return {
              ...message,
              inProgress: false,
              text,
            }
          }),
        }
      }),
    }),
    updateSessionTitle: (sessions, sessionId, title) => sessions.map((session) => (session.id === sessionId ? { ...session, title } : session)),
    withUpdatedChatInputHistory: (state, userText) => ({
      ...state,
      chatInputHistory: state.chatInputHistory.at(-1) === userText ? state.chatInputHistory : [...state.chatInputHistory, userText],
      chatInputHistoryIndex: -1,
    }),
  }
}

test('handleSubmit should add a user message from composer value', async () => {
  const state = createState()
  const dependencies = createDependencies()

  const result = await handleSubmit(state, dependencies)

  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].role).toBe('user')
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.sessions[0].messages[1].text).toBe('Mock AI response: I received "hello".')
  expect(result.composerValue).toBe('')
  expect(result.chatInputHistory).toEqual(['hello'])
  expect(result.chatInputHistoryIndex).toBe(-1)
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
})

test('handleSubmit should create a new session and switch to detail mode from list mode', async () => {
  const state: HandleSubmitState = {
    ...createState(),
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    viewMode: 'list',
  }
  const dependencies = createDependencies()

  const result = await handleSubmit(state, dependencies)

  expect(result.sessions).toHaveLength(2)
  expect(result.selectedSessionId).toBe('session-2')
  expect(result.viewMode).toBe('detail')
  expect(result.lastSubmittedSessionId).toBe('session-2')
  expect(result.sessions[1].messages[0].text).toBe('hello')
  expect(result.sessions[1].status).toBe('finished')
})

test('handleSubmit should ignore blank composer value', async () => {
  const state = { ...createState(), composerValue: '   ' }
  const dependencies = createDependencies()

  const result = await handleSubmit(state, dependencies)

  expect(result).toBe(state)
})
