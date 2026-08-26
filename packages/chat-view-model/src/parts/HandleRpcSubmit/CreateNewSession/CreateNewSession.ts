import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'

export const createNewSession = async (title: string = ''): Promise<string> => {
  const sessionId = crypto.randomUUID()
  const date = new Date()
  const timestamp = date.toISOString()
  await ChatCoordinatorWorker.invoke('ChatCoordinator.createSession', {
    sessionId,
    timestamp,
    title,
  })
  return sessionId
}
