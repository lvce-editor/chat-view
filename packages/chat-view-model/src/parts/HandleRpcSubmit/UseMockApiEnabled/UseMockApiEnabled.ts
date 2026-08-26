import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'
import { getObjectProperty } from '../../GetObjectProperty/GetObjectProperty.ts'

export const useMockApiEnabled = (state: Readonly<PrototypeState>): boolean => {
  return getObjectProperty(state, 'useMockApi') === true
}
