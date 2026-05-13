import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'

export const createNewSession = async (): Promise<string> => {
  const sessionId = crypto.randomUUID()
  const date = new Date()
  const timestamp = date.toISOString()
  await ChatCoordinatorWorker.invoke('ChatCoordinator.createSession', {
    sessionId,
    timestamp,
  })
  return sessionId
}
