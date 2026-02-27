import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderCss from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss should return setCss command with uid and css', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = { ...createDefaultState(), uid: 42 }
  const result = RenderCss.renderCss(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetCss)
  expect(result[1]).toBe(42)
  expect(typeof result[2]).toBe('string')
  expect(result[2].length).toBeGreaterThan(0)
})
