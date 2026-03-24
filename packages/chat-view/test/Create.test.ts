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
