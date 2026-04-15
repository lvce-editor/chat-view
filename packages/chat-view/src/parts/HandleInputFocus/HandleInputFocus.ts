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
      listFocusOutline: false,
      listFocusedIndex: -1,
    }
  }
  if (name === InputName.ChatList) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusOutline: false,
      listFocusedIndex: -1,
    }
  }
  if (InputName.isSessionInputName(name) || name === InputName.SessionDelete) {
    const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
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
      listFocusOutline: false,
      listFocusedIndex: focusedIndex,
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
      listFocusOutline: false,
      listFocusedIndex: -1,
    }
  }
  return {
    ...state,
    focused: false,
    listFocusOutline: false,
  }
}
