import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

export const renderSelection = (oldState: ChatState, newState: ChatState): readonly [string, number, string, number, number] => {
  const { composerSelectionEnd, composerSelectionStart, uid } = newState
  return [ViewletCommand.SetSelectionByName, uid, InputName.Composer, composerSelectionStart, composerSelectionEnd]
}
