import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

export const renderValue = (oldState: ChatState, newState: ChatState): readonly [string, number, string, string] => {
  const { composerValue, uid } = newState
  return [ViewletCommand.SetValueByName, uid, InputName.Composer, composerValue]
}
