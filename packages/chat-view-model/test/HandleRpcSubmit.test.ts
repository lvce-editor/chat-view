import { expect, test } from '@jest/globals'
import { ChatCoordinatorWorker, ChatStorageWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeState } from '../src/parts/PrototypeState/PrototypeState.ts'
import { rpcIdViewModel } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { handleRpcSubmit } from '../src/parts/HandleRpcSubmit/HandleRpcSubmit.ts'
import * as MockBackendAuth from '../src/parts/MockBackendAuth/MockBackendAuth.ts'
import { getState } from '../src/parts/ModelState/ModelState.ts'

const registerMockChatStorageRpc = (): ReturnType<typeof ChatStorageWorker.registerMockRpc> => {
  return ChatStorageWorker.registerMockRpc({
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
}

const createState = (overrides: Readonly<Partial<PrototypeState>> = {}): PrototypeState => {
  return {
    authAccessToken: '',
    backendUrl: 'https://backend.example.com',
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    composerAttachments: [],
    composerValue: 'hello backend',
    focus: 'composer',
    focused: true,
    openApiApiKey: '',
    parsedMessages: [],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    selectedModelId: 'model-1',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    systemPrompt: '',
    uid: 101,
    useMockApi: false,
    useOwnBackend: false,
    viewMode: 'detail',
    ...overrides,
  }
}

test('handleRpcSubmit syncs backend auth for authenticated backend requests', async () => {
  using mockStorageRpc = registerMockChatStorageRpc()
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
  })

  MockBackendAuth.setNextRefreshResponse({
    delay: 0,
    response: {
      accessToken: 'refreshed-token',
      subscriptionPlan: 'pro',
      usedTokens: 12,
      userName: 'Simon',
    },
    type: 'success',
  })

  try {
    await handleRpcSubmit(
      createState({
        authAccessToken: 'existing-token',
        uid: 102,
        useOwnBackend: false,
      }),
    )

    const currentState = getState(102) as PrototypeState | undefined
    expect(currentState?.authAccessToken).toBe('refreshed-token')
    expect(currentState?.userState).toBe('loggedIn')
    expect(mockStorageRpc.invocations).toContainEqual([
      'ChatStorage.subscribeSessionUpdates',
      {
        rpcId: rpcIdViewModel,
        sessionId: 'session-1',
        type: 'session',
        uid: 102,
      },
    ])
    expect(mockCoordinatorRpc.invocations).toContainEqual([
      'ChatCoordinator.handleSubmit',
      expect.objectContaining({
        backendUrl: 'https://backend.example.com',
        text: 'hello backend',
        useOwnBackend: false,
      }),
    ])
  } finally {
    MockBackendAuth.clear()
  }
})

test('handleRpcSubmit does not sync backend auth without own-backend or auth token', async () => {
  using _mockStorageRpc = registerMockChatStorageRpc()
  using mockCoordinatorRpc = ChatCoordinatorWorker.registerMockRpc({
    'ChatCoordinator.handleSubmit': async () => {},
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (): Promise<Response> => {
    throw new Error('fetch should not be called')
  }

  try {
    await handleRpcSubmit(
      createState({
        authAccessToken: '',
        uid: 103,
        useOwnBackend: false,
      }),
    )

    const currentState = getState(103) as PrototypeState | undefined
    expect(currentState?.authAccessToken).toBe('')
    expect(mockCoordinatorRpc.invocations).toContainEqual([
      'ChatCoordinator.handleSubmit',
      expect.objectContaining({
        text: 'hello backend',
        useOwnBackend: false,
      }),
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})
