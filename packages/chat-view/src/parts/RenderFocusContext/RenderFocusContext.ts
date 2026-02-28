import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'

export const renderFocusContext = (oldState: ChatState, newState: ChatState): readonly any[] => {
  const when = 2344
  return [ViewletCommand.SetFocusContext, newState.uid, when]
}
