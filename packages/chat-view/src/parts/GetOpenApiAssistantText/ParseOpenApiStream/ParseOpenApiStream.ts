import type {
  GetOpenApiAssistantTextResult,
  StreamingToolCall,
} from '../GetOpenApiAssistantTextTypes/GetOpenApiAssistantTextTypes.ts'
import { getStreamChunkText } from '../GetStreamChunkText/GetStreamChunkText.ts'
import { parseSseEvent } from '../ParseSseEvent/ParseSseEvent.ts'
import { updateToolCallAccumulator } from '../UpdateToolCallAccumulator/UpdateToolCallAccumulator.ts'

export const parseOpenApiStream = async (
  response: Response,
  onTextChunk?: (chunk: string) => Promise<void>,
  onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>,
  onDataEvent?: (value: unknown) => Promise<void>,
  onEventStreamFinished?: () => Promise<void>,
): Promise<GetOpenApiAssistantTextResult> => {
  if (!response.body) {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let remainder = ''
  let text = ''
  let done = false
  let finishedNotified = false
  let toolCallAccumulator: Readonly<Record<number, StreamingToolCall>> = {}

  const notifyFinished = async (): Promise<void> => {
    if (finishedNotified) {
      return
    }
    finishedNotified = true
    if (onEventStreamFinished) {
      await onEventStreamFinished()
    }
  }

  const emitToolCallAccumulator = async (): Promise<void> => {
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

  const handleParsedStreamEvent = async (parsed: unknown): Promise<void> => {
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
      if (onTextChunk) {
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
      const itemType = Reflect.get(item, 'type')
      if (itemType !== 'function_call') {
        return
      }
      const callId = Reflect.get(item, 'call_id')
      const name = Reflect.get(item, 'name')
      const rawArguments = Reflect.get(item, 'arguments')
      const next: StreamingToolCall = {
        arguments: typeof rawArguments === 'string' ? rawArguments : '',
        ...(typeof callId === 'string'
          ? {
              id: callId,
            }
          : {}),
        name: typeof name === 'string' ? name : '',
      }
      toolCallAccumulator = {
        ...toolCallAccumulator,
        [outputIndex]: next,
      }
      await emitToolCallAccumulator()
      return
    }

    if (eventType === 'response.function_call_arguments.delta' || eventType === 'response.function_call_arguments.done') {
      const outputIndex = Reflect.get(parsed, 'output_index')
      if (typeof outputIndex !== 'number') {
        return
      }
      const current = toolCallAccumulator[outputIndex] || { arguments: '', name: '' }
      const name = Reflect.get(parsed, 'name')
      const callId = Reflect.get(parsed, 'call_id')
      const delta = Reflect.get(parsed, 'delta')
      const rawArguments = Reflect.get(parsed, 'arguments')
      const next: StreamingToolCall = {
        arguments: typeof rawArguments === 'string' ? rawArguments : typeof delta === 'string' ? `${current.arguments}${delta}` : current.arguments,
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
      await emitToolCallAccumulator()
      return
    }

    const choices = Reflect.get(parsed, 'choices')
    if (!Array.isArray(choices)) {
      return
    }
    const firstChoice = choices[0]
    if (!firstChoice || typeof firstChoice !== 'object') {
      return
    }
    const delta = Reflect.get(firstChoice, 'delta')
    if (!delta || typeof delta !== 'object') {
      return
    }
    const toolCalls = Reflect.get(delta, 'tool_calls')
    const updatedToolCallResult = Array.isArray(toolCalls)
      ? updateToolCallAccumulator(toolCallAccumulator, toolCalls as readonly unknown[])
      : undefined
    if (updatedToolCallResult) {
      toolCallAccumulator = updatedToolCallResult.nextAccumulator
    }
    if (updatedToolCallResult && onToolCallsChunk) {
      await onToolCallsChunk(updatedToolCallResult.toolCalls)
    }
    const content = Reflect.get(delta, 'content')
    const chunkText = getStreamChunkText(content)
    if (!chunkText) {
      return
    }
    text += chunkText
    if (onTextChunk) {
      await onTextChunk(chunkText)
    }
  }

  while (!done) {
    const { done: streamDone, value } = await reader.read()
    if (streamDone) {
      done = true
    } else if (value) {
      remainder += decoder.decode(value, { stream: true })
    }

    while (true) {
      const separatorIndex = remainder.indexOf('\n\n')
      if (separatorIndex === -1) {
        break
      }
      const rawEvent = remainder.slice(0, separatorIndex)
      remainder = remainder.slice(separatorIndex + 2)
      const dataLines = parseSseEvent(rawEvent)
      if (dataLines.length === 0) {
        continue
      }
      for (const line of dataLines) {
        if (line === '[DONE]') {
          await notifyFinished()
          done = true
          break
        }
        let parsed: unknown
        try {
          parsed = JSON.parse(line) as unknown
        } catch {
          continue
        }
        await handleParsedStreamEvent(parsed)
      }
    }
  }

  if (remainder) {
    const dataLines = parseSseEvent(remainder)
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
      await handleParsedStreamEvent(parsed)
    }
  }

  await notifyFinished()

  return {
    text,
    type: 'success',
  }
}
