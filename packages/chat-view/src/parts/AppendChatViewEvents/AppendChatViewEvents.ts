import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'

export const appendChatViewEvents = async (events: readonly ChatViewEvent[]): Promise<void> => {
  for (const event of events) {
    await appendChatViewEvent(event)
  }
}
