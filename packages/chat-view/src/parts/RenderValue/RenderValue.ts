import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const renderValue = (oldState: ChatState, newState: ChatState): readonly [string, number, string, string] => {
  const { composerValue } = newState
  return [ViewletCommand.SetValueByName, newState.uid, 'composer', composerValue]
}
