import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker, ChatMessageParsingWorker, ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeState } from '../src/parts/PrototypeState/PrototypeState.ts'
import { rpcIdViewModel } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { handleRpcSubmit } from '../src/parts/HandleRpcSubmit/HandleRpcSubmit.ts'
import { handleChatStorageUpdate } from '../src/parts/HandleStorageUpdate/HandleStorageUpdate.ts'
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
    'ChatStorage.setSession': async () => {},
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
    'ChatCoordinator.registerMockResponse': async () => {},
  })
  const state = createState()

  const result = await handleRpcSubmit(state)

  expect(result.composerValue).toBe('')
  expect(result.viewMode).toBe('detail')
  expect(result.chatInputHistory).toEqual(['hello from e2e'])
  expect(result.selectedSessionId).not.toBe('session-1')
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' },
    { id: result.selectedSessionId, messages: [], projectId: 'project-1', status: 'in-progress', title: 'Chat 2' },
  ])
  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.setSession', { id: result.selectedSessionId, messages: [], projectId: 'project-1', status: 'in-progress', title: 'Chat 2' }],
    ['ChatStorage.subscribeSessionUpdates', { rpcId: rpcIdViewModel, sessionId: result.selectedSessionId, type: 'session', uid: 1 }],
  ])
  expect(mockCoordinatorRpc.invocations).toEqual([
    ['ChatCoordinator.registerMockResponse', { text: 'Mock AI response: I received "hello from e2e".' }],
    [
      'ChatCoordinator.handleSubmit',
      {
        id: expect.any(String),
        modelId: 'test',
        openAiKey: '',
        requestId: expect.any(String),
        role: 'user',
        sessionId: result.selectedSessionId,
        systemPrompt: '',
        text: 'hello from e2e',
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
    selectedSessionId: 'session-1',
    viewMode: 'detail' as const,
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
      },
    ],
    ['Chat.rerender'],
  ])
})
