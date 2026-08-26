import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'
import { getObjectProperty } from '../../GetObjectProperty/GetObjectProperty.ts'

export const useOwnBackendEnabled = (state: Readonly<PrototypeState>): boolean => {
  return getObjectProperty(state, 'useOwnBackend') === true
}
