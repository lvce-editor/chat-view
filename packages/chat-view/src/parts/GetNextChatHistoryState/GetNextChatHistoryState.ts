import type { ChatState } from '../ChatState/ChatState.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getComposerHeight } from '../GetComposerHeight/GetComposerHeight.ts'

const getHistoryValueForIndex = (history: readonly string[], index: number): string => {
  if (index < 0 || index >= history.length) {
    return ''
  }
  return history[history.length - 1 - index] ?? ''
}

export const getNextChatHistoryState = async (state: ChatState, direction: 'up' | 'down'): Promise<ChatState> => {
  if (!state.chatHistoryEnabled || state.chatInputHistory.length === 0) {
    return state
  }
  const maxIndex = state.chatInputHistory.length - 1
  if (direction === 'up') {
    const nextIndex = state.chatInputHistoryIndex === -1 ? 0 : Math.min(state.chatInputHistoryIndex + 1, maxIndex)
    const nextDraft = state.chatInputHistoryIndex === -1 ? state.composerValue : state.chatInputHistoryDraft
    const nextComposerValue = getHistoryValueForIndex(state.chatInputHistory, nextIndex)
    const composerHeight = await getComposerHeight(state, nextComposerValue)
    const composerAttachmentsHeight = getComposerAttachmentsHeight(state.composerAttachments, state.width)
    return {
      ...state,
      chatInputHistoryDraft: nextDraft,
      chatInputHistoryIndex: nextIndex,
      composerAttachmentsHeight,
      composerHeight,
      composerSelectionEnd: nextComposerValue.length,
      composerSelectionStart: nextComposerValue.length,
      composerValue: nextComposerValue,
      inputSource: 'script',
    }
  }
  if (state.chatInputHistoryIndex === -1) {
    return state
  }
  const nextIndex = state.chatInputHistoryIndex - 1
  if (nextIndex === -1) {
    const composerHeight = await getComposerHeight(state, state.chatInputHistoryDraft)
    const composerAttachmentsHeight = getComposerAttachmentsHeight(state.composerAttachments, state.width)
    return {
      ...state,
      chatInputHistoryIndex: -1,
      composerAttachmentsHeight,
      composerHeight,
      composerSelectionEnd: state.chatInputHistoryDraft.length,
      composerSelectionStart: state.chatInputHistoryDraft.length,
      composerValue: state.chatInputHistoryDraft,
      inputSource: 'script',
    }
  }
  const nextComposerValue = getHistoryValueForIndex(state.chatInputHistory, nextIndex)
  const composerHeight = await getComposerHeight(state, nextComposerValue)
  const composerAttachmentsHeight = getComposerAttachmentsHeight(state.composerAttachments, state.width)
  return {
    ...state,
    chatInputHistoryIndex: nextIndex,
    composerAttachmentsHeight,
    composerHeight,
    composerSelectionEnd: nextComposerValue.length,
    composerSelectionStart: nextComposerValue.length,
    composerValue: nextComposerValue,
    inputSource: 'script',
  }
}
