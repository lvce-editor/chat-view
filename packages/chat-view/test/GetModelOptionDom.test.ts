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

  const result = GetModelOptionDom.getModelOptionDOm(model, '')

  expect(result[0]).toMatchObject({
    childCount: 1,
    className: ClassNames.Option,
    selected: false,
    type: VirtualDomElements.Option,
    value: 'claude-code',
  })
  expect(result[1]).toMatchObject({
    text: 'Claude Code (OpenRouter)',
  })
})

test('getModelOptionDOm should keep non-openRouter model labels unchanged', () => {
  const model = {
    id: 'test',
    name: 'test',
    provider: 'test' as const,
  }

  const result = GetModelOptionDom.getModelOptionDOm(model, 'test')

  expect(result[0]).toMatchObject({
    selected: true,
  })
  expect(result[1]).toMatchObject({
    text: 'test',
  })
})
