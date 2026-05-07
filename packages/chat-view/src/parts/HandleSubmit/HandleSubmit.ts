import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { get } from '../StatusBarStates/StatusBarStates.ts'

const submitUpdateRetryDelays = [10, 20, 40, 80, 160, 320]

const wait = async (delay: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, delay))
}

const getSelectedSessionMessageCount = (state: Readonly<ChatState>): number => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  return selectedSession?.messages.length || 0
}

const hasNewerSubmittedState = (state: Readonly<ChatState>, fallbackState: Readonly<ChatState>): boolean => {
  if (getSelectedSessionMessageCount(state) > getSelectedSessionMessageCount(fallbackState)) {
    return true
  }
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  return selectedSession?.status === 'finished' || selectedSession?.status === 'stopped'
}

const waitForLocalSubmitUpdates = async (fallbackState: Readonly<ChatState>): Promise<ChatState> => {
  const currentState = get(fallbackState.uid)?.newState
  if (currentState && hasNewerSubmittedState(currentState, fallbackState)) {
    return currentState
  }
  for (const delay of submitUpdateRetryDelays) {
    await wait(delay)
    const nextState = get(fallbackState.uid)?.newState
    if (nextState && hasNewerSubmittedState(nextState, fallbackState)) {
      return nextState
    }
  }
  return fallbackState
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error) {
    return error
  }
  if (error && typeof error === 'object') {
    const message = Reflect.get(error, 'message')
    if (typeof message === 'string' && message) {
      return message
    }
    const code = Reflect.get(error, 'code')
    if (typeof code === 'string' && code) {
      return code
    }
  }
  return String(error)
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  try {
    const nextState = (await ChatViewModelWorker.invoke('ChatModel.handleSubmit', state)) as ChatState
    return await waitForLocalSubmitUpdates(nextState)
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    })
  }
}
