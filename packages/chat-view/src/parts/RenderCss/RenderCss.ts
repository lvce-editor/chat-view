import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getCss } from '../GetCss/GetCss.ts'

// TODO render things like scrollbar height,scrollbar offset, textarea height,
// list height

export const renderCss = (oldState: ChatState, newState: ChatState): readonly [string, number, string] => {
  const { composerHeight, uid } = newState
  const css = getCss(composerHeight)
  return [ViewletCommand.SetCss, uid, css]
}
