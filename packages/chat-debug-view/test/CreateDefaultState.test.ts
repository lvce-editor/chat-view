import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/State/CreateDefaultState.ts'

test('createDefaultState should return expected defaults', () => {
  const state = createDefaultState()

  expect(state).toEqual({
    assetDir: '',
    databaseName: 'lvce-chat-view-sessions',
    dataBaseVersion: 2,
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
    uri: '',
    width: 0,
    x: 0,
    y: 0,
  })
})
