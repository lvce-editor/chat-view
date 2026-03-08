import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import * as InputName from '../InputName/InputName.ts'

const getBoolean = (value: string | boolean): boolean => {
  return value === true || value === 'true' || value === 'on' || value === '1'
}

export const handleInput = (state: ChatDebugViewState, name: string, value: string, checked: string | boolean): ChatDebugViewState => {
  if (name === InputName.Filter) {
    return {
      ...state,
      filterValue: value,
    }
  }
  if (name === InputName.ShowInputEvents) {
    return {
      ...state,
      showInputEvents: getBoolean(checked),
    }
  }
  return state
}
