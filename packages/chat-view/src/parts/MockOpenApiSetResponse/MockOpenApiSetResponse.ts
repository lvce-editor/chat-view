import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiSetResponse = async (state: ChatState, body: unknown): Promise<ChatState> => {
  const responses = Array.isArray(body) ? body : [body]
  if (responses.length === 1) {
    const serialized = typeof responses[0] === 'string' ? responses[0] : JSON.stringify(responses[0]) || 'null'
    MockOpenApiStream.reset()
    MockOpenApiStream.pushChunk(serialized)
    MockOpenApiStream.finish()
  } else {
    for (let i = 0; i < responses.length; i += 1) {
      const response = responses[i]
      const requestId = `mock-response-${i + 1}`
      const serialized = typeof response === 'string' ? response : JSON.stringify(response) || 'null'
      MockOpenApiStream.reset(requestId)
      MockOpenApiStream.pushChunk(serialized, requestId)
      MockOpenApiStream.finish(requestId)
    }
  }
  for (const response of responses) {
    await ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiSetResponse', response)
  }
  return state
}
