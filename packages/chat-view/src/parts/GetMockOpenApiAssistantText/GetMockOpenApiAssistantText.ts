import type { GetOpenApiAssistantTextResult } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import type { StreamingToolCall } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

const parseSseDataLines = (eventChunk: string): readonly string[] => {
  const lines = eventChunk.split('\n')
  const dataLines: string[] = []
  for (const line of lines) {
    if (!line.startsWith('data:')) {
      continue
    }
    dataLines.push(line.slice(5).trimStart())
  }
  return dataLines
}

const emitToolCalls = async (
  toolCallAccumulator: Readonly<Record<number, StreamingToolCall>>,
  onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>,
): Promise<void> => {
  if (!onToolCallsChunk) {
    return
  }
  const toolCalls = Object.entries(toolCallAccumulator)
    .toSorted((a: readonly [string, StreamingToolCall], b: readonly [string, StreamingToolCall]) => Number(a[0]) - Number(b[0]))
    .map((entry: readonly [string, StreamingToolCall]) => entry[1])
    .filter((toolCall) => !!toolCall.name)
  if (toolCalls.length === 0) {
    return
  }
  await onToolCallsChunk(toolCalls)
}

export const getMockOpenApiAssistantText = async (
  stream: boolean,
  onTextChunk?: (chunk: string) => Promise<void>,
  onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>,
  onDataEvent?: (value: unknown) => Promise<void>,
  onEventStreamFinished?: () => Promise<void>,
): Promise<GetOpenApiAssistantTextResult> => {
  const error = MockOpenApiStream.takeErrorResponse()
  if (error) {
    return error
  }

  let text = ''
  let remainder = ''
  let toolCallAccumulator: Readonly<Record<number, StreamingToolCall>> = {}
  let finishedNotified = false

  const notifyFinished = async (): Promise<void> => {
    if (finishedNotified) {
      return
    }
    finishedNotified = true
    if (onEventStreamFinished) {
      await onEventStreamFinished()
    }
  }

  const handleParsedSseEvent = async (parsed: unknown): Promise<void> => {
    if (onDataEvent) {
      await onDataEvent(parsed)
    }
    if (!parsed || typeof parsed !== 'object') {
      return
    }
    const eventType = Reflect.get(parsed, 'type')
    if (eventType === 'response.completed') {
      await notifyFinished()
      return
    }
    if (eventType === 'response.output_text.delta') {
      const delta = Reflect.get(parsed, 'delta')
      if (typeof delta !== 'string' || !delta) {
        return
      }
      text += delta
      if (stream && onTextChunk) {
        await onTextChunk(delta)
      }
      return
    }
    if (eventType === 'response.output_item.added') {
      const outputIndex = Reflect.get(parsed, 'output_index')
      const item = Reflect.get(parsed, 'item')
      if (typeof outputIndex !== 'number' || !item || typeof item !== 'object') {
        return
      }
      if (Reflect.get(item, 'type') !== 'function_call') {
        return
      }
      const name = Reflect.get(item, 'name')
      const argumentsValue = Reflect.get(item, 'arguments')
      const callId = Reflect.get(item, 'call_id')
      toolCallAccumulator = {
        ...toolCallAccumulator,
        [outputIndex]: {
          arguments: typeof argumentsValue === 'string' ? argumentsValue : '',
          ...(typeof callId === 'string'
            ? {
                id: callId,
              }
            : {}),
          name: typeof name === 'string' ? name : '',
        },
      }
      await emitToolCalls(toolCallAccumulator, onToolCallsChunk)
      return
    }
    if (eventType === 'response.function_call_arguments.delta' || eventType === 'response.function_call_arguments.done') {
      const outputIndex = Reflect.get(parsed, 'output_index')
      if (typeof outputIndex !== 'number') {
        return
      }
      const current = toolCallAccumulator[outputIndex] || { arguments: '', name: '' }
      const delta = Reflect.get(parsed, 'delta')
      const argumentsValue = Reflect.get(parsed, 'arguments')
      const name = Reflect.get(parsed, 'name')
      const callId = Reflect.get(parsed, 'call_id')
      const next: StreamingToolCall = {
        arguments:
          typeof argumentsValue === 'string' ? argumentsValue : typeof delta === 'string' ? `${current.arguments}${delta}` : current.arguments,
        ...(typeof callId === 'string'
          ? {
              id: callId,
            }
          : current.id
            ? {
                id: current.id,
              }
            : {}),
        name: typeof name === 'string' && name ? name : current.name,
      }
      toolCallAccumulator = {
        ...toolCallAccumulator,
        [outputIndex]: next,
      }
      await emitToolCalls(toolCallAccumulator, onToolCallsChunk)
    }
  }

  const consumeSseDataLines = async (dataLines: readonly string[]): Promise<void> => {
    for (const line of dataLines) {
      if (line === '[DONE]') {
        await notifyFinished()
        continue
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(line) as unknown
      } catch {
        continue
      }
      await handleParsedSseEvent(parsed)
    }
  }

  while (true) {
    const chunk = await MockOpenApiStream.readNextChunk()
    if (typeof chunk !== 'string') {
      break
    }
    if (chunk.startsWith('data:')) {
      remainder += chunk
      while (true) {
        const separatorIndex = remainder.indexOf('\n\n')
        if (separatorIndex === -1) {
          break
        }
        const rawEvent = remainder.slice(0, separatorIndex)
        remainder = remainder.slice(separatorIndex + 2)
        const dataLines = parseSseDataLines(rawEvent)
        await consumeSseDataLines(dataLines)
      }
      continue
    }
    text += chunk
    if (stream && onTextChunk) {
      await onTextChunk(chunk)
    }
  }

  if (remainder) {
    const dataLines = parseSseDataLines(remainder)
    await consumeSseDataLines(dataLines)
  }

  await notifyFinished()

  return {
    text,
    type: 'success',
  }
}
