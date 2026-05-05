import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker, ChatMessageParsingWorker, ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeState } from '../src/parts/PrototypeState/PrototypeState.ts'
import { rpcIdViewModel } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { handleRpcSubmit } from '../src/parts/HandleRpcSubmit/HandleRpcSubmit.ts'
import { handleChatStorageUpdate } from '../src/parts/HandleStorageUpdate/HandleStorageUpdate.ts'
import * as MockBackendAuth from '../src/parts/MockBackendAuth/MockBackendAuth.ts'
import { setState } from '../src/parts/ModelState/ModelState.ts'

const createState = (): PrototypeState => {
  return {
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    composerValue: 'hello from e2e',
    focus: 'composer',
    focused: true,
    parsedMessages: [],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    selectedModelId: 'test',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' }],
    systemPrompt: '',
    uid: 1,
    viewMode: 'list',
  }
}

test('handleRpcSubmit should create a session, subscribe to storage updates and delegate to coordinator', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async (id: string) => ({
      id,
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        {
          id: 'message-2',
          role: 'assistant',
          text: 'OpenAI API key is not configured. Enter your OpenAI API key below and click Save.',
          time: '10:01',
        },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    }),
    'ChatStorage.listSessions': async () => [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' }],
    'ChatStorage.setSession': async () => {},
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }], [{ type: 'text' }]],
  })
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
  })
  const state = { ...createState(), selectedModelId: 'model-1' }

  const result = await handleRpcSubmit(state)

  expect(result.composerValue).toBe('')
  expect(result.viewMode).toBe('detail')
  expect(result.chatInputHistory).toEqual(['hello from e2e'])
  expect(result.lastSubmittedSessionId).toBe(result.selectedSessionId)
  expect(result.selectedSessionId).not.toBe('session-1')
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' },
    {
      id: result.selectedSessionId,
      lastActiveTime: '10:01',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        {
          id: 'message-2',
          role: 'assistant',
          text: 'OpenAI API key is not configured. Enter your OpenAI API key below and click Save.',
          time: '10:01',
        },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    },
  ])
  expect(result.parsedMessages).toEqual([
    {
      id: 'message-1',
      parsedContent: [{ type: 'text' }],
      text: 'hello from e2e',
    },
    {
      id: 'message-2',
      parsedContent: [{ type: 'text' }],
      text: 'OpenAI API key is not configured. Enter your OpenAI API key below and click Save.',
    },
  ])
  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', { id: result.selectedSessionId, messages: [], projectId: 'project-1', status: 'in-progress', title: 'Chat 2' }],
    ['ChatStorage.subscribeSessionUpdates', { rpcId: rpcIdViewModel, sessionId: result.selectedSessionId, type: 'session', uid: 1 }],
    ['ChatStorage.listSessions'],
    ['ChatStorage.getSession', result.selectedSessionId],
  ])
  expect(mockParsingRpc.invocations).toEqual([
    [
      'ChatMessageParsing.parseMessageContents',
      ['hello from e2e', 'OpenAI API key is not configured. Enter your OpenAI API key below and click Save.'],
    ],
  ])
  expect(mockCoordinatorRpc.invocations).toEqual([
    [
      'ChatCoordinator.handleSubmit',
      {
        attachments: [],
        authAccessToken: '',
        backendUrl: '',
        id: expect.any(String),
        modelId: 'model-1',
        openAiKey: '',
        requestId: expect.any(String),
        role: 'user',
        sessionId: result.selectedSessionId,
        systemPrompt: '',
        text: 'hello from e2e',
        useOwnBackend: false,
      },
    ],
  ])
})

