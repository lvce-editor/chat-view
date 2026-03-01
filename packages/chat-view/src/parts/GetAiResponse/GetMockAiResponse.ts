import { delay } from './Delay.ts'

export const getMockAiResponse = async (userMessage: string): Promise<string> => {
  await delay(800)
  return `Mock AI response: I received "${userMessage}".`
}
