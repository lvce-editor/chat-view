import type { ChatSession } from '../../ChatSession/ChatSession.ts'
import type { GetDatabasePromise, SetDatabasePromise } from '../GetDatabase/GetDatabase.ts'
import { getDatabase } from '../GetDatabase/GetDatabase.ts'
import { LVCE_CHAT_SESSIONS_STORE } from '../IndexedDbChatSessionStorageConstants/IndexedDbChatSessionStorageConstants.ts'
import { requestToPromise } from '../RequestToPromise/RequestToPromise.ts'

export const getSession = async (
  getDatabasePromise: GetDatabasePromise,
  setDatabasePromise: SetDatabasePromise,
  id: string,
): Promise<ChatSession | undefined> => {
  const database = await getDatabase(getDatabasePromise, setDatabasePromise)
  const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readonly')
  const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
  const result = await requestToPromise(() => store.get(id))
  return result
}
