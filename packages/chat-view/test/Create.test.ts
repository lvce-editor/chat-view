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
  const { oldState } = result
  const oldStateTyped: ChatState = oldState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.uid).toBe(uid)
  expect(newStateTyped.models.length).toBeGreaterThan(0)
  expect(newStateTyped.models).toContainEqual({ id: 'openapi/gpt-5-mini', name: 'GPT-5 Mini', provider: 'openApi' })
  expect(newStateTyped.selectedModelId).toBe('test')
  expect(newStateTyped.sessions).toHaveLength(1)
  expect(newStateTyped.selectedSessionId).toBe('session-1')
  expect(newStateTyped.listItemHeight).toBe(40)
  expect(newStateTyped.maxComposerRows).toBe(5)
  expect(newStateTyped.systemPrompt).toContain('You are an AI programming assistant running inside a code editor.')
  expect(newStateTyped.systemPrompt).toContain('Prefer using available tools to inspect and modify files in the current workspace.')
  expect(newStateTyped.systemPrompt).toContain('When referencing workspace files in responses')
  expect(newStateTyped.systemPrompt).toContain('Prefer file links like [src/index.ts](file:///workspace/src/index.ts)')
  expect(newStateTyped.systemPrompt).toContain('Current workspace URI: {{workspaceUri}}')
  expect(newStateTyped.tokensUsed).toBe(0)
  expect(newStateTyped.tokensMax).toBe(0)
  expect(newStateTyped.usageOverviewEnabled).toBe(false)
  expect(newStateTyped.viewMode).toBe('list')
  expect(newStateTyped.x).toBe(10)
  expect(newStateTyped.y).toBe(20)
  expect(newStateTyped.width).toBe(300)
  expect(newStateTyped.height).toBe(400)
  expect(oldStateTyped).toBeDefined()
  expect(oldStateTyped.uid).toBe(uid)
})