test('handleRpcSubmit should rehydrate persisted messages immediately for the test model', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async (id: string) => ({
      id,
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        { id: 'message-2', role: 'assistant', text: 'Mock AI response: I received "hello from e2e".', time: '10:01' },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    }),
    'ChatStorage.listSessions': async () => [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' }],
    'ChatStorage.setSession': async () => {},
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }], [{ type: 'text' }]],
  })
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
    'ChatCoordinator.registerMockResponse': async () => {},
  })
  const state = createState()

  const result = await handleRpcSubmit(state)

  expect(result.composerValue).toBe('')
  expect(result.lastSubmittedSessionId).toBe(result.selectedSessionId)
  expect(result.viewMode).toBe('detail')
  expect(result.parsedMessages).toEqual([
    {
      id: 'message-1',
      parsedContent: [{ type: 'text' }],
      text: 'hello from e2e',
    },
    {
      id: 'message-2',
      parsedContent: [{ type: 'text' }],
      text: 'Mock AI response: I received "hello from e2e".',
    },
  ])
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' },
    {
      id: result.selectedSessionId,
      lastActiveTime: '10:01',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        { id: 'message-2', role: 'assistant', text: 'Mock AI response: I received "hello from e2e".', time: '10:01' },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    },
  ])
  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', { id: result.selectedSessionId, messages: [], projectId: 'project-1', status: 'in-progress', title: 'Chat 2' }],
    ['ChatStorage.subscribeSessionUpdates', { rpcId: rpcIdViewModel, sessionId: result.selectedSessionId, type: 'session', uid: 1 }],
    ['ChatStorage.listSessions'],
    ['ChatStorage.getSession', result.selectedSessionId],
  ])
  expect(mockParsingRpc.invocations).toEqual([
    ['ChatMessageParsing.parseMessageContents', ['hello from e2e', 'Mock AI response: I received "hello from e2e".']],
  ])
  expect(mockCoordinatorRpc.invocations).toEqual([
    ['ChatCoordinator.registerMockResponse', { text: 'Mock AI response: I received "hello from e2e".' }],
    [
      'ChatCoordinator.handleSubmit',
      {
        attachments: [],
        authAccessToken: '',
        backendUrl: '',
        id: expect.any(String),
        modelId: 'test',
        openAiKey: '',
        requestId: expect.any(String),
        role: 'user',
        sessionId: result.selectedSessionId,
        systemPrompt: '',
        text: 'hello from e2e',
        useOwnBackend: false,
      },
    ],
  ])
})

test('handleRpcSubmit should forward composer attachments to coordinator', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async (id: string) => ({
      id,
      messages: [{ id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' }],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    }),
    'ChatStorage.listSessions': async () => [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' }],
    'ChatStorage.setSession': async () => {},
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }]],
  })
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
  })
  const state = {
    ...createState(),
    composerAttachments: [{ attachmentId: 'attachment-1', name: 'notes.txt' }],
    selectedModelId: 'model-1',
  }

  await handleRpcSubmit(state)

  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', expect.any(Object)],
    ['ChatStorage.subscribeSessionUpdates', expect.any(Object)],
    ['ChatStorage.listSessions'],
    ['ChatStorage.getSession', expect.any(String)],
  ])
  expect(mockParsingRpc.invocations).toEqual([['ChatMessageParsing.parseMessageContents', ['hello from e2e']]])
  expect(mockCoordinatorRpc.invocations).toEqual([
    [
      'ChatCoordinator.handleSubmit',
      {
        attachments: [{ attachmentId: 'attachment-1', name: 'notes.txt' }],
        authAccessToken: '',
        backendUrl: '',
        id: expect.any(String),
        modelId: 'model-1',
        openAiKey: '',
        requestId: expect.any(String),
        role: 'user',
        sessionId: expect.any(String),
        systemPrompt: '',
        text: 'hello from e2e',
        useOwnBackend: false,
      },
    ],
  ])
})

