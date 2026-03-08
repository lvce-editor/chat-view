import type { ChatMessage } from '../ChatState/ChatState.ts'
import type { GetAiResponseOptions } from './GetAiResponseOptions.ts'
import { openApiApiKeyRequiredMessage, openRouterApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import { getMockAiResponse } from './GetMockAiResponse.ts'
import { getMockOpenApiAssistantText } from './GetMockOpenApiAssistantText.ts'
import { getMockOpenRouterAssistantText } from './GetMockOpenRouterAssistantText.ts'
import { getOpenApiAssistantText } from './GetOpenApiAssistantText.ts'
import { getOpenApiErrorMessage } from './GetOpenApiErrorMessage.ts'
import { getOpenApiModelId } from './GetOpenApiModelId.ts'
import { getOpenRouterAssistantText } from './GetOpenRouterAssistantText.ts'
import { getOpenRouterErrorMessage } from './GetOpenRouterErrorMessage.ts'
import { getOpenRouterModelId } from './GetOpenRouterModelId.ts'
import { isOpenApiModel } from './IsOpenApiModel.ts'
import { isOpenRouterModel } from './IsOpenRouterModel.ts'

export const getAiResponse = async ({
  assetDir,
  messages,
  mockApiCommandId,
  models,
  nextMessageId,
  onTextChunk,
  openApiApiBaseUrl,
  openApiApiKey,
  openRouterApiBaseUrl,
  openRouterApiKey,
  passIncludeObfuscation = false,
  platform,
  selectedModelId,
  streamingEnabled = false,
  useMockApi,
  userText,
}: GetAiResponseOptions): Promise<ChatMessage> => {
  let text = ''
  const usesOpenApiModel = isOpenApiModel(selectedModelId, models)
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  if (usesOpenApiModel) {
    if (useMockApi) {
      const result = await getMockOpenApiAssistantText(streamingEnabled, onTextChunk)
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenApiErrorMessage(result)
      }
    } else if (openApiApiKey) {
      const result = await getOpenApiAssistantText(
        messages,
        getOpenApiModelId(selectedModelId),
        openApiApiKey,
        openApiApiBaseUrl,
        assetDir,
        platform,
        {
          includeObfuscation: passIncludeObfuscation,
          onTextChunk,
          stream: streamingEnabled,
        },
      )
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
      const result = await getOpenRouterAssistantText(messages, modelId, openRouterApiKey, openRouterApiBaseUrl, assetDir, platform)
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
