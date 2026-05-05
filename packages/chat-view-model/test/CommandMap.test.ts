import { expect, test } from '@jest/globals'
import * as ChatSessionStorage from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { handleRpcSubmit } from '../src/parts/HandleRpcSubmit/HandleRpcSubmit.ts'

test('commandMap exposes chat session storage commands', () => {
  expect(commandMap['ChatModel.appendChatViewEvent']).toBe(ChatSessionStorage.appendChatViewEvent)
  expect(commandMap['ChatModel.clearChatSessions']).toBe(ChatSessionStorage.clearChatSessions)
  expect(commandMap['ChatModel.deleteChatSession']).toBe(ChatSessionStorage.deleteChatSession)
  expect(commandMap['ChatModel.getChatSession']).toBe(ChatSessionStorage.getChatSession)
  expect(commandMap['ChatModel.getChatViewEvents']).toBe(ChatSessionStorage.getChatViewEvents)
  expect(commandMap['ChatModel.handleSubmit']).toBe(handleRpcSubmit)
  expect(commandMap['ChatModel.listChatSessions']).toBe(ChatSessionStorage.listChatSessions)
  expect(commandMap['ChatModel.resetChatSessionStorage']).toBe(ChatSessionStorage.resetChatSessionStorage)
  expect(commandMap['ChatModel.saveChatSession']).toBe(ChatSessionStorage.saveChatSession)
})
