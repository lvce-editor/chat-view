import { expect, test } from '@jest/globals'
import { verifyToolCallArguments } from '../src/parts/HandleToolCall/VerifyToolCallArguments.ts'

test('verifyToolCallArguments should accept valid read_file args', () => {
  const result = verifyToolCallArguments('read_file', {
    path: 'src/index.ts',
  })
  expect(result).toEqual({
    type: 'success',
    value: {
      path: 'src/index.ts',
    },
  })
})

test('verifyToolCallArguments should reject unknown tools', () => {
  const result = verifyToolCallArguments('unknown_tool', {})
  expect(result).toEqual({
    message: 'Unknown tool: unknown_tool',
    type: 'error',
  })
})

test('verifyToolCallArguments should reject missing required args', () => {
  const result = verifyToolCallArguments('write_file', {
    path: 'src/index.ts',
  })
  expect(result).toEqual({
    message: 'Missing required argument: content',
    type: 'error',
  })
})

test('verifyToolCallArguments should reject invalid arg type', () => {
  const result = verifyToolCallArguments('read_file', {
    path: 123,
  })
  expect(result).toEqual({
    message: 'Invalid argument type for path: expected string',
    type: 'error',
  })
})

test('verifyToolCallArguments should reject unexpected args', () => {
  const result = verifyToolCallArguments('list_files', {
    extra: true,
  })
  expect(result).toEqual({
    message: 'Unexpected argument: extra',
    type: 'error',
  })
})
