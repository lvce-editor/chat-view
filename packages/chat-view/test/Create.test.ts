import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import * as Create from '../src/parts/Create/Create.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('create should store state with the given uid', () => {
  const uid = 123
  Create.create(uid, 10, 20, 300, 400, 0, '')
  const result = StatusBarStates.get(uid)
  const { newState } = result
  const newStateTyped: ChatState = newState
  expect(newStateTyped).toBeDefined()
})

test('create should show run mode by default', () => {
  const uid = 124
  Create.create(uid, 10, 20, 300, 400, 0, '')
  const result = StatusBarStates.get(uid)
  const { newState } = result
  const newStateTyped: ChatState = newState
  expect(newStateTyped.reasoningEffort).toBe('high')
  expect(newStateTyped.reasoningPickerEnabled).toBe(false)
  expect(newStateTyped.showRunMode).toBe(true)
  expect(newStateTyped.runMode).toBe('local')
})
