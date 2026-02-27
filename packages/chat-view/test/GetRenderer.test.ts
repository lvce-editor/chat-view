import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetRenderer from '../src/parts/GetRenderer/GetRenderer.ts'
import * as RenderCss from '../src/parts/RenderCss/RenderCss.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('getRenderer should return RenderItems.renderItems for RenderItems diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  expect(renderer).toBe(RenderItems.renderItems)
})

test('getRenderer should return a renderer for RenderIncremental diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderIncremental)
  expect(typeof renderer).toBe('function')
})

test('getRenderer should return RenderCss.renderCss for RenderCss diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderCss)
  expect(renderer).toBe(RenderCss.renderCss)
})

test('getRenderer should throw error for unknown diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(999)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for negative diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(-1)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for zero diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(0)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for other known diff types not implemented', () => {
  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderEditingIndex)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderFocus)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderFocusContext)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderValue)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderSelection)
  }).toThrow('unknown renderer')
})

test('getRenderer should return a function that can be called with state', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = createDefaultState()

  expect(typeof renderer).toBe('function')
  expect(() => {
    renderer(oldState, newState)
  }).not.toThrow()
})
