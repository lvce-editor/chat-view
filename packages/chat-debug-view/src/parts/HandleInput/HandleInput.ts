import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import * as GetBoolean from '../GetBoolean/GetBoolean.ts'
import * as InputName from '../InputName/InputName.ts'

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
      showInputEvents: GetBoolean.getBoolean(checked),
    }
  }
  if (name === InputName.ShowResponsePartEvents) {
    return {
      ...state,
      showResponsePartEvents: GetBoolean.getBoolean(checked),
    }
  }
  return state
}
