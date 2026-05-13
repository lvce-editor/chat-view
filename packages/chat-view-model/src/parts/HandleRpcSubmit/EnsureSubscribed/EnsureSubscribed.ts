import { subscribeSessionUpdates } from '../../ChatSessionStorage/ChatSessionStorage.ts'
import { getSubscribedSessionId, setSubscribedSessionId } from '../../ModelState/ModelState.ts'

export const ensureSubscribed = async (uid: number, sessionId: string): Promise<void> => {
  if (getSubscribedSessionId(uid) === sessionId) {
    return
  }
  await subscribeSessionUpdates(uid, sessionId)
  setSubscribedSessionId(uid, sessionId)
}
