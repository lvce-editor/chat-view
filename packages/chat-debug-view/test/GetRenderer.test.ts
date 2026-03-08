import { expect, test } from '@jest/globals'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetRenderer from '../src/parts/GetRenderer/GetRenderer.ts'
import * as RenderCss from '../src/parts/RenderCss/RenderCss.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('getRenderer should return RenderCss renderer for RenderCss diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderCss)
  expect(renderer).toBe(RenderCss.renderCss)
})

test('getRenderer should return RenderItems renderer for RenderItems diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  expect(renderer).toBe(RenderItems.renderItems)
})

test('getRenderer should throw for unknown diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(999)
  }).toThrow('unknown renderer')
})
