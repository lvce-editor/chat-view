import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type {
  GetOpenRouterAssistantTextErrorResult,
  GetOpenRouterAssistantTextSuccessResult,
} from '../GetOpenRouterAssistantText/GetOpenRouterAssistantText.ts'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.ts'
import { normalizeMockResult } from '../NormalizeMockResult/NormalizeMockResult.ts'

export const getMockOpenRouterAssistantText = async (
  messages: readonly ChatMessage[],
  modelId: string,
  openRouterApiBaseUrl: string,
  openRouterApiKey: string,
  mockApiCommandId: string,
  assetDir: string,
  platform: number,
): Promise<GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult> => {
  if (!mockApiCommandId) {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  try {
    const result = await ExtensionManagement.executeCommand(mockApiCommandId, {
      messages,
      modelId,
      openRouterApiBaseUrl,
      openRouterApiKey,
    })
    return normalizeMockResult(result)
  } catch {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
}
