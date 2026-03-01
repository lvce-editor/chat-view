import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'
import { delay } from './Delay.ts'
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
): Promise<ChatMessage> => {
  let text = ''
  const shouldUseOpenRouter = isOpenRouterModel(selectedModelId, models) && openRouterApiKey
  if (shouldUseOpenRouter) {
    try {
      text = await getOpenRouterAssistantText(userText, getOpenRouterModelId(selectedModelId), openRouterApiKey)
    } catch {
      text = ''
    }
  }
  if (!text) {
    await delay(800)
    text = getMockAiResponse(userText)
  }
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return {
    id: `message-${nextMessageId}`,
    role: 'assistant',
    text,
    time: assistantTime,
  }
}
