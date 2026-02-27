import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleInputFocus = async (state: ChatState, name: string): Promise<ChatState> => {
  if (name === 'composer') {
    return {
      ...state,
      focus: 'input',
      focused: true,
    }
  }
  if (name === 'send') {
    return {
      ...state,
      focus: 'send-button',
      focused: true,
    }
  }
  if (name.startsWith('session:') || name === 'SessionDelete') {
    return {
      ...state,
      focus: 'list',
      focused: true,
    }
  }
  if (name === 'create-session' || name === 'settings' || name === 'close-chat' || name === 'back') {
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
