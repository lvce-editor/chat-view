import type { ChatState } from '../ChatState/ChatState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.initial === newState.initial &&
    oldState.chatMessageFontFamily === newState.chatMessageFontFamily &&
    oldState.chatMessageFontSize === newState.chatMessageFontSize &&
    oldState.chatMessageLineHeight === newState.chatMessageLineHeight &&
    oldState.composerHeight === newState.composerHeight &&
    oldState.composerLineHeight === newState.composerLineHeight &&
    oldState.composerFontFamily === newState.composerFontFamily &&
    oldState.composerFontSize === newState.composerFontSize &&
    oldState.listItemHeight === newState.listItemHeight
  )
}
