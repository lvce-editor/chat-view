import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getCss } from '../GetCss/GetCss.ts'
import { getRenderHtmlCss } from '../GetRenderHtmlCss/GetRenderHtmlCss.ts'

// TODO render things like scrollbar height,scrollbar offset, textarea height,
// list height

export const renderCss = (oldState: ChatState, newState: ChatState): readonly [string, number, string] => {
  const {
    chatFocusContentMaxWidth,
    chatMessageFontFamily,
    chatMessageFontSize,
    chatMessageLineHeight,
    chatSendAreaPaddingBottom,
    chatSendAreaPaddingLeft,
    chatSendAreaPaddingRight,
    chatSendAreaPaddingTop,
    composerAttachmentsHeight,
    composerHeight,
    listItemHeight,
    modelPickerHeight,
    selectedSessionId,
    sessions,
    textAreaPaddingBottom,
    textAreaPaddingLeft,
    textAreaPaddingRight,
    textAreaPaddingTop,
    uid,
  } = newState
  const renderHtmlCss = getRenderHtmlCss(sessions, selectedSessionId)
  const css = getCss(
    composerHeight,
    composerAttachmentsHeight,
    modelPickerHeight,
    listItemHeight,
    chatMessageFontSize,
    chatMessageLineHeight,
    chatMessageFontFamily,
    chatFocusContentMaxWidth,
    textAreaPaddingTop,
    textAreaPaddingLeft,
    textAreaPaddingRight,
    textAreaPaddingBottom,
    chatSendAreaPaddingTop,
    chatSendAreaPaddingLeft,
    chatSendAreaPaddingRight,
    chatSendAreaPaddingBottom,
    renderHtmlCss,
  )
  return [ViewletCommand.SetCss, uid, css]
}
