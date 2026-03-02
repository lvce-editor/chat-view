import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'
import { openRouterApiKeyRequiredMessage, openRouterRequestFailedMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getMockAiResponse } from './GetMockAiResponse.ts'
import { getOpenRouterAssistantText } from './GetOpenRouterAssistantText.ts'
import { getOpenRouterModelId } from './GetOpenRouterModelId.ts'
import { isOpenRouterModel } from './IsOpenRouterModel.ts'

export const getAiResponse = async (
  userText: string,
  nextMessageId: number,
  selectedModelId: string,
  models: readonly ChatModel[],
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
): Promise<ChatMessage> => {
  let text = ''
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  if (usesOpenRouterModel) {
    if (openRouterApiKey) {
      try {
        text = await getOpenRouterAssistantText(userText, getOpenRouterModelId(selectedModelId), openRouterApiKey, openRouterApiBaseUrl)
      } catch (error) {
        if (error instanceof Error && error.message) {
          text = error.message
        } else {
          text = openRouterRequestFailedMessage
        }
      }
    } else {
      text = openRouterApiKeyRequiredMessage
    }
  }
  if (!text && !usesOpenRouterModel) {
    text = await getMockAiResponse(userText)
  }
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return {
    id: `message-${nextMessageId}`,
    role: 'assistant',
    text,
    time: assistantTime,
  }
}
