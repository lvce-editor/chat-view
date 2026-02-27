import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState, ChatViewFocus } from '../StatusBarState/StatusBarState.ts'

const getFocusSelector = (focus: ChatViewFocus): string => {
  switch (focus) {
    case 'composer':
    case 'input':
      return '[name="composer"]'
    case 'send-button':
      return '[name="send"]'
    case 'list':
      return '[name^="session:"]'
    case 'header':
      return '[name="create-session"]'
    default:
      return '[name="composer"]'
  }
}

export const renderFocus = (oldState: ChatState, newState: ChatState): readonly [string, string] => {
  const selector = getFocusSelector(newState.focus)
  return [ViewletCommand.FocusSelector, selector]
}
