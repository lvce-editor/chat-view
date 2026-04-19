import type { GetOpenApiAssistantTextResult } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import * as MockOpenApiRequest from '../MockOpenApiRequest/MockOpenApiRequest.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

type ResponseFunctionCall = {
  readonly arguments: string
  readonly callId: string
  readonly name: string
}

type GetMockOpenApiAssistantTextSuccessResult = {
  readonly responseFunctionCalls: readonly ResponseFunctionCall[]
  readonly responseId?: string
  readonly text: string
  readonly type: 'success'
}

type GetMockOpenApiAssistantTextResult = GetMockOpenApiAssistantTextSuccessResult | Exclude<GetOpenApiAssistantTextResult, { type: 'success' }>

const lastRequestSummaryToken = '__MOCK_OPENAPI_LAST_REQUEST_SUMMARY__'

const getLastRequestSummary = (): string => {
  const requests = MockOpenApiRequest.getAll()
  const request = requests.at(-1)
  if (!request || !request.payload || typeof request.payload !== 'object') {
    return 'mock-request-summary images=0 text-files=0'
  }
  const input = Reflect.get(request.payload, 'input')
  if (!Array.isArray(input) || input.length === 0) {
    return 'mock-request-summary images=0 text-files=0'
  }
  let imageCount = 0
  let textFileCount = 0
  for (const item of input) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const content = Reflect.get(item, 'content')
    if (!Array.isArray(content)) {
      continue
    }
    for (const part of content) {
      if (!part || typeof part !== 'object') {
        continue
      }
      const type = Reflect.get(part, 'type')
      if (type === 'input_image') {
        imageCount++
        continue
      }
      if (type !== 'input_text') {
        continue
      }
      const text = Reflect.get(part, 'text')
      if (typeof text === 'string' && text.startsWith('Attached text file "')) {
        textFileCount++
      }
    }
  }
  return `mock-request-summary images=${imageCount} text-files=${textFileCount}`
}

const getResponseFunctionCalls = (value: unknown): readonly ResponseFunctionCall[] => {
  if (!value || typeof value !== 'object') {
    return []
  }
  const output = Reflect.get(value, 'output')
  if (!Array.isArray(output)) {
    return []
  }
  const responseFunctionCalls: ResponseFunctionCall[] = []
  for (const item of output) {
    if (!item || typeof item !== 'object') {
      continue
    }
    if (Reflect.get(item, 'type') !== 'function_call') {
      continue
    }
    const callId = Reflect.get(item, 'call_id')
    const name = Reflect.get(item, 'name')
    const rawArguments = Reflect.get(item, 'arguments')
    if (typeof callId !== 'string' || typeof name !== 'string') {
      continue
    }
    responseFunctionCalls.push({
      arguments: typeof rawArguments === 'string' ? rawArguments : '',
      callId,
      name,
    })
  }
  return responseFunctionCalls
}

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

const getStreamingToolCallStatus = (value: unknown): StreamingToolCall['status'] | undefined => {
  if (value === 'in_progress' || value === 'searching') {
    return 'in-progress'
  }
  if (value === 'completed') {
    return 'success'
  }
  if (value === 'cancelled' || value === 'canceled') {
    return 'canceled'
  }
  if (value === 'failed' || value === 'error') {
    return 'error'
  }
  return undefined
}

const isStreamingToolCallType = (value: unknown): value is 'function_call' | 'web_search_call' => {
  return value === 'function_call' || value === 'web_search_call'
}

const getStreamingToolCallId = (itemType: 'function_call' | 'web_search_call', value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  if (itemType === 'web_search_call') {
    const id = Reflect.get(value, 'id')
    return typeof id === 'string' && id ? id : undefined
  }
  const callId = Reflect.get(value, 'call_id')
  return typeof callId === 'string' && callId ? callId : undefined
}

const getStreamingToolCallName = (itemType: 'function_call' | 'web_search_call', value: unknown): string => {
  if (itemType === 'web_search_call') {
    return 'web_search_call'
  }
  return typeof value === 'string' ? value : ''
}

const getStreamingToolCallStatusFromEventType = (eventType: string): StreamingToolCall['status'] | undefined => {
  if (eventType === 'response.web_search_call.in_progress' || eventType === 'response.web_search_call.searching') {
    return 'in-progress'
  }
  if (eventType === 'response.web_search_call.completed') {
    return 'success'
  }
  if (eventType === 'response.web_search_call.failed' || eventType === 'response.web_search_call.error') {
    return 'error'
  }
  if (eventType === 'response.web_search_call.cancelled' || eventType === 'response.web_search_call.canceled') {
    return 'canceled'
  }
  return undefined
}

const getStreamingToolCallKey = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const outputIndex = Reflect.get(value, 'output_index')
  if (typeof outputIndex === 'number') {
    return String(outputIndex)
  }
  if (typeof outputIndex === 'string' && outputIndex) {
    return outputIndex
  }
  const itemId = Reflect.get(value, 'item_id')
  if (typeof itemId === 'string' && itemId) {
    return itemId
  }
  return undefined
}

