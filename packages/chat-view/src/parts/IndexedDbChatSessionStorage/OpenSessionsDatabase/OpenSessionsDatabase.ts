import {
  LVCE_CHAT_SESSIONS_DB_NAME,
  LVCE_CHAT_SESSIONS_DB_VERSION,
  LVCE_CHAT_SESSIONS_STORE,
} from '../IndexedDbChatSessionStorageConstants/IndexedDbChatSessionStorageConstants.ts'
import { requestToPromise } from '../RequestToPromise/RequestToPromise.ts'

export const openSessionsDatabase = async (): Promise<IDBDatabase> => {
  const request = indexedDB.open(LVCE_CHAT_SESSIONS_DB_NAME, LVCE_CHAT_SESSIONS_DB_VERSION)
  request.addEventListener('upgradeneeded', () => {
    const database = request.result
    if (!database.objectStoreNames.contains(LVCE_CHAT_SESSIONS_STORE)) {
      database.createObjectStore(LVCE_CHAT_SESSIONS_STORE, {
        keyPath: 'id',
      })
    }
  })
  return requestToPromise(() => request)
}
