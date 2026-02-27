import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickDelete from '../src/parts/HandleClickDelete/HandleClickDelete.ts'

test('handleClickDelete should delete a session', async () => {
  const state = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClickDelete.handleClickDelete(state, 'session-2')
  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toBe('session-1')
})
