import { expect, test } from '@jest/globals'
import type { ChatToolCall } from '../src/parts/ChatMessage/ChatMessage.ts'
import { getToolCallStatusLabel } from '../src/parts/GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

const createToolCall = (overrides: Partial<ChatToolCall>): ChatToolCall => {
  return {
    arguments: '{}',
    name: 'read_file',
    ...overrides,
  }
}

test('getToolCallStatusLabel should return empty label when status is undefined', () => {
  const toolCall = createToolCall({})

  const result = getToolCallStatusLabel(toolCall)

  expect(result).toBe('')
})

test('getToolCallStatusLabel should return not-found label', () => {
  const toolCall = createToolCall({ status: 'not-found' })

  const result = getToolCallStatusLabel(toolCall)

  expect(result).toBe(' (not-found)')
})

test('getToolCallStatusLabel should return error label with message', () => {
  const toolCall = createToolCall({
    errorMessage: 'file is outside workspace',
    status: 'error',
  })

  const result = getToolCallStatusLabel(toolCall)

  expect(result).toBe(' (error: file is outside workspace)')
})

test('getToolCallStatusLabel should return generic error label without message', () => {
  const toolCall = createToolCall({ status: 'error' })

  const result = getToolCallStatusLabel(toolCall)

  expect(result).toBe(' (error)')
})

test('getToolCallStatusLabel should return empty label for success status', () => {
  const toolCall = createToolCall({ status: 'success' })

  const result = getToolCallStatusLabel(toolCall)

  expect(result).toBe('')
})
