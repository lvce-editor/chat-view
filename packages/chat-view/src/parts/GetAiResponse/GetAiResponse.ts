import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'
import {
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../chatViewStrings/chatViewStrings.ts'
import { getMockAiResponse } from './GetMockAiResponse.ts'
import { type GetOpenRouterAssistantTextErrorResult, getOpenRouterAssistantText } from './GetOpenRouterAssistantText.ts'
import { getOpenRouterModelId } from './GetOpenRouterModelId.ts'
import { isOpenRouterModel } from './IsOpenRouterModel.ts'

const getOpenRouterErrorMessage = (errorResult: GetOpenRouterAssistantTextErrorResult): string => {
  switch (errorResult.details) {
    case 'too-many-requests':
      return openRouterTooManyRequestsMessage
    case 'http-error':
    case 'request-failed':
      return openRouterRequestFailedMessage
  }
}

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
      const result = await getOpenRouterAssistantText(userText, getOpenRouterModelId(selectedModelId), openRouterApiKey, openRouterApiBaseUrl)
      if (result.type === 'success') {
        text = result.text
      } else {
        text = getOpenRouterErrorMessage(result)
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
