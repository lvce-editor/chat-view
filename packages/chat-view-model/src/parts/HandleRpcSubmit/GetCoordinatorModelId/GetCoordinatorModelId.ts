import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'
import { useMockApiEnabled } from '../UseMockApiEnabled/UseMockApiEnabled.ts'

export const getCoordinatorModelId = (state: Readonly<PrototypeState>): string => {
  return useMockApiEnabled(state) ? 'test' : state.selectedModelId
}