import { expect, test } from '@jest/globals'
import { getToolCallResult } from '../src/parts/GetOpenApiAssistantText/GetOpenApiAssistantText.ts'

test('getToolCallResult should preserve finished glob results with countable matches', () => {
  const content = JSON.stringify(['src/a.ts', 'src/b.ts', 'src/c.ts'])

  const result = getToolCallResult('glob', content)

  expect(result).toBe(content)
})

test('getToolCallResult should ignore glob results without a match count', () => {
  const result = getToolCallResult('glob', JSON.stringify({ ok: true }))

  expect(result).toBeUndefined()
})