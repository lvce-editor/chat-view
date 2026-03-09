import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

const getVisibleEvents = (
  events: readonly ChatViewEvent[],
  showInputEvents: boolean,
  showResponsePartEvents: boolean,
  showEventStreamFinishedEvents: boolean,
): readonly ChatViewEvent[] => {
  return events.filter((event) => {
    if (!showInputEvents && event.type === 'handle-input') {
      return false
    }
    if (!showResponsePartEvents && event.type === 'sse-response-part') {
      return false
    }
    if (!showEventStreamFinishedEvents && event.type === 'event-stream-finished') {
      return false
    }
    // hide session creation events by default — not useful in the debug view
    if (event.type === 'chat-session-created') {
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
  showEventStreamFinishedEvents: boolean,
): readonly ChatViewEvent[] => {
  const visibleEvents = getVisibleEvents(events, showInputEvents, showResponsePartEvents, showEventStreamFinishedEvents)
  const normalizedFilter = filterValue.trim().toLowerCase()
  if (!normalizedFilter) {
    return visibleEvents
  }
  return visibleEvents.filter((event) => JSON.stringify(event).toLowerCase().includes(normalizedFilter))
}
