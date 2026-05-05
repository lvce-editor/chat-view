const defaultRequestId = 'default'

const chunksByRequestId = new Map<string, string[]>()

const getChunks = (requestId: string): string[] => {
  const existing = chunksByRequestId.get(requestId)
  if (existing) {
    return existing
  }
  const nextChunks: string[] = []
  chunksByRequestId.set(requestId, nextChunks)
  return nextChunks
}

export const reset = (requestId: string = defaultRequestId): void => {
  chunksByRequestId.set(requestId, [])
}

export const pushChunk = (chunk: string, requestId: string = defaultRequestId): void => {
  getChunks(requestId).push(chunk)
}

export const consumeResponseText = (requestId: string = defaultRequestId): string => {
  const chunks = getChunks(requestId)
  const text = chunks.join('')
  chunksByRequestId.delete(requestId)
  return text
}