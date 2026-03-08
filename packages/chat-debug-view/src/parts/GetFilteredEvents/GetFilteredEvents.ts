import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

export const getFilteredEvents = (events: readonly ChatViewEvent[], filterValue: string): readonly ChatViewEvent[] => {
  const normalizedFilter = filterValue.trim().toLowerCase()
  if (!normalizedFilter) {
    return events
  }
  return events.filter((event) => JSON.stringify(event).toLowerCase().includes(normalizedFilter))
}
