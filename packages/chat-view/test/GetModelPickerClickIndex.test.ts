import { expect, test } from '@jest/globals'
import { getModelPickerClickIndex } from '../src/parts/GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { modelPickerBottomOffset } from '../src/parts/ModelPickerBottomOffset/ModelPickerBottomOffset.ts'

test('getModelPickerClickIndex should return first row for top click in picker list', () => {
  const result = getModelPickerClickIndex(20, 400, 426, modelPickerBottomOffset, 28, 140, 140, 0)
  expect(result).toBe(0)
})

test('getModelPickerClickIndex should return second row for click one item below', () => {
  const result = getModelPickerClickIndex(20, 400, 454, modelPickerBottomOffset, 28, 140, 140, 0)
  expect(result).toBe(1)
})

test('getModelPickerClickIndex should return -1 for clicks above picker list area', () => {
  const result = getModelPickerClickIndex(20, 400, 411, modelPickerBottomOffset, 28, 140, 140, 0)
  expect(result).toBe(-1)
})

test('getModelPickerClickIndex should account for model picker list scrollTop', () => {
  const result = getModelPickerClickIndex(20, 400, 426, modelPickerBottomOffset, 28, 140, 140, 56)
  expect(result).toBe(2)
})
