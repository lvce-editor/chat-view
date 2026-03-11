import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleDragEnter from '../src/parts/HandleDragEnter/HandleDragEnter.ts'
import * as HandleDragLeave from '../src/parts/HandleDragLeave/HandleDragLeave.ts'
import * as HandleDragOver from '../src/parts/HandleDragOver/HandleDragOver.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

test('drag enter enables composer drop state', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: false,
  }

  const newState = await HandleDragEnter.handleDragEnter(state, InputName.ComposerDropTarget)

  expect(newState.composerDropActive).toBe(true)
})

test('drag over keeps composer drop state enabled', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: false,
  }

  const newState = await HandleDragOver.handleDragOver(state, InputName.ComposerDropTarget)

  expect(newState.composerDropActive).toBe(true)
})

test('drag enter keeps composer drop state disabled for non-file drags', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: false,
  }

  const newState = await HandleDragEnter.handleDragEnter(state, InputName.ComposerDropTarget, false)

  expect(newState.composerDropActive).toBe(false)
})

test('drag over keeps composer drop state disabled for non-file drags', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: false,
  }

  const newState = await HandleDragOver.handleDragOver(state, InputName.ComposerDropTarget, false)

  expect(newState.composerDropActive).toBe(false)
})

test('drag leave disables composer drop state', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: true,
  }

  const newState = await HandleDragLeave.handleDragLeave(state, InputName.ComposerDropTarget)

  expect(newState.composerDropActive).toBe(false)
})
