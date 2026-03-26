import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleAgentModeChange from '../src/parts/HandleAgentModeChange/HandleAgentModeChange.ts'

test('handleAgentModeChange should update agent mode', async () => {
  const state = createDefaultState()
  const result = await HandleAgentModeChange.handleAgentModeChange(state, 'plan')
  expect(result.agentMode).toBe('plan')
})

test('handleAgentModeChange should close the agent mode picker', async () => {
  const state = {
    ...createDefaultState(),
    agentModePickerOpen: true,
  }
  const result = await HandleAgentModeChange.handleAgentModeChange(state, 'plan')
  expect(result.agentModePickerOpen).toBe(false)
})
