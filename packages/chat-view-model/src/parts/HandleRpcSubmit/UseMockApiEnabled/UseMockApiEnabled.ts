import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'

export const useMockApiEnabled = (state: Readonly<PrototypeState>): boolean => {
  return Reflect.get(state, 'useMockApi') === true
}
