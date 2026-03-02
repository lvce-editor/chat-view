import { openSessionsDatabase } from '../OpenSessionsDatabase/OpenSessionsDatabase.ts'

export type GetDatabasePromise = () => Promise<IDBDatabase> | undefined
export type SetDatabasePromise = (databasePromise: Readonly<Promise<IDBDatabase>>) => void

export const getDatabase = async (getDatabasePromise: GetDatabasePromise, setDatabasePromise: SetDatabasePromise): Promise<IDBDatabase> => {
  const existingDatabasePromise = getDatabasePromise()
  if (existingDatabasePromise) {
    return existingDatabasePromise
  }
  const nextDatabasePromise = openSessionsDatabase()
  setDatabasePromise(nextDatabasePromise)
  return nextDatabasePromise
}
