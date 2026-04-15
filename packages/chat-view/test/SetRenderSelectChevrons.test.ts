import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetRenderSelectChevrons from '../src/parts/SetRenderSelectChevrons/SetRenderSelectChevrons.ts'

test('setRenderSelectChevrons should set renderSelectChevrons to false', () => {
  const state = createDefaultState()
  const result = SetRenderSelectChevrons.setRenderSelectChevrons(state, false)
  expect(result.renderSelectChevrons).toBe(false)
})
