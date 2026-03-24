import { expect, test } from '@jest/globals'
import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderFocusContext } from '../src/parts/RenderFocusContext/RenderFocusContext.ts'

test('renderFocusContext should set list focus context when list is focused in list mode', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: 'list' as const, uid: 7, viewMode: 'list' as const }
  const result = renderFocusContext(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetFocusContext, 7, WhenExpression.FocusChatList])
})

test('renderFocusContext should set input focus context for composer focus', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: 'composer' as const, uid: 8 }
  const result = renderFocusContext(oldState, newState)
  expect(result).toEqual([ViewletCommand.SetFocusContext, 8, WhenExpression.FocusChatInput])
})
