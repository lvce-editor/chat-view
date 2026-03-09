import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

const getVisibleEvents = (events: readonly ChatViewEvent[], showInputEvents: boolean, showResponsePartEvents: boolean): readonly ChatViewEvent[] => {
  return events.filter((event) => {
    if (!showInputEvents && event.type === 'handle-input') {
      return false
    }
    if (!showResponsePartEvents && event.type === 'sse-response-part') {
      return false
    }
    return true
  })
}

export const getFilteredEvents = (
  events: readonly ChatViewEvent[],
  filterValue: string,
  showInputEvents: boolean,
  showResponsePartEvents: boolean,
): readonly ChatViewEvent[] => {
  const visibleEvents = getVisibleEvents(events, showInputEvents, showResponsePartEvents)
  const normalizedFilter = filterValue.trim().toLowerCase()
  if (!normalizedFilter) {
    return visibleEvents
  }
  return visibleEvents.filter((event) => JSON.stringify(event).toLowerCase().includes(normalizedFilter))
}
