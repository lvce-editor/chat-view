import type { ChatDebugViewState } from './ChatDebugViewState.ts'

export const createDefaultState = (): ChatDebugViewState => {
  return {
    assetDir: '',
    databaseName: 'lvce-chat-view-sessions',
    dataBaseVersion: 2,
    errorMessage: '',
    events: [],
    eventStoreName: 'chat-view-events',
    filterValue: '',
    height: 0,
    initial: true,
    platform: 0,
    sessionId: '',
    sessionIdIndexName: 'sessionId',
    showInputEvents: true,
    uid: 0,
    width: 0,
    x: 0,
    y: 0,
  }
}
