import { expect, test } from '@jest/globals'
import { getReadFileTarget } from '../src/parts/GetReadFileTarget/GetReadFileTarget.ts'

test('getReadFileTarget should return target for complete uri arguments', () => {
  const result = getReadFileTarget('{"uri":"file:///workspace/src/index.ts"}')

  expect(result).toEqual({
    clickableUri: 'file:///workspace/src/index.ts',
    title: 'file:///workspace/src/index.ts',
  })
})

test('getReadFileTarget should ignore partial json arguments', () => {
  const result = getReadFileTarget('{"uri":"file:///workspace/src/index.ts"')

  expect(result).toBeUndefined()
})

test('getReadFileTarget should ignore unclosed quoted values', () => {
  const result = getReadFileTarget('{"uri":"file:///workspace/src/{index.ts}')

  expect(result).toBeUndefined()
})
