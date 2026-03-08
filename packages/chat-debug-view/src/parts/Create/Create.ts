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
  databaseName = 'lvce-chat-view-sessions',
  dataBaseVersion = 2,
  eventStoreName = 'chat-view-events',
  sessionIdIndexName = 'sessionId',
): void => {
  const state = {
    ...createDefaultState(),
    assetDir,
    databaseName,
    dataBaseVersion,
    eventStoreName,
    height,
    platform,
    sessionId,
    sessionIdIndexName,
    uid,
    width,
    x,
    y,
  }
  ChatDebugViewStates.set(uid, state, state)
}
