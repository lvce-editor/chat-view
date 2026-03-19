import type { ChatState } from '../ChatState/ChatState.ts'
import type { RunMode } from '../RunMode/RunMode.ts'

const isRunMode = (value: string): value is RunMode => {
  return value === 'local' || value === 'background' || value === 'cloud'
}

export const handleRunModeChange = async (state: ChatState, value: string): Promise<ChatState> => {
  if (!isRunMode(value)) {
    return state
  }
  return {
    ...state,
    runMode: value,
  }
}
