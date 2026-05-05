import {
  appendChatViewEvent,
  clearChatSessions,
  deleteChatSession,
  getChatSession,
  getChatViewEvents,
  listChatSessions,
  resetChatSessionStorage,
  saveChatSession,
} from '../ChatSessionStorage/ChatSessionStorage.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import { handleRpcSubmit } from '../HandleRpcSubmit/HandleRpcSubmit.ts'
import { handleChatStorageUpdate } from '../HandleStorageUpdate/HandleStorageUpdate.ts'
import { loadContent } from '../LoadContent/LoadContent.ts'
import { mockBackendAuthResponse } from '../MockBackendAuthResponse/MockBackendAuthResponse.ts'
import { openMockSession } from '../OpenMockSession/OpenMockSession.ts'

type CommandHandler = (...args: readonly never[]) => unknown

export const commandMap: Record<string, CommandHandler> = {
  'ChatModel.appendChatViewEvent': appendChatViewEvent,
  'ChatModel.clearChatSessions': clearChatSessions,
  'ChatModel.deleteChatSession': deleteChatSession,
  'ChatModel.getChatSession': getChatSession,
  'ChatModel.getChatViewEvents': getChatViewEvents,
  'ChatModel.handleSubmit': handleRpcSubmit,
  'ChatModel.listChatSessions': listChatSessions,
  'ChatModel.loadContent': loadContent,
  'ChatModel.mockBackendAuthResponse': mockBackendAuthResponse,
  'ChatModel.openMockSession': openMockSession,
  'ChatModel.resetChatSessionStorage': resetChatSessionStorage,
  'ChatModel.saveChatSession': saveChatSession,
  handleChatStorageUpdate,
  initialize: (_: string, port: Readonly<MessagePort>): Promise<void> => handleMessagePort(port),
  'ViewModel.handleMessagePort': handleMessagePort,
}
