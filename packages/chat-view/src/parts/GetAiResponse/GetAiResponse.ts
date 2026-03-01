import type { ChatMessage, ChatModel } from '../ChatState/ChatState.ts'

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const getMockAiResponse = (userMessage: string): string => {
  return `Mock AI response: I received "${userMessage}".`
}

const isOpenRouterModel = (selectedModelId: string, models: readonly ChatModel[]): boolean => {
  const selectedModel = models.find((model) => model.id === selectedModelId)
  if (selectedModel?.provider === 'openRouter') {
    return true
  }
  return selectedModelId.startsWith('openRouter/')
}

const getOpenRouterModelId = (selectedModelId: string): string => {
  if (selectedModelId.startsWith('openRouter/')) {
    return selectedModelId.slice('openRouter/'.length)
  }
  return selectedModelId
}

const getTextContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content
  }
  if (!Array.isArray(content)) {
    return ''
  }
  const textParts: string[] = []
  for (const part of content) {
    if (!part || typeof part !== 'object') {
      continue
    }
    const maybeType = Reflect.get(part, 'type')
    const maybeText = Reflect.get(part, 'text')
    if (maybeType === 'text' && typeof maybeText === 'string') {
      textParts.push(maybeText)
    }
  }
  return textParts.join('\n')
}

const getOpenRouterAssistantText = async (userText: string, modelId: string, openRouterApiKey: string): Promise<string> => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    body: JSON.stringify({
      messages: [{ content: userText, role: 'user' }],
      model: modelId,
    }),
    headers: {
      Authorization: `Bearer ${openRouterApiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error(`Failed to get OpenRouter response: ${response.status}`)
  }
  const parsed = (await response.json()) as unknown
  if (!parsed || typeof parsed !== 'object') {
    return ''
  }
  const choices = Reflect.get(parsed, 'choices')
  if (!Array.isArray(choices)) {
    return ''
  }
  const firstChoice = choices[0]
  if (!firstChoice || typeof firstChoice !== 'object') {
    return ''
  }
  const message = Reflect.get(firstChoice, 'message')
  if (!message || typeof message !== 'object') {
    return ''
  }
  const content = Reflect.get(message, 'content')
  return getTextContent(content)
}

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
