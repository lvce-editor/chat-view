import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { getChatDebugViewDom } from '../GetChatDebugViewDom/GetChatDebugViewDom.ts'
import { getFilteredEvents } from '../GetFilteredEvents/GetFilteredEvents.ts'

export const renderItems = (oldState: ChatDebugViewState, newState: ChatDebugViewState): readonly [string, number, readonly unknown[]] => {
  const filteredEvents = getFilteredEvents(newState.events, newState.filterValue)
  const dom = getChatDebugViewDom(newState.sessionId, newState.filterValue, filteredEvents)
  return [ViewletCommand.SetDom2, newState.uid, dom]
}
