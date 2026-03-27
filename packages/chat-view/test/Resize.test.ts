import { expect, jest, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Resize from '../src/parts/Resize/Resize.ts'

test('resize should merge dimensions into state', async () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {
    height: 50,
    width: 100,
  }
  const result = await Resize.resize(state, dimensions)
  expect(result.width).toBe(100)
  expect(result.height).toBe(50)
  expect(result.uid).toBe(1)
})

test('resize should preserve existing state properties', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    disposed: true,
    uid: 5,
  }
  const dimensions = {
    width: 200,
  }
  const result = await Resize.resize(state, dimensions)
  expect(result.width).toBe(200)
  expect(result.uid).toBe(5)
  expect(result.disposed).toBe(true)
})

test('resize should overwrite existing properties in dimensions', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    uid: 1,
  }
  const dimensions = {
    uid: 10,
    width: 300,
  }
  const result = await Resize.resize(state, dimensions)
  expect(result.uid).toBe(10)
  expect(result.width).toBe(300)
})

test('resize should handle empty dimensions', async () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {}
  const result = await Resize.resize(state, dimensions)
  expect(result).toEqual(state)
  expect(result.uid).toBe(1)
})

test('resize should not mutate original state', async () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {
    height: 50,
    width: 100,
  }
  const originalUid = state.uid
  await Resize.resize(state, dimensions)
  expect(state.uid).toBe(originalUid)
  expect(state.width).toBe(0)
  expect(state.height).toBe(0)
})

test('resize should handle multiple dimension properties', async () => {
  const state: ChatState = { ...createDefaultState(), uid: 1 }
  const dimensions = {
    height: 50,
    width: 100,
    x: 10,
    y: 20,
  }
  const result = await Resize.resize(state, dimensions)
  expect(result.width).toBe(100)
  expect(result.height).toBe(50)
  expect(result.x).toBe(10)
  expect(result.y).toBe(20)
  expect(result.uid).toBe(1)
})

test('resize should recompute composer height when width changes', async () => {
  const getComposerHeight = jest.fn(async (_state: ChatState, _value: string, _width: number) => 48)
  const state: ChatState = {
    ...createDefaultState(),
    composerHeight: 68,
    composerValue: 'this line should wrap differently',
    width: 400,
  }
  const result = await Resize.resize(state, { width: 200 }, getComposerHeight)
  expect(getComposerHeight).toHaveBeenCalledWith(expect.objectContaining({ width: 200 }), state.composerValue, 200)
  expect(result.composerHeight).toBe(48)
})

test('resize should recompute attachment height when width changes', async () => {
  const getComposerHeight = jest.fn(async (_state: ChatState, _value: string, _width: number) => 48)
  const state: ChatState = {
    ...createDefaultState(),
    composerAttachments: [
      {
        attachmentId: 'attachment-1',
        displayType: 'text-file',
        mimeType: 'text/plain',
        name: 'very-long-attachment-name.txt',
        size: 1,
      },
      {
        attachmentId: 'attachment-2',
        displayType: 'text-file',
        mimeType: 'text/plain',
        name: 'second-very-long-attachment-name.txt',
        size: 1,
      },
    ],
    width: 400,
  }
  const result = await Resize.resize(state, { width: 200 }, getComposerHeight)
  expect(getComposerHeight).not.toHaveBeenCalled()
  expect(result.composerAttachmentsHeight).toBeGreaterThan(0)
})

test('resize should preserve composer height when width does not change', async () => {
  const getComposerHeight = jest.fn(async (_state: ChatState, _value: string, _width: number) => 48)
  const state: ChatState = {
    ...createDefaultState(),
    composerHeight: 68,
    composerValue: 'this line should wrap differently',
    width: 400,
  }
  const result = await Resize.resize(state, { height: 500 }, getComposerHeight)
  expect(getComposerHeight).not.toHaveBeenCalled()
  expect(result.composerHeight).toBe(68)
})
