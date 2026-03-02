import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatVirtualDom } from '../GetChatViewDom/GetChatViewDom.ts'

export const renderItems = (oldState: ChatState, newState: ChatState): any => {
  const {
    composerFontFamily,
    composerFontSize,
    composerHeight,
    composerLineHeight,
    composerValue,
    initial,
    models,
    openApiApiKeyInput,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    selectedModelId,
    selectedSessionId,
    sessions,
    tokensMax,
    tokensUsed,
    uid,
    usageOverviewEnabled,
    viewMode,
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
<<<<<<< Updated upstream
    openApiApiKeyInput,
    openRouterApiKeyState,
=======
    composerHeight,
    composerFontSize,
    composerFontFamily,
    composerLineHeight,
>>>>>>> Stashed changes
  )
  return [ViewletCommand.SetDom2, uid, dom]
}
