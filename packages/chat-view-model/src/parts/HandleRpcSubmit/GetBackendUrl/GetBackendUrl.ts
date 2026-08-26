import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'
import { getObjectProperty } from '../../GetObjectProperty/GetObjectProperty.ts'

export const getBackendUrl = (state: Readonly<PrototypeState>): string => {
  const backendUrl = getObjectProperty(state, 'backendUrl')
  return typeof backendUrl === 'string' ? backendUrl : ''
}
