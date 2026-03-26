import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import { validateToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export const setToolEnablement = async (state: ChatState, newEnabled: unknown, persist = true): Promise<ChatState> => {
  const toolEnablement = validateToolEnablement(newEnabled)
  if (persist) {
    await Preferences.update({
      'chat.toolEnablement': toolEnablement,
    })
  }
  return {
    ...state,
    toolEnablement,
  }
}
