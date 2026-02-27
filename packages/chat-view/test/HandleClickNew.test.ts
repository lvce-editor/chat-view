import { expect, test } from '@jest/globals'
import { handleClickNew } from '../src/parts/HandleClickNew/HandleClickNew.ts'

test('handleClickNew should create and select a new session', async () => {
  const state = {
    composerValue: '',
    ignoreNextInput: false,
    inputSource: '',
    inputValue: '',
    lastSubmittedSessionId: '',
    listHeight: 0,
    listItemHeight: 0,
    nextMessageId: 1,
    platform: 'linux',
    prompt: '',
    renamingSessionId: '',
    selectedSessionId: '',
    sessions: [],
    viewMode: 'list',
  } as const

  const result = await handleClickNew(state)

  expect(result.sessions).toHaveLength(1)
  expect(result.selectedSessionId).toBe(result.sessions[0].id)
  expect(result.sessions[0].title).toBe('Chat 1')
})