const emitToolCalls = async (
  toolCallAccumulator: Readonly<Record<string, StreamingToolCall>>,
  onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>,
): Promise<void> => {
  if (!onToolCallsChunk) {
    return
  }
  const toolCalls = Object.entries(toolCallAccumulator)
    .toSorted((a: readonly [string, StreamingToolCall], b: readonly [string, StreamingToolCall]) => a[0].localeCompare(b[0]))
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
): Promise<GetMockOpenApiAssistantTextResult> => {
  const error = MockOpenApiStream.takeErrorResponse()
  if (error) {
    return error
  }

  let text = ''
  let remainder = ''
  let toolCallAccumulator: Readonly<Record<string, StreamingToolCall>> = {}
  let responseFunctionCalls: readonly ResponseFunctionCall[] = []
  let responseId: string | undefined
  let requestDone = false
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
      const response = Reflect.get(parsed, 'response')
      responseFunctionCalls = getResponseFunctionCalls(response)
      const parsedResponseId = response && typeof response === 'object' ? Reflect.get(response, 'id') : undefined
      if (typeof parsedResponseId === 'string' && parsedResponseId) {
        responseId = parsedResponseId
      }
      requestDone = true
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
      const toolCallKey = getStreamingToolCallKey(parsed)
      const item = Reflect.get(parsed, 'item')
      if (!toolCallKey || !item || typeof item !== 'object') {
        return
      }
      const itemType = Reflect.get(item, 'type')
      if (!isStreamingToolCallType(itemType)) {
        return
      }
      const name = getStreamingToolCallName(itemType, Reflect.get(item, 'name'))
      const argumentsValue = Reflect.get(item, 'arguments')
      const id = getStreamingToolCallId(itemType, item)
      const status = getStreamingToolCallStatus(Reflect.get(item, 'status'))
      toolCallAccumulator = {
        ...toolCallAccumulator,
        [toolCallKey]: {
          arguments: itemType === 'function_call' && typeof argumentsValue === 'string' ? argumentsValue : '',
          ...(typeof id === 'string'
            ? {
                id,
              }
            : {}),
          name,
          ...(status
            ? {
                status,
              }
            : {}),
        },
      }
      await emitToolCalls(toolCallAccumulator, onToolCallsChunk)
      return
    }
    if (eventType === 'response.output_item.done') {
      const toolCallKey = getStreamingToolCallKey(parsed)
      const item = Reflect.get(parsed, 'item')
      if (!toolCallKey || !item || typeof item !== 'object') {
        return
      }
      const itemType = Reflect.get(item, 'type')
      if (!isStreamingToolCallType(itemType)) {
        return
      }
      const current = toolCallAccumulator[toolCallKey] || { arguments: '', name: '' }
      const id = getStreamingToolCallId(itemType, item)
      const name = getStreamingToolCallName(itemType, Reflect.get(item, 'name'))
      const argumentsValue = Reflect.get(item, 'arguments')
      const status = getStreamingToolCallStatus(Reflect.get(item, 'status'))
      toolCallAccumulator = {
        ...toolCallAccumulator,
        [toolCallKey]: {
          arguments: itemType === 'function_call' && typeof argumentsValue === 'string' ? argumentsValue : current.arguments,
          ...(typeof id === 'string'
            ? {
                id,
              }
            : current.id
              ? {
                  id: current.id,
                }
              : {}),
          name: name || current.name,
          ...(status
            ? {
                status,
              }
            : current.status
              ? {
                  status: current.status,
                }
              : {}),
        },
      }
      await emitToolCalls(toolCallAccumulator, onToolCallsChunk)
      return
    }
    if (typeof eventType === 'string' && eventType.startsWith('response.web_search_call.')) {
      const toolCallKey = getStreamingToolCallKey(parsed)
      if (!toolCallKey) {
        return
      }
      const current = toolCallAccumulator[toolCallKey] || { arguments: '', name: 'web_search_call' }
      const itemId = Reflect.get(parsed, 'item_id')
      const status = getStreamingToolCallStatusFromEventType(eventType)
      toolCallAccumulator = {
        ...toolCallAccumulator,
        [toolCallKey]: {
          arguments: current.arguments,
          ...(typeof itemId === 'string' && itemId
            ? {
                id: itemId,
              }
            : current.id
              ? {
                  id: current.id,
                }
              : {}),
          name: current.name || 'web_search_call',
          ...(status
            ? {
                status,
              }
            : current.status
              ? {
                  status: current.status,
                }
              : {}),
        },
      }
      await emitToolCalls(toolCallAccumulator, onToolCallsChunk)
      return
    }
    if (eventType === 'response.function_call_arguments.delta' || eventType === 'response.function_call_arguments.done') {
      const toolCallKey = getStreamingToolCallKey(parsed)
      if (!toolCallKey) {
        return
      }
      const current = toolCallAccumulator[toolCallKey] || { arguments: '', name: '' }
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
        [toolCallKey]: next,
      }
      await emitToolCalls(toolCallAccumulator, onToolCallsChunk)
    }
  }

  const consumeSseDataLines = async (dataLines: readonly string[]): Promise<void> => {
    for (const line of dataLines) {
      if (line === '[DONE]') {
        requestDone = true
        await notifyFinished()
        break
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(line) as unknown
      } catch {
        continue
      }
      await handleParsedSseEvent(parsed)
      if (requestDone) {
        break
      }
    }
  }

  while (!requestDone) {
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
        if (requestDone) {
          break
        }
      }
      continue
    }
    const resolvedChunk = chunk === lastRequestSummaryToken ? getLastRequestSummary() : chunk
    text += resolvedChunk
    if (stream && onTextChunk) {
      await onTextChunk(resolvedChunk)
    }
  }

  if (!requestDone && remainder) {
    const dataLines = parseSseDataLines(remainder)
    await consumeSseDataLines(dataLines)
  }

  await notifyFinished()

  return {
    ...(responseId
      ? {
          responseId,
        }
      : {}),
    responseFunctionCalls,
    text,
    type: 'success',
  }
}
