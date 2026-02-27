import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import { createSession } from './CreateSession/CreateSession.ts'
import { deleteSession } from './DeleteSession/DeleteSession.ts'
import { handleClickSend } from './HandleClickSend/HandleClickSend.ts'
import { selectSession } from './SelectSession/SelectSession.ts'
import { startRename } from './StartRename/StartRename.ts'

export { handleClickSend }

const CREATE_SESSION = 'create-session'
const SESSION_PREFIX = 'session:'
const RENAME_PREFIX = 'session-rename:'
const DELETE_PREFIX = 'session-delete:'
const SEND = 'send'
const BACK = 'back'

export const handleClick = async (state: ChatState, name: string): Promise<ChatState> => {
  if (!name) {
    return state
  }
  if (name === CREATE_SESSION) {
    return createSession(state)
  }
  if (name.startsWith(SESSION_PREFIX)) {
    const id = name.slice(SESSION_PREFIX.length)
    return selectSession(state, id)
  }
  if (name.startsWith(RENAME_PREFIX)) {
    const id = name.slice(RENAME_PREFIX.length)
    return startRename(state, id)
  }
  if (name.startsWith(DELETE_PREFIX)) {
    const id = name.slice(DELETE_PREFIX.length)
    return deleteSession(state, id)
  }
  if (name === SEND) {
    return handleClickSend(state)
  }
  if (name === BACK) {
    return {
      ...state,
      renamingSessionId: '',
      viewMode: 'list',
    }
  }
  return state
}
