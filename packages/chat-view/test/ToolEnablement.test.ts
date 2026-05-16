import { expect, test } from '@jest/globals'
import { filterEnabledTools, isToolEnabled, parseToolEnablement } from '../src/parts/ToolEnablement/ToolEnablement.ts'

const expectedDefaultDisabledTools = {
  close_preview: false,
  glob: false,
  open_preview: false,
  render_html: false,
  rg: false,
  run_in_terminal: false,
  spawn_subagent: false,
  update_todo: false,
} as const

test('parseToolEnablement should disable selected tools by default', () => {
  expect(parseToolEnablement(undefined)).toEqual({
    ...expectedDefaultDisabledTools,
  })
  expect(parseToolEnablement({ read_file: true })).toEqual({
    ...expectedDefaultDisabledTools,
    read_file: true,
  })
})

test('isToolEnabled should disable selected tools when not explicitly enabled', () => {
  for (const toolName of Object.keys(expectedDefaultDisabledTools)) {
    expect(isToolEnabled(undefined, toolName)).toBe(false)
    expect(isToolEnabled({}, toolName)).toBe(false)
    expect(isToolEnabled({ [toolName]: true }, toolName)).toBe(true)
  }
  expect(isToolEnabled(undefined, 'read_file')).toBe(true)
})

test('filterEnabledTools should omit selected tools by default', () => {
  const tools = [
    {
      function: {
        description: 'Render html',
        name: 'render_html',
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

  expect(filterEnabledTools(tools, undefined)).toEqual([tools[2]])
  expect(
    filterEnabledTools(tools, {
      render_html: true,
      run_in_terminal: true,
    }),
  ).toEqual(tools)
})
