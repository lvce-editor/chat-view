import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

const pickerListSelector = '.ChatOverlays .ChatModelPickerList'

const getFocusSelector = (state: ChatState): string => {
  const { focus } = state
  switch (focus) {
    case 'composer':
    case 'input':
      return '[name="composer"]'
    case 'header':
      return '[name="create-session"]'
    case 'list':
      return `[name="${InputName.ChatList}"]`
    case 'model-picker-input':
      return `[name="${InputName.ModelPickerSearch}"]`
    case 'picker-list':
      return pickerListSelector
    case 'send-button':
      return '[name="send"]'
    default:
      return '[name="composer"]'
  }
}

export const renderFocus = (oldState: ChatState, newState: ChatState): readonly [string, string] => {
  if (newState.modelPickerOpen && !oldState.modelPickerOpen) {
    return [ViewletCommand.FocusSelector, `[name="${InputName.ModelPickerSearch}"]`]
  }
  if (
    (newState.agentModePickerOpen && !oldState.agentModePickerOpen) ||
    (newState.runModePickerOpen && !oldState.runModePickerOpen) ||
    (newState.reasoningEffortPickerOpen && !oldState.reasoningEffortPickerOpen)
  ) {
    return [ViewletCommand.FocusSelector, pickerListSelector]
  }
  const selector = getFocusSelector(newState)
  return [ViewletCommand.FocusSelector, selector]
}
