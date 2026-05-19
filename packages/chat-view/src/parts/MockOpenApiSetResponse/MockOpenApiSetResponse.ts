import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiSetResponse = async (state: ChatState, body: unknown): Promise<ChatState> => {
  const serialized = typeof body === 'string' ? body : JSON.stringify(body) || 'null'
  MockOpenApiStream.reset()
  MockOpenApiStream.pushChunk(serialized)
  MockOpenApiStream.finish()
  await ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamReset')
  await ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamPushChunk', serialized)
  await ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamFinish')
  return state
}
