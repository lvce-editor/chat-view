import { expect, test } from '@jest/globals'
import * as GetBoolean from '../src/parts/GetBoolean/GetBoolean.ts'

test('getBoolean should return true for boolean true', () => {
  expect(GetBoolean.getBoolean(true)).toBe(true)
})

test('getBoolean should return true for string true', () => {
  expect(GetBoolean.getBoolean('true')).toBe(true)
})

test('getBoolean should return true for string on', () => {
  expect(GetBoolean.getBoolean('on')).toBe(true)
})

test('getBoolean should return true for string 1', () => {
  expect(GetBoolean.getBoolean('1')).toBe(true)
})

test('getBoolean should return false for boolean false', () => {
  expect(GetBoolean.getBoolean(false)).toBe(false)
})

test('getBoolean should return false for unchecked string values', () => {
  expect(GetBoolean.getBoolean('off')).toBe(false)
})
