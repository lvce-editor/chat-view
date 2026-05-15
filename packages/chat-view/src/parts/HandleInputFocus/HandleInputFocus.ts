import type { ChatState } from '../ChatState/ChatState.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleInputFocus = async (state: ChatState, name: string): Promise<ChatState> => {
  if (name === InputName.Composer) {
    return FocusInput.focusInput(state)
  }
  if (name === InputName.Send) {
    return {
      ...state,
      focus: 'send-button',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  if (name === InputName.ChatList) {
    const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.searchValue)
    const focusedIndex = state.listSelectedSessionId ? visibleSessions.findIndex((session) => session.id === state.listSelectedSessionId) : -1
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: focusedIndex,
      listFocusOutline: false,
    }
  }
  if (InputName.isSessionInputName(name) || name === InputName.SessionDelete) {
    const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.searchValue)
    const sessionId = InputName.isSessionInputName(name) ? InputName.getSessionIdFromInputName(name) : ''
    const focusedIndex =
      sessionId === ''
        ? -1
        : visibleSessions.findIndex((session) => {
            return session.id === sessionId
          })
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: focusedIndex,
      listFocusOutline: false,
      listSelectedSessionId: sessionId || state.listSelectedSessionId,
    }
  }
  if (
    name === InputName.CreateSession ||
    name === InputName.SessionDebug ||
    name === InputName.Settings ||
    name === InputName.CloseChat ||
    name === InputName.Back
  ) {
    return {
      ...state,
      focus: 'header',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  return {
    ...state,
    focused: false,
    listFocusOutline: false,
  }
}
