import type { ChatState } from '../ChatState/ChatState.ts'
import { createDefaultState } from '../CreateDefaultState/CreateDefaultState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: ChatState = {
    ...createDefaultState(),
    assetDir,
    height,
    platform,
    uid,
    uri,
    width,
    x,
    y,
  }
  set(uid, state, state)
}
