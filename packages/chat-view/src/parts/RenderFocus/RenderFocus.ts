import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import type { ChatViewFocus } from '../ChatViewFocus/ChatViewFocus.ts'

const getFocusSelector = (focus: ChatViewFocus): string => {
  switch (focus) {
    case 'composer':
    case 'input':
      return '[name="composer"]'
    case 'header':
      return '[name="create-session"]'
    case 'list':
      return '[name^="session:"]'
    case 'send-button':
      return '[name="send"]'
    default:
      return '[name="composer"]'
  }
}

export const renderFocus = (oldState: ChatState, newState: ChatState): readonly [string, string] => {
  const selector = getFocusSelector(newState.focus)
  return [ViewletCommand.FocusSelector, selector]
}
