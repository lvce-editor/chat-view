import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'

const states = new Map<number, PrototypeState>()
const subscriptions = new Map<number, string>()

export const getState = (uid: number): PrototypeState | undefined => {
  return states.get(uid)
}

export const setState = (uid: number, state: Readonly<PrototypeState>): void => {
  states.set(uid, state)
}

export const getSubscribedSessionId = (uid: number): string | undefined => {
  return subscriptions.get(uid)
}

export const setSubscribedSessionId = (uid: number, sessionId: string): void => {
  subscriptions.set(uid, sessionId)
}
