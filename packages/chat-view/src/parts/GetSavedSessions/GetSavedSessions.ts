import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { isObject } from '../IsObject/IsObject.ts'

interface LegacySavedState {
  readonly sessions: readonly ChatSession[]
}

export const getSavedSessions = (savedState: unknown): readonly ChatSession[] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { sessions } = savedState as Partial<LegacySavedState>
  if (!Array.isArray(sessions)) {
    return undefined
  }
  return sessions
}
