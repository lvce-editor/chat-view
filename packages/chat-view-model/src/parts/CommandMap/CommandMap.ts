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

export const commandMap = {
  'ChatModel.appendChatViewEvent': appendChatViewEvent,
  'ChatModel.clearChatSessions': clearChatSessions,
  'ChatModel.deleteChatSession': deleteChatSession,
  'ChatModel.getChatSession': getChatSession,
  'ChatModel.getChatViewEvents': getChatViewEvents,
  'ChatModel.handleSubmit': handleRpcSubmit,
  'ChatModel.listChatSessions': listChatSessions,
  'ChatModel.resetChatSessionStorage': resetChatSessionStorage,
  'ChatModel.saveChatSession': saveChatSession,
  handleChatStorageUpdate,
  initialize: (_: string, port: MessagePort): Promise<void> => handleMessagePort(port),
  'ViewModel.handleMessagePort': handleMessagePort,
}
