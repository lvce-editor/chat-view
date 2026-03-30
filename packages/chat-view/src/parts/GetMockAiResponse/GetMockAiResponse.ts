import { delay } from '../Delay/Delay.ts'

export const getMockAiResponse = async (userMessage: string, delayInMs: number): Promise<string> => {
  if (delayInMs > 0) {
    await delay(delayInMs)
  }
  return `Mock AI response: I received "${userMessage}".`
}
