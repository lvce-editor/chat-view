import { expect, test } from '@jest/globals'
import { getOpenAiParams } from '../src/parts/GetOpenApiAssistantText/GetOpenApiAssistantText.ts'

test('getOpenAiParams should include reasoning effort when provided', () => {
  const result = getOpenAiParams([], 'gpt-5', false, false, [], false, 1, '', undefined, 'extra-high') as {
    readonly reasoning?: {
      readonly effort?: string
    }
  }
  expect(result.reasoning).toEqual({
    effort: 'extra-high',
  })
})

test('getOpenAiParams should omit reasoning effort by default', () => {
  const result = getOpenAiParams([], 'gpt-5', false, false, [], false, 1) as {
    readonly reasoning?: {
      readonly effort?: string
    }
  }
  expect(result.reasoning).toBeUndefined()
})
