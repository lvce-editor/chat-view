import * as ChatDebugViewStates from '../State/ChatDebugViewStates.ts'
import { createDefaultState } from '../State/CreateDefaultState.ts'

export const create = (
  uid: number,
  x: number,
  y: number,
  width: number,
  height: number,
  platform: number,
  assetDir: string,
  sessionId = '',
): void => {
  const state = {
    ...createDefaultState(),
    assetDir,
    height,
    platform,
    sessionId,
    uid,
    width,
    x,
    y,
  }
  ChatDebugViewStates.set(uid, state, state)
}
