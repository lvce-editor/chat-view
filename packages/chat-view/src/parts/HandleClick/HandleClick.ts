/* eslint-disable @cspell/spellchecker */
import type { ChatState } from '../ChatState/ChatState.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { deleteSession } from '../DeleteSession/DeleteSession.ts'
import { handleClickSaveOpenRouterApiKey } from '../HandleClickSaveOpenRouterApiKey/HandleClickSaveOpenRouterApiKey.ts'
import { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'
import { SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'
import { startRename } from '../StartRename/StartRename.ts'

const CREATE_SESSION = 'create-session'
const SESSION_PREFIX = 'session:'
const RENAME_PREFIX = 'session-rename:'
const SESSION_DELETE = 'SessionDelete'
const SEND = 'send'

export const handleClick = async (state: ChatState, name: string, id = ''): Promise<ChatState> => {
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
  if (name === SESSION_DELETE) {
    return deleteSession(state, id)
  }
  if (name === SEND) {
    return handleClickSend(state)
  }
  if (name === SaveOpenRouterApiKey) {
    return handleClickSaveOpenRouterApiKey(state)
  }
  return state
}

export { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'

export { handleClickList } from '../HandleClickList/HandleClickList.ts'
