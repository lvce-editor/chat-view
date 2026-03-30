import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

const createState = (uid: number, overrides: Partial<ChatState> = {}): ChatState => {
  return {
    ...createDefaultState(),
    uid,
    ...overrides,
  }
}

test('applyStateUpdate should serialize updates for the same uid', async () => {
  const uid = 901
  const initialState = createState(uid)
  StatusBarStates.set(uid, initialState, initialState)

  let releaseFirstUpdate: (() => void) | undefined
  const firstUpdateStarted = new Promise<void>((resolve) => {
    releaseFirstUpdate = resolve
  })

  const firstUpdate = StatusBarStates.applyStateUpdate(
    uid,
    async (state) => {
      await firstUpdateStarted
      return {
        ...state,
        composerValue: 'first',
      }
    },
    { rerender: false },
  )

  const secondUpdate = StatusBarStates.applyStateUpdate(
    uid,
    (state) => ({
      ...state,
      composerValue: `${state.composerValue}-second`,
    }),
    { rerender: false },
  )

  releaseFirstUpdate?.()
  await firstUpdate
  const secondResult = await secondUpdate

  expect(secondResult.nextState.composerValue).toBe('first-second')
  expect(StatusBarStates.get(uid).newState.composerValue).toBe('first-second')
})

test('applyStateUpdate should continue after a failed update', async () => {
  const uid = 902
  const initialState = createState(uid)
  StatusBarStates.set(uid, initialState, initialState)

  await expect(
    StatusBarStates.applyStateUpdate(
      uid,
      async () => {
        throw new Error('update failed')
      },
      { rerender: false },
    ),
  ).rejects.toThrow('update failed')

  const result = await StatusBarStates.applyStateUpdate(
    uid,
    (state) => ({
      ...state,
      composerValue: 'recovered',
    }),
    { rerender: false },
  )

  expect(result.nextState.composerValue).toBe('recovered')
  expect(StatusBarStates.get(uid).newState.composerValue).toBe('recovered')
})