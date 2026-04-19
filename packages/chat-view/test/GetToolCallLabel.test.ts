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

test('getToolCallLabel should render glob without partial json when arguments are incomplete', () => {
  const result = getToolCallLabel({
    arguments: '{"baseUri":"file:///workspace/src',
    name: 'glob',
  })

  expect(result).toBe('glob')
})

test('getToolCallLabel should render run_in_terminal with options command only', () => {
  const result = getToolCallLabel({
    arguments: '{"options":{"command":"node -v","shell":"bash"}}',
    name: 'run_in_terminal',
  })

  expect(result).toBe('run_in_terminal "node -v"')
})

test('getToolCallLabel should render grep_search query only', () => {
  const result = getToolCallLabel({
    arguments: '{"includeIgnoredFiles":false,"includePattern":"**","isRegexp":false,"maxResults":10,"query":"hello"}',
    name: 'grep_search',
  })

  expect(result).toBe('grep_search "hello"')
})

test('getToolCallLabel should render grep_search without partial json when arguments are incomplete', () => {
  const result = getToolCallLabel({
    arguments: '{"includeIgnoredFiles":false,"query":"hel',
    name: 'grep_search',
  })

  expect(result).toBe('grep_search')
})

test('getToolCallLabel should render rename as from to filenames', () => {
  const result = getToolCallLabel({
    arguments: '{"oldUri":"file:///workspace/packages/memory","newUri":"file:///workspace/packages/memory.bak"}',
    name: 'rename',
  })

  expect(result).toBe('rename memory -> memory.bak')
})

test('getToolCallLabel should render rename without partial json when arguments are incomplete', () => {
  const result = getToolCallLabel({
    arguments: '{"oldUri":"file:///workspace/packages/memo',
    name: 'rename',
  })

  expect(result).toBe('rename')
})

test('getToolCallLabel should render web_search_call with status label', () => {
  const result = getToolCallLabel({
    arguments: '',
    name: 'web_search_call',
    status: 'in-progress',
  })

  expect(result).toBe('web_search (in progress)')
})
