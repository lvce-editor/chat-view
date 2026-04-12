import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'
import { getImplementationPrompt } from '../GetImplementationPrompt/GetImplementationPrompt.ts'
import { getLatestExecutablePlanMessage } from '../GetLatestExecutablePlanMessage/GetLatestExecutablePlanMessage.ts'
import { handleSubmit } from '../HandleSubmit/HandleSubmit.ts'

export const handleClickImplementPlan = async (state: ChatState): Promise<ChatState> => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!selectedSession || getChatSessionStatus(selectedSession) === 'in-progress') {
    return state
  }
  const latestPlanMessage = getLatestExecutablePlanMessage(selectedSession)
  if (!latestPlanMessage) {
    return state
  }
  const implementationPrompt = getImplementationPrompt(latestPlanMessage.text)
  const preparedState: ChatState = {
    ...state,
    agentMode: 'agent',
    composerSelectionEnd: implementationPrompt.length,
    composerSelectionStart: implementationPrompt.length,
    composerValue: implementationPrompt,
    inputSource: 'script',
  }
  return handleSubmit(preparedState)
}
