import type { ChatMessage } from '../ChatState/ChatState.ts'

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const getMockAiResponse = (userMessage: string): string => {
  return `Mock AI response: I received "${userMessage}".`
}

export const getAiResponse = async (userText: string, nextMessageId: number): Promise<ChatMessage> => {
  await delay(800)

  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return {
    id: `message-${nextMessageId}`,
    role: 'assistant',
    text: getMockAiResponse(userText),
    time: assistantTime,
  }
}
