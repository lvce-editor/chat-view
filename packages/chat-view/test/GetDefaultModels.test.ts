import { expect, test } from '@jest/globals'
import { defaultModelProviderSettings, getDefaultModels } from '../src/parts/GetDefaultModels/GetDefaultModels.ts'

test('getDefaultModels should return builtin and test models by default', () => {
  const result = getDefaultModels(defaultModelProviderSettings)
  expect(result.map((model) => model.id)).toEqual(['builtin/gpt-5.4', 'builtin/gpt-4.1', 'test'])
})

test('getDefaultModels should include openai models when enabled', () => {
  const result = getDefaultModels({
    anthropic: false,
    builtin: true,
    openai: true,
    test: true,
  })
  expect(result.map((model) => model.id)).toEqual([
    'builtin/gpt-5.4',
    'builtin/gpt-4.1',
    'openapi/codex-5.3',
    'openapi/gpt-5.4-mini',
    'openapi/gpt-5-mini',
    'openapi/gpt-4o-mini',
    'openapi/gpt-4o',
    'openapi/gpt-4.1-mini',
    'test',
  ])
})

test('getDefaultModels should exclude disabled providers', () => {
  const result = getDefaultModels({
    anthropic: false,
    builtin: false,
    openai: false,
    test: false,
  })
  expect(result).toEqual([])
})
