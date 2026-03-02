import type { GetDatabasePromise, SetDatabasePromise } from '../GetDatabase/GetDatabase.ts'
import { getDatabase } from '../GetDatabase/GetDatabase.ts'
import { LVCE_CHAT_SESSIONS_STORE } from '../IndexedDbChatSessionStorageConstants/IndexedDbChatSessionStorageConstants.ts'
import { transactionToPromise } from '../TransactionToPromise/TransactionToPromise.ts'

export const deleteSession = async (getDatabasePromise: GetDatabasePromise, setDatabasePromise: SetDatabasePromise, id: string): Promise<void> => {
  const database = await getDatabase(getDatabasePromise, setDatabasePromise)
  const transaction = database.transaction(LVCE_CHAT_SESSIONS_STORE, 'readwrite')
  const createTransaction = (): IDBTransaction => transaction
  const store = transaction.objectStore(LVCE_CHAT_SESSIONS_STORE)
  store.delete(id)
  await transactionToPromise(createTransaction)
}
