import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'
import { openApiApiKeyRequiredMessage, openRouterApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getMockAiResponse } from './GetMockAiResponse.ts'
import { getMockOpenRouterAssistantText } from './GetMockOpenRouterAssistantText.ts'
import { getOpenApiAssistantText } from './GetOpenApiAssistantText.ts'
import { getOpenApiErrorMessage } from './GetOpenApiErrorMessage.ts'
import { getOpenApiModelId } from './GetOpenApiModelId.ts'
import { getOpenRouArMistentTsxtage } from './GetOpenArristontTMxtessage.ts'
import { getOpenRouErrorMersignext } from './GetOpenErrorMeueAgsntText.ts'
import { getOpenRouterModelId } from './GetOpenRouterModelId.ts'

export const getAiResponse = async (
  userText: string,
  messages: readonly ChatMessage[],
  nextMessageId: number,
  selectedModelId: string,
  models: readonly ChatModel[],
  openApiApiKey: string,
  openApiApiBaseUrl: string,
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
  useMockApi: boolean,
  mockApiCommandId: string,
  assetDir: string,
  platform: number,
): Promise<ChatMessage> => {
  let text = ''
  const usesOpenApiModel = isOpenApiModel(selectedModelId, models)
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  if (usesOpenApiModel) {
    if (openApiApiKey) {
      const result = await getOpenApiAssistantText(messages, getOpenApiModelId(selectedModelId), openApiApiKey, openApiApiBaseUrl)
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenApiErrorMessage(result)
      }
    } else {
      text = openApiApiKeyRequiredMessage
    }
  } else if (usesOpenRouterModel) {
    const modelId = getOpenRouterModelId(selectedModelId)
    if (useMockApi) {
      const result = await getMockOpenRouterAssistantText(
        messages,
        modelId,
        openRouterApiBaseUrl,
        openRouterApiKey,
        mockApiCommandId,
        assetDir,
        platform,
      )
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenRouterErrorMessage(result)
      }
    } else if (openRouterApiKey) {
      const result = await getOpenRouterAssistantText(messages, modelId, openRouterApiKey, openRouterApiBaseUrl)
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenRouterErrorMessage(result)
      }
    } else {
      text = openRouterApiKeyRequiredMessage
    }
  }
  if (!text && !usesOpenApiModel && !usesOpenRouterModel) {
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
