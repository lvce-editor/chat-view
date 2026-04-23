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
import { handleSubmit } from '../HandleSubmit/HandleSubmit.ts'

export const commandMap = {
  'ChatModel.appendChatViewEvent': appendChatViewEvent,
  'ChatModel.clearChatSessions': clearChatSessions,
  'ChatModel.deleteChatSession': deleteChatSession,
  'ChatModel.getChatSession': getChatSession,
  'ChatModel.getChatViewEvents': getChatViewEvents,
  'ChatModel.handleSubmit': handleSubmit,
  'ChatModel.listChatSessions': listChatSessions,
  'ChatModel.resetChatSessionStorage': resetChatSessionStorage,
  'ChatModel.saveChatSession': saveChatSession,
}
