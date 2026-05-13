import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'

export const getAuthAccessToken = (state: Readonly<PrototypeState>): string => {
  const authAccessToken = Reflect.get(state, 'authAccessToken')
  return typeof authAccessToken === 'string' ? authAccessToken : ''
}