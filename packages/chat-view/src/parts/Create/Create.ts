import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../CreateDefaultState/CreateDefaultState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: StatusBarState = {
    ...createDefaultState(),
    assetDir,
    platform,
    uid,
  }
  set(uid, state, state)
}
