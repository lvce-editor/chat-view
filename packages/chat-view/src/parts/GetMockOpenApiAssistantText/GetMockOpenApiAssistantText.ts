import type { GetOpenApiAssistantTextResult } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const getMockOpenApiAssistantText = async (
  stream: boolean,
  onTextChunk?: (chunk: string) => Promise<void>,
): Promise<GetOpenApiAssistantTextResult> => {
  let text = ''
  while (true) {
    const chunk = await MockOpenApiStream.readNextChunk()
    if (typeof chunk !== 'string') {
      break
    }
    text += chunk
    if (stream && onTextChunk) {
      await onTextChunk(chunk)
    }
  }
  return {
    text,
    type: 'success',
  }
}
