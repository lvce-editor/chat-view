import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'

export const getBackendUrl = (state: Readonly<PrototypeState>): string => {
  const backendUrl = Reflect.get(state, 'backendUrl')
  return typeof backendUrl === 'string' ? backendUrl : ''
}