import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'
import * as AuthAccessToken from '../../AuthAccessToken/AuthAccessToken.ts'

export const getAuthAccessToken = (state: Readonly<PrototypeState>): string => {
  return AuthAccessToken.get(state.uid)
}

export const setAuthAccessToken = (uid: number, authAccessToken: string): void => {
  AuthAccessToken.set(uid, authAccessToken)
}
