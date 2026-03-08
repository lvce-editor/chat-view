import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

const getVisibleEvents = (events: readonly ChatViewEvent[], showInputEvents: boolean): readonly ChatViewEvent[] => {
  if (showInputEvents) {
    return events
  }
  return events.filter((event) => event.type !== 'handle-input')
}

export const getFilteredEvents = (events: readonly ChatViewEvent[], filterValue: string, showInputEvents: boolean): readonly ChatViewEvent[] => {
  const visibleEvents = getVisibleEvents(events, showInputEvents)
  const normalizedFilter = filterValue.trim().toLowerCase()
  if (!normalizedFilter) {
    return visibleEvents
  }
  return visibleEvents.filter((event) => JSON.stringify(event).toLowerCase().includes(normalizedFilter))
}
