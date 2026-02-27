import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

// TODO render things like scrollbar height,scrollbar offset, textarea height,
// list height
const css = `
`

export const renderCss = (oldState: ChatState, newState: ChatState): readonly [string, number, string] => {
  return [ViewletCommand.SetCss, newState.uid, css]
}
