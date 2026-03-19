import { expect, test } from '@jest/globals'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return expected listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toBeDefined()
  const searchListener = result.find((listener) => listener.params?.[0] === 'handleSearchValueChange')
  expect(searchListener).toBeDefined()
})
