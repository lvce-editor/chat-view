import { expect, test } from '@jest/globals'
import { ChatMessageParsingWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { saveChatSession } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getNextAutoScrollTop } from '../src/parts/GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import * as SelectSession from '../src/parts/SelectSession/SelectSession.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('selectSession should hydrate parsed messages for the selected stored session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRpc = ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) =>
      rawMessages.map((rawMessage) => [
        {
          children: [
            {
              text: rawMessage,
              type: 'text',
            },
          ],
          type: 'text',
        },
      ]),
  })

  await saveChatSession({
    id: 'session-2',
    messages: [
      {
        id: 'message-2',
        role: 'user',
        text: 'loaded from storage',
        time: '10:00',
      },
    ],
    title: 'Chat 2',
  })

  const state: ChatState = {
    ...createDefaultState(),
    messagesAutoScrollEnabled: false,
    messagesScrollTop: 120,
    selectedSessionId: 'session-1',
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    viewMode: 'list',
  }

  const result = await SelectSession.selectSession(state, 'session-2')

  expect(result.selectedSessionId).toBe('session-2')
  expect(result.viewMode).toBe('detail')
  expect(result.messagesAutoScrollEnabled).toBe(true)
  expect(result.messagesScrollTop).toBe(getNextAutoScrollTop(120))
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], title: 'Chat 1' },
    {
      id: 'session-2',
      lastActiveTime: '10:00',
      messages: [
        {
          id: 'message-2',
          role: 'user',
          text: 'loaded from storage',
          time: '10:00',
        },
      ],
      title: 'Chat 2',
    },
  ])
  expect(result.parsedMessages).toEqual([
    {
      id: 'message-2',
      parsedContent: [
        {
          children: [
            {
              text: 'loaded from storage',
              type: 'text',
            },
          ],
          type: 'text',
        },
      ],
      text: 'loaded from storage',
    },
  ])
  expect(mockRpc.invocations).toEqual([['ChatMessageParsing.parseMessageContents', ['loaded from storage']]])
})
