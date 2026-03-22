import { expect, test } from '@jest/globals'
import { getToolCallLabel } from '../src/parts/GetToolCallLabel/GetToolCallLabel.ts'

test('getToolCallLabel should render list_files without partial json when arguments are incomplete', () => {
  const result = getToolCallLabel({
    arguments: '{"uri":"file:///workspace/src',
    name: 'list_files',
  })

  expect(result).toBe('list_files')
})

test('getToolCallLabel should render list_files uri once json arguments are complete', () => {
  const result = getToolCallLabel({
    arguments: '{"uri":"file:///workspace/src"}',
    name: 'list_files',
  })

  expect(result).toBe('list_files "file:///workspace/src"')
})