test('handleRpcSubmit should route useMockApi submissions through the coordinator test model', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async (id: string) => ({
      id,
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        { id: 'message-2', role: 'assistant', text: '[API](https://example.com/query(arg))', time: '10:01' },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    }),
    'ChatStorage.listSessions': async () => [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' }],
    'ChatStorage.setSession': async () => {},
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }], [{ type: 'text' }]],
  })
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
  })
  const state = {
    ...createState(),
    selectedModelId: 'openapi/gpt-4.1-mini',
    useMockApi: true,
  }

  const result = await handleRpcSubmit(state)

  expect(result.viewMode).toBe('detail')
  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', { id: result.selectedSessionId, messages: [], projectId: 'project-1', status: 'in-progress', title: 'Chat 2' }],
    ['ChatStorage.subscribeSessionUpdates', { rpcId: rpcIdViewModel, sessionId: result.selectedSessionId, type: 'session', uid: 1 }],
    ['ChatStorage.listSessions'],
    ['ChatStorage.getSession', result.selectedSessionId],
  ])
  expect(mockParsingRpc.invocations).toEqual([
    ['ChatMessageParsing.parseMessageContents', ['hello from e2e', '[API](https://example.com/query(arg))']],
  ])
  expect(mockCoordinatorRpc.invocations).toEqual([
    [
      'ChatCoordinator.handleSubmit',
      {
        attachments: [],
        authAccessToken: '',
        backendUrl: '',
        id: expect.any(String),
        modelId: 'test',
        openAiKey: '',
        requestId: expect.any(String),
        role: 'user',
        sessionId: result.selectedSessionId,
        systemPrompt: '',
        text: 'hello from e2e',
        useOwnBackend: false,
      },
    ],
  ])
})

test('handleRpcSubmit should sync backend auth and submit own-backend requests through coordinator', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async (id: string) => ({
      id,
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        {
          id: 'message-2',
          role: 'assistant',
          text: 'Backend completion request failed. Unexpected backend response format: no assistant text or tool calls were returned.',
          time: '10:01',
        },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    }),
    'ChatStorage.listSessions': async () => [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' }],
    'ChatStorage.setSession': async () => {},
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }], [{ type: 'text' }]],
  })
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
  })
  const state = {
    ...createState(),
    backendUrl: 'https://backend.example.com',
    selectedModelId: 'openapi/gpt-4.1-mini',
    useOwnBackend: true,
  }
  MockBackendAuth.setNextRefreshResponse({
    delay: 0,
    response: {
      accessToken: 'backend-token',
      userName: 'Test',
    },
    type: 'success',
  })
  setState(1, state)

  const result = await handleRpcSubmit(state)

  expect(result.viewMode).toBe('detail')
  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', { id: result.selectedSessionId, messages: [], projectId: 'project-1', status: 'in-progress', title: 'Chat 2' }],
    ['ChatStorage.subscribeSessionUpdates', { rpcId: rpcIdViewModel, sessionId: result.selectedSessionId, type: 'session', uid: 1 }],
    ['ChatStorage.listSessions'],
    ['ChatStorage.getSession', result.selectedSessionId],
  ])
  expect(mockParsingRpc.invocations).toEqual([
    [
      'ChatMessageParsing.parseMessageContents',
      ['hello from e2e', 'Backend completion request failed. Unexpected backend response format: no assistant text or tool calls were returned.'],
    ],
  ])
  expect(mockCoordinatorRpc.invocations).toEqual([
    [
      'ChatCoordinator.handleSubmit',
      {
        attachments: [],
        authAccessToken: 'backend-token',
        backendUrl: 'https://backend.example.com',
        id: expect.any(String),
        modelId: 'openapi/gpt-4.1-mini',
        openAiKey: '',
        requestId: expect.any(String),
        role: 'user',
        sessionId: result.selectedSessionId,
        systemPrompt: '',
        text: 'hello from e2e',
        useOwnBackend: true,
      },
    ],
  ])
})

