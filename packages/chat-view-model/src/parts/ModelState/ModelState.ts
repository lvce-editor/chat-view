import type { PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'

const states = new Map<number, PrototypeStateBase>()
const subscriptions = new Map<number, string>()

export const getState = (uid: number): PrototypeStateBase | undefined => {
  return states.get(uid)
}

export const setState = (uid: number, state: Readonly<PrototypeStateBase>): void => {
  states.set(uid, state)
}

export const getSubscribedSessionId = (uid: number): string | undefined => {
  return subscriptions.get(uid)
}

export const setSubscribedSessionId = (uid: number, sessionId: string): void => {
  subscriptions.set(uid, sessionId)
}
