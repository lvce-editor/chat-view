import { expect, test } from '@jest/globals'
import { ChatMessageParsingWorker, ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { HandleClickListState } from '../src/parts/HandleClickList/HandleClickList.ts'
import { handleClickList } from '../src/parts/HandleClickList/HandleClickList.ts'
import { getState, setState } from '../src/parts/ModelState/ModelState.ts'

const createState = (overrides: Partial<HandleClickListState> = {}): HandleClickListState => {
  return {
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    chatListExpanded: false,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    composerValue: '',
    focus: 'composer',
    focused: true,
    gitBranches: [],
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
    gitBranchPickerVisible: false,
    headerHeight: 35,
    height: 400,
    lastNormalViewMode: 'list',
    listFocusedIndex: -1,
    listFocusOutline: true,
    listItemHeight: 48,
    messages: [],
    messagesAutoScrollEnabled: false,
    messagesScrollTop: 0,
    parsedMessages: [],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    renamingSessionId: 'session-rename',
    selectedModelId: 'model-1',
    selectedProjectId: '',
    selectedSessionId: 'session-1',
    sessions: [
      { id: 'session-1', messages: [], title: 'Session 1' },
      { id: 'session-2', messages: [], title: 'Session 2' },
      { id: 'session-3', messages: [], title: 'Session 3' },
    ],
    systemPrompt: '',
    uid: 401,
    viewMode: 'list',
    width: 200,
    x: 0,
    y: 0,
    ...overrides,
  }
}

test('handleClickList should persist selected session and rerender from the view-model worker', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getEvents': async () => [],
    'ChatStorage.getSession': async () => ({
      id: 'session-3',
      messages: [
        {
          id: 'message-1',
          role: 'assistant',
          text: 'Hello',
          time: '10:00',
        },
      ],
      title: 'Session 3',
    }),
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async () => [[]],
  })
  const state = createState()

  setState(state.uid, state)

  const result = await handleClickList(state, 8, 131)

  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    lastNormalViewMode: 'detail',
    listFocusedIndex: 2,
    listFocusOutline: false,
    messages: [
      {
        id: 'message-1',
        role: 'assistant',
        text: 'Hello',
        time: '10:00',
      },
    ],
    messagesAutoScrollEnabled: true,
    messagesScrollTop: Number.MAX_SAFE_INTEGER,
    parsedMessages: [{ id: 'message-1', parsedContent: [], text: 'Hello' }],
    renamingSessionId: '',
    selectedSessionId: 'session-3',
    sessions: [
      { id: 'session-1', messages: [], title: 'Session 1' },
      { id: 'session-2', messages: [], title: 'Session 2' },
      { id: 'session-3', messages: [], title: 'Session 3' },
    ],
    viewMode: 'detail',
  })
  expect(getState(state.uid)).toEqual(result)
  expect(mockStorageRpc.invocations).toEqual([
    ['ChatStorage.getSession', 'session-3'],
    ['ChatStorage.getEvents', 'session-3'],
    ['ChatStorage.subscribeSessionUpdates', { rpcId: 'ChatModel', sessionId: 'session-3', type: 'session', uid: state.uid }],
  ])
  expect(mockRendererRpc.invocations).toEqual([['Chat.rerenderWithQuery', state.uid]])
  expect(mockChatMessageParsingRpc.invocations).toEqual([['ChatMessageParsing.parseMessageContents', ['Hello']]])
})

test('handleClickList should keep list focus when the click does not resolve to a session', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  const state = createState()

  setState(state.uid, state)

  const result = await handleClickList(state, 10, 20)

  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
    listFocusOutline: false,
  })
  expect(getState(state.uid)).toEqual(result)
  expect(mockRendererRpc.invocations).toEqual([['Chat.rerenderWithQuery', state.uid]])
})

test('handleClickList should skip the show-more row and select trailing sessions when expanded', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getEvents': async () => [],
    'ChatStorage.getSession': async () => ({
      id: 'session-5',
      messages: [],
      title: 'Session 5',
    }),
    'ChatStorage.subscribeSessionUpdates': async () => {},
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  const state = createState({
    chatListExpanded: true,
    height: 500,
    selectedSessionId: 'session-1',
    sessions: [
      { id: 'session-1', messages: [], title: 'Session 1' },
      { id: 'session-2', messages: [], title: 'Session 2' },
      { id: 'session-3', messages: [], title: 'Session 3' },
      { id: 'session-4', messages: [], title: 'Session 4' },
      { id: 'session-5', messages: [], title: 'Session 5' },
    ],
  })

  setState(state.uid, state)

  const result = await handleClickList(state, 120, 521)

  expect(result.selectedSessionId).toBe('session-5')
  expect(result.listFocusedIndex).toBe(4)
  expect(result.viewMode).toBe('detail')
  expect(mockStorageRpc.invocations).toContainEqual(['ChatStorage.getSession', 'session-5'])
  expect(mockRendererRpc.invocations).toEqual([['Chat.rerenderWithQuery', state.uid]])
})
