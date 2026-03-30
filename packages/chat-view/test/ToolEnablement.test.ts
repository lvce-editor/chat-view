import { expect, test } from '@jest/globals'
import { filterEnabledTools, isToolEnabled, parseToolEnablement } from '../src/parts/ToolEnablement/ToolEnablement.ts'

test('parseToolEnablement should disable run_in_terminal by default', () => {
  expect(parseToolEnablement(undefined)).toEqual({
    run_in_terminal: false,
  })
  expect(parseToolEnablement({ read_file: true })).toEqual({
    read_file: true,
    run_in_terminal: false,
  })
})

test('isToolEnabled should disable run_in_terminal when not explicitly enabled', () => {
  expect(isToolEnabled(undefined, 'run_in_terminal')).toBe(false)
  expect(isToolEnabled({}, 'run_in_terminal')).toBe(false)
  expect(isToolEnabled({ run_in_terminal: true }, 'run_in_terminal')).toBe(true)
  expect(isToolEnabled(undefined, 'read_file')).toBe(true)
})

test('filterEnabledTools should omit run_in_terminal by default', () => {
  const tools = [
    {
      function: {
        description: 'Run terminal command',
        name: 'run_in_terminal',
        parameters: {
          additionalProperties: false,
          properties: {},
          type: 'object',
        },
      },
      type: 'function',
    },
    {
      function: {
        description: 'Read file',
        name: 'read_file',
        parameters: {
          additionalProperties: false,
          properties: {},
          type: 'object',
        },
      },
      type: 'function',
    },
  ] as const

  expect(filterEnabledTools(tools, undefined)).toEqual([tools[1]])
  expect(filterEnabledTools(tools, { run_in_terminal: true })).toEqual(tools)
})