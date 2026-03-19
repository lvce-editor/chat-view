import type { ChatState } from '../ChatState/ChatState.ts'
import { getRenderHtmlCss } from '../GetRenderHtmlCss/GetRenderHtmlCss.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  const oldRenderHtmlCss = getRenderHtmlCss(oldState.sessions, oldState.selectedSessionId)
  const newRenderHtmlCss = getRenderHtmlCss(newState.sessions, newState.selectedSessionId)

  return (
    oldState.initial === newState.initial &&
    oldState.chatMessageFontFamily === newState.chatMessageFontFamily &&
    oldState.chatMessageFontSize === newState.chatMessageFontSize &&
    oldState.chatMessageLineHeight === newState.chatMessageLineHeight &&
    oldState.chatSendAreaPaddingTop === newState.chatSendAreaPaddingTop &&
    oldState.chatSendAreaPaddingLeft === newState.chatSendAreaPaddingLeft &&
    oldState.chatSendAreaPaddingRight === newState.chatSendAreaPaddingRight &&
    oldState.chatSendAreaPaddingBottom === newState.chatSendAreaPaddingBottom &&
    oldState.composerHeight === newState.composerHeight &&
    oldState.composerLineHeight === newState.composerLineHeight &&
    oldState.composerFontFamily === newState.composerFontFamily &&
    oldState.composerFontSize === newState.composerFontSize &&
    oldState.listItemHeight === newState.listItemHeight &&
    oldState.textAreaPaddingTop === newState.textAreaPaddingTop &&
    oldState.textAreaPaddingLeft === newState.textAreaPaddingLeft &&
    oldState.textAreaPaddingRight === newState.textAreaPaddingRight &&
    oldState.textAreaPaddingBottom === newState.textAreaPaddingBottom &&
    oldRenderHtmlCss === newRenderHtmlCss
  )
}
