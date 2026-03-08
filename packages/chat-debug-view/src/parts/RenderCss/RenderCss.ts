import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import { getCss } from '../GetCss/GetCss.ts'

export const renderCss = (oldState: ChatDebugViewState, newState: ChatDebugViewState): readonly [string, number, string] => {
  const css = getCss()
  return [ViewletCommand.SetCss, newState.uid, css]
}
