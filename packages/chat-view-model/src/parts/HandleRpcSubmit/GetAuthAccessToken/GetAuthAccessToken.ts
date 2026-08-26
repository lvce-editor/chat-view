import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'
import { getObjectProperty } from '../../GetObjectProperty/GetObjectProperty.ts'

export const getAuthAccessToken = (state: Readonly<PrototypeState>): string => {
  const authAccessToken = getObjectProperty(state, 'authAccessToken')
  return typeof authAccessToken === 'string' ? authAccessToken : ''
}
