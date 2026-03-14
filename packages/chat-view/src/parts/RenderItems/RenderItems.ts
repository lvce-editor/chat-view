import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatVirtualDom } from '../GetChatViewDom/GetChatViewDom.ts'

export const renderItems = (oldState: ChatState, newState: ChatState): any => {
  const {
    chatListScrollTop,
    composerDropActive,
    composerDropEnabled,
    composerFontFamily,
    composerFontSize,
    composerHeight,
    composerLineHeight,
    composerValue,
    initial,
    messagesScrollTop,
    models,
    openApiApiKeyInput,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    projectExpandedIds,
    projectListScrollTop,
    projects,
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    sessions,
    tokensMax,
    tokensUsed,
    uid,
    usageOverviewEnabled,
    useChatMathWorker,
    viewMode,
    voiceDictationEnabled,
  } = newState
  if (initial) {
    return [ViewletCommand.SetDom2, uid, []]
  }
  const dom = getChatVirtualDom(
    sessions,
    selectedSessionId,
    composerValue,
    openRouterApiKeyInput,
    viewMode,
    models,
    selectedModelId,
    usageOverviewEnabled,
    tokensUsed,
    tokensMax,
    openApiApiKeyInput,
    openRouterApiKeyState,
    composerHeight,
    composerFontSize,
    composerFontFamily,
    composerLineHeight,
    chatListScrollTop,
    messagesScrollTop,
    composerDropActive,
    composerDropEnabled,
    projects,
    projectExpandedIds,
    selectedProjectId,
    projectListScrollTop,
    voiceDictationEnabled,
    useChatMathWorker,
  )
  return [ViewletCommand.SetDom2, uid, dom]
}
