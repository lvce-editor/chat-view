import { expect, jest, test } from '@jest/globals'
import { getSystemPromptForAgentMode } from '../src/parts/GetSystemPromptForAgentMode/GetSystemPromptForAgentMode.ts'

test('getSystemPromptForAgentMode should append plan mode instructions in plan mode', () => {
  jest.useFakeTimers().setSystemTime(Date.parse('2026-04-12T09:00:00.000Z'))

  const result = getSystemPromptForAgentMode('Base prompt for {{workspaceUri}}', 'file:///workspace', 'plan')

  expect(result).toContain('Base prompt for file:///workspace')
  expect(result).toContain('Plan mode instructions:')
  expect(result).toContain('Do not make code changes, write files, or claim that you have implemented anything.')
  expect(result).toContain('Current date: 2026-04-12.')
})

test('getSystemPromptForAgentMode should not append plan mode instructions in agent mode', () => {
  jest.useFakeTimers().setSystemTime(Date.parse('2026-04-12T09:00:00.000Z'))

  const result = getSystemPromptForAgentMode('Base prompt for {{workspaceUri}}', 'file:///workspace', 'agent')

  expect(result).toContain('Base prompt for file:///workspace')
  expect(result).not.toContain('Plan mode instructions:')
  expect(result).toContain('Current date: 2026-04-12.')
})