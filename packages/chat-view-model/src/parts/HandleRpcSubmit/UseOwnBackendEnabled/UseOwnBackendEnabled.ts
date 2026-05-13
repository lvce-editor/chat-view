import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'

export const useOwnBackendEnabled = (state: Readonly<PrototypeState>): boolean => {
  return Reflect.get(state, 'useOwnBackend') === true
}