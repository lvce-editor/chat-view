import type { ChatState } from '../../StatusBarState/StatusBarState.ts'
import * as HandleSubmit from '../../HandleSubmit/HandleSubmit.ts'

export const handleClickSend = async (state: ChatState): Promise<ChatState> => {
  return HandleSubmit.handleSubmit(state)
}
