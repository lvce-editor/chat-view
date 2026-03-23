import { expect, test } from '@jest/globals'
import { getModelPickerClickIndex } from '../src/parts/GetModelPickerClickIndex/GetModelPickerClickIndex.ts'

test('getModelPickerClickIndex should return first row for top click in picker list', () => {
  const result = getModelPickerClickIndex(20, 400, 330)
  expect(result).toBe(0)
})

test('getModelPickerClickIndex should return second row for click one item below', () => {
  const result = getModelPickerClickIndex(20, 400, 358)
  expect(result).toBe(1)
})

test('getModelPickerClickIndex should return -1 for clicks above picker list area', () => {
  const result = getModelPickerClickIndex(20, 400, 329)
  expect(result).toBe(-1)
})
