import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { getChatDebugViewDom } from '../GetChatDebugViewDom/GetChatDebugViewDom.ts'
import { getFilteredEvents } from '../GetFilteredEvents/GetFilteredEvents.ts'

const withSessionEventIds = (events: readonly ChatViewEvent[]): readonly ChatViewEvent[] => {
  return events.map((event, index) => {
    return {
      ...event,
      eventId: index + 1,
    }
  })
}

export const renderItems = (oldState: ChatDebugViewState, newState: ChatDebugViewState): readonly [string, number, readonly unknown[]] => {
  const eventsWithIds = withSessionEventIds(newState.events)
  const filteredEvents = getFilteredEvents(
    eventsWithIds,
    newState.filterValue,
    newState.showInputEvents,
    newState.showResponsePartEvents,
    newState.showEventStreamFinishedEvents,
  )
  const dom = getChatDebugViewDom(
    newState.sessionId,
    newState.errorMessage,
    newState.filterValue,
    newState.showEventStreamFinishedEvents,
    newState.showInputEvents,
    newState.showResponsePartEvents,
    filteredEvents,
  )
  return [ViewletCommand.SetDom2, newState.uid, dom]
}
