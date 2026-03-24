import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetModelOptionDom from '../src/parts/GetModelOptionDom/GetModelOptionDom.ts'

test('getModelOptionDOm should append OpenRouter to openRouter model labels', () => {
  const model = {
    id: 'claude-code',
    name: 'Claude Code',
    provider: 'openRouter' as const,
  }

  const result = GetModelOptionDom.getModelOptionDom(model, '')

  expect(result).toEqual([
    {
      childCount: 1,
      className: ClassNames.Option,
      selected: false,
      type: VirtualDomElements.Option,
      value: 'claude-code',
    },
    expect.objectContaining({
      text: 'Claude Code (OpenRouter)',
    }),
  ])
})

test('getModelOptionDOm should keep non-openRouter model labels unchanged', () => {
  const model = {
    id: 'test',
    name: 'test',
    provider: 'test' as const,
  }

  const result = GetModelOptionDom.getModelOptionDom(model, 'test')

  expect(result).toEqual([
    expect.objectContaining({
      selected: true,
    }),
    expect.objectContaining({
      text: 'test',
    }),
  ])
})

test('getModelOptionDOm should append OpenAI to openApi model labels', () => {
  const model = {
    id: 'openapi/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openApi' as const,
  }

  const result = GetModelOptionDom.getModelOptionDom(model, '')

  expect(result).toEqual([
    expect.objectContaining({
      value: 'openapi/gpt-4o-mini',
    }),
    expect.objectContaining({
      text: 'GPT-4o Mini (OpenAI)',
    }),
  ])
})
