import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatVirtualDom } from '../GetChatViewDom/GetChatViewDom.ts'

export const renderItems = (oldState: ChatState, newState: ChatState): any => {
  const {
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
    openApiApiKeyInput,
    openRouterApiKeyState,
  )
  return [ViewletCommand.SetDom2, uid, dom]
}
