import { expect, test } from '@jest/globals'
import { ChatMessageParsingWorker, ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { handleChatStorageUpdate } from '../src/parts/HandleStorageUpdate/HandleStorageUpdate.ts'
import { getState, setState } from '../src/parts/ModelState/ModelState.ts'
import type { PrototypeStateBase } from '../src/parts/PrototypeState/PrototypeState.ts'

const createState = (): PrototypeStateBase => {
  return {
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    composerValue: '',
    focus: 'composer',
    focused: true,
    parsedMessages: [],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    selectedModelId: 'model-1',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    systemPrompt: '',
    uid: 201,
    viewMode: 'detail' as const,
  }
}

test('handleChatStorageUpdate normalizes multi-part message events when refreshing detail view', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getMessages': async () => [
      {
        message: {
          content: [
            { text: 'Hello', type: 'output_text' },
            { summary: 'thinking', type: 'reasoning' },
            { text: ' world', type: 'output_text' },
          ],
          role: 'assistant',
        },
        requestId: 'request-1',
        timestamp: '10:00',
        type: 'message',
      },
    ],
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  using mockChatMessageParsingRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) => rawMessages.map(() => []),
  })

  setState(201, createState())

  await handleChatStorageUpdate(201, 'session-1')

  expect(getState(201)).toEqual({
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    composerValue: '',
    focus: 'composer',
    focused: true,
    parsedMessages: [{ id: 'request-1', parsedContent: [], text: 'Hello world' }],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    selectedModelId: 'model-1',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            content: [
              { text: 'Hello', type: 'output_text' },
              { summary: 'thinking', type: 'reasoning' },
              { text: ' world', type: 'output_text' },
            ],
            id: 'request-1',
            role: 'assistant',
            text: 'Hello world',
            time: '10:00',
          },
        ],
        title: 'Session 1',
      },
    ],
    systemPrompt: '',
    uid: 201,
    viewMode: 'detail',
  })
  expect(mockStorageRpc.invocations).toEqual([['ChatStorage.getMessages', 'session-1']])
  expect(mockRendererRpc.invocations).toEqual([['Chat.rerenderWithQuery', 201]])
  expect(mockChatMessageParsingRpc.invocations).toEqual([['ChatMessageParsing.parseMessageContents', ['Hello world']]])
})