test('handleChatStorageUpdate should reload session state from storage and notify chat view', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async () => ({
      id: 'session-1',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
        { id: 'message-2', role: 'assistant', text: 'Mock AI response: I received "hello from e2e".', time: '10:01' },
      ],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 1',
    }),
    'ChatStorage.listSessions': async () => [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'finished', title: 'Chat 1' }],
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }], [{ type: 'text' }]],
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.applyViewModelState': async () => {},
    'Chat.rerender': async () => {},
  })
  const state = {
    ...createState(),
    composerValue: '',
    lastSubmittedSessionId: 'session-1',
    selectedSessionId: 'session-1',
    viewMode: 'list' as const,
  }
  setState(1, state)

  await handleChatStorageUpdate(1, 'session-1')

  expect(mockStorageRpc.invocations).toEqual([['ChatStorage.listSessions'], ['ChatStorage.getSession', 'session-1']])
  expect(mockParsingRpc.invocations).toEqual([
    ['ChatMessageParsing.parseMessageContents', ['hello from e2e', 'Mock AI response: I received "hello from e2e".']],
  ])
  expect(mockRendererRpc.invocations).toEqual([
    [
      'Chat.applyViewModelState',
      1,
      {
        ...state,
        parsedMessages: [
          {
            id: 'message-1',
            parsedContent: [{ type: 'text' }],
            text: 'hello from e2e',
          },
          {
            id: 'message-2',
            parsedContent: [{ type: 'text' }],
            text: 'Mock AI response: I received "hello from e2e".',
          },
        ],
        selectedSessionId: 'session-1',
        sessions: [
          {
            id: 'session-1',
            lastActiveTime: '10:01',
            messages: [
              { id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' },
              { id: 'message-2', role: 'assistant', text: 'Mock AI response: I received "hello from e2e".', time: '10:01' },
            ],
            projectId: 'project-1',
            status: 'finished',
            title: 'Chat 1',
          },
        ],
        viewMode: 'detail',
      },
    ],
    ['Chat.rerender'],
  ])
})

test('handleChatStorageUpdate should target the submitted session while still in list mode', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async () => ({
      id: 'session-2',
      messages: [{ id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' }],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 2',
    }),
    'ChatStorage.listSessions': async () => [
      { id: 'session-1', messages: [], projectId: 'project-1', status: 'finished', title: 'Chat 1' },
      { id: 'session-2', messages: [], projectId: 'project-1', status: 'finished', title: 'Chat 2' },
    ],
  })
  using mockParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[{ type: 'text' }]],
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.applyViewModelState': async () => {},
    'Chat.rerender': async () => {},
  })
  const state = {
    ...createState(),
    composerValue: '',
    lastSubmittedSessionId: 'session-2',
    selectedSessionId: 'session-1',
    viewMode: 'list' as const,
  }
  setState(1, state)

  await handleChatStorageUpdate(1, 'session-2')

  expect(mockStorageRpc.invocations).toEqual([['ChatStorage.listSessions'], ['ChatStorage.getSession', 'session-2']])
  expect(mockParsingRpc.invocations).toEqual([['ChatMessageParsing.parseMessageContents', ['hello from e2e']]])
  expect(mockRendererRpc.invocations).toEqual([
    [
      'Chat.applyViewModelState',
      1,
      {
        ...state,
        parsedMessages: [
          {
            id: 'message-1',
            parsedContent: [{ type: 'text' }],
            text: 'hello from e2e',
          },
        ],
        selectedSessionId: 'session-2',
        sessions: [
          { id: 'session-1', messages: [], projectId: 'project-1', status: 'finished', title: 'Chat 1' },
          {
            id: 'session-2',
            lastActiveTime: '10:00',
            messages: [{ id: 'message-1', role: 'user', text: 'hello from e2e', time: '10:00' }],
            projectId: 'project-1',
            status: 'finished',
            title: 'Chat 2',
          },
        ],
        viewMode: 'detail',
      },
    ],
    ['Chat.rerender'],
  ])
})
