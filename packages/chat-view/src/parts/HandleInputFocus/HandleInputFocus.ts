import type { ChatState } from '../ChatState/ChatState.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
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
    }
  }
  if (InputName.isSessionInputName(name) || name === InputName.SessionDelete) {
    return {
      ...state,
      focus: 'list',
      focused: true,
    }
  }
  if (name === InputName.CreateSession || name === InputName.SessionDebug || name === InputName.Settings || name === InputName.CloseChat || name === InputName.Back) {
    return {
      ...state,
      focus: 'header',
      focused: true,
    }
  }
  return {
    ...state,
    focused: false,
  }
}
