import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import * as InputName from '../InputName/InputName.ts'

const getFocusSelector = (state: ChatState): string => {
  const { focus, listFocusedIndex } = state
  switch (focus) {
    case 'composer':
    case 'input':
      return '[name="composer"]'
    case 'header':
      return '[name="create-session"]'
    case 'list': {
      if (listFocusedIndex === -1) {
        return `[name="${InputName.ChatList}"]`
      }
      const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
      const session = visibleSessions[listFocusedIndex]
      if (!session) {
        return `[name="${InputName.ChatList}"]`
      }
      return `[name="${InputName.getSessionInputName(session.id)}"]`
    }
    case 'model-picker-input':
      return `[name="${InputName.ModelPickerSearch}"]`
    case 'send-button':
      return '[name="send"]'
    default:
      return '[name="composer"]'
  }
}

export const renderFocus = (oldState: ChatState, newState: ChatState): readonly [string, string] => {
  if (newState.modelPickerOpen && !oldState.modelPickerOpen) {
    return [ViewletCommand.FocusSelector, `[name="${InputName.ModelPickerSearch}"]`]
  }
  const selector = getFocusSelector(newState)
  return [ViewletCommand.FocusSelector, selector]
}
