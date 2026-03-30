import { expect, test } from '@jest/globals'
import * as GetDefaultSystemPrompt from '../src/parts/GetDefaultSystemPrompt/GetDefaultSystemPrompt.ts'

test('getDefaultSystemPrompt should instruct the assistant to wrap inline code in backticks', () => {
  const result = GetDefaultSystemPrompt.getDefaultSystemPrompt()

  expect(result).toContain('When mentioning inline commands, file names, identifiers, or short code fragments in responses, wrap them in markdown backticks')
  expect(result).toContain('`nvm install 24.14.1`')
})