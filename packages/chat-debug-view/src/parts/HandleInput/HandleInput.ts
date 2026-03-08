import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleInput = (state: ChatDebugViewState, name: string, value: string): ChatDebugViewState => {
  if (name !== InputName.Filter) {
    return state
  }
  return {
    ...state,
    filterValue: value,
  }
}
