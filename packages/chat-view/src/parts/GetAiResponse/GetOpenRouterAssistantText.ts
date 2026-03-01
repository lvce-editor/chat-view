import { getTextContent } from './GetTextContent.ts'

export const getOpenRouterAssistantText = async (userText: string, modelId: string, openRouterApiKey: string): Promise<string> => {
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