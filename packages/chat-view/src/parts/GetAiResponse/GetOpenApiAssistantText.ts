import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import { executeChatTool, getBasicChatTools } from './ChatTools.ts'
import { getClientRequestIdHeader } from './GetClientRequestIdHeader.ts'
import { getOpenApiApiEndpoint } from './GetOpenApiAssistantText/getOpenApiApiEndpoint.ts'
import { getTextContent } from './GetTextContent.ts'

export interface GetOpenApiAssistantTextSuccessResult {
  readonly text: string
  readonly type: 'success'
}

export interface GetOpenApiAssistantTextErrorResult {
  readonly details: 'request-failed' | 'http-error'
  readonly errorCode?: string
  readonly errorMessage?: string
  readonly errorType?: string
  readonly statusCode?: number
  readonly type: 'error'
}

export type GetOpenApiAssistantTextResult = GetOpenApiAssistantTextSuccessResult | GetOpenApiAssistantTextErrorResult

export interface StreamingToolCall {
  readonly arguments: string
  readonly id?: string
  readonly name: string
}

interface GetOpenApiAssistantTextOptions {
  readonly includeObfuscation?: boolean
  readonly onDataEvent?: (value: unknown) => Promise<void>
  readonly onEventStreamFinished?: () => Promise<void>
  readonly onTextChunk?: (chunk: string) => Promise<void>
  readonly onToolCallsChunk?: (toolCalls: readonly StreamingToolCall[]) => Promise<void>
  readonly stream: boolean
}

const getOpenAiParams = (
  completionMessages: readonly any[],
  modelId: string,
  stream: boolean,
  includeObfuscation: boolean,
  tools: readonly unknown[],
): object => {
  return {
    messages: completionMessages,
    model: modelId,
    ...(stream
      ? {
          stream: true,
        }
      : {}),
    ...(includeObfuscation
      ? {
          include_obfuscation: true,
        }
      : {}),
    tool_choice: 'auto',
    tools,
  }
}

const getStreamChunkText = (content: unknown): string => {
  if (typeof content === 'string') {
    return content
  }
  if (!Array.isArray(content)) {
    return ''
  }
  return content
    .map((part) => {
      if (!part || typeof part !== 'object') {
        return ''
      }
      const text = Reflect.get(part, 'text')
      return typeof text === 'string' ? text : ''
    })
    .join('')
}

const parseSseEvent = (eventChunk: string): readonly string[] => {
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

const updateToolCallAccumulator = (
  accumulator: ReadonlyMap<number, StreamingToolCall>,
  chunk: readonly unknown[],
):
  | {
      readonly nextAccumulator: ReadonlyMap<number, StreamingToolCall>
      readonly toolCalls: readonly StreamingToolCall[]
    }
  | undefined => {
  let changed = false
  const nextAccumulator = new Map(accumulator)
  for (const item of chunk) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const index = Reflect.get(item, 'index')
    if (typeof index !== 'number') {
      continue
    }
    const current = nextAccumulator.get(index) || { arguments: '', name: '' }
    const id = Reflect.get(item, 'id')
    const toolFunction = Reflect.get(item, 'function')
    let { name } = current
    let args = current.arguments
    if (toolFunction && typeof toolFunction === 'object') {
      const deltaName = Reflect.get(toolFunction, 'name')
      const deltaArguments = Reflect.get(toolFunction, 'arguments')
      if (typeof deltaName === 'string' && deltaName) {
        name = deltaName
      }
      if (typeof deltaArguments === 'string') {
        args += deltaArguments
      }
    }
    const next: StreamingToolCall = {
      arguments: args,
      id: typeof id === 'string' ? id : current.id,
      name,
    }
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      nextAccumulator.set(index, next)
      changed = true
    }
  }
  if (!changed) {
    return undefined
  }
  const toolCalls = [...nextAccumulator.entries()]
    .toSorted((a: readonly [number, StreamingToolCall], b: readonly [number, StreamingToolCall]) => a[0] - b[0])
    .map((entry: readonly [number, StreamingToolCall]) => entry[1])
    .filter((toolCall) => !!toolCall.name)
  return {
    nextAccumulator,
    toolCalls,
  }
}

const parseOpenApiStream = async (
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
  let toolCallAccumulator: ReadonlyMap<number, StreamingToolCall> = new Map<number, StreamingToolCall>()

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
          if (onEventStreamFinished) {
            await onEventStreamFinished()
          }
          done = true
          break
        }
        let parsed: unknown
        try {
          parsed = JSON.parse(line) as unknown
        } catch {
          continue
        }
        if (!parsed || typeof parsed !== 'object') {
          continue
        }
        if (onDataEvent) {
          await onDataEvent(parsed)
        }
        const choices = Reflect.get(parsed, 'choices')
        if (!Array.isArray(choices)) {
          continue
        }
        const firstChoice = choices[0]
        if (!firstChoice || typeof firstChoice !== 'object') {
          continue
        }
        const delta = Reflect.get(firstChoice, 'delta')
        if (!delta || typeof delta !== 'object') {
          continue
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
          continue
        }
        text += chunkText
        if (onTextChunk) {
          await onTextChunk(chunkText)
        }
      }
    }
  }

  if (remainder) {
    const dataLines = parseSseEvent(remainder)
    for (const line of dataLines) {
      if (line === '[DONE]') {
        if (onEventStreamFinished) {
          await onEventStreamFinished()
        }
        continue
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(line) as unknown
      } catch {
        continue
      }
      if (!parsed || typeof parsed !== 'object') {
        continue
      }
      if (onDataEvent) {
        await onDataEvent(parsed)
      }
      const choices = Reflect.get(parsed, 'choices')
      if (!Array.isArray(choices)) {
        continue
      }
      const firstChoice = choices[0]
      if (!firstChoice || typeof firstChoice !== 'object') {
        continue
      }
      const delta = Reflect.get(firstChoice, 'delta')
      if (!delta || typeof delta !== 'object') {
        continue
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
        continue
      }
      text += chunkText
      if (onTextChunk) {
        await onTextChunk(chunkText)
      }
    }
  }

  return {
    text,
    type: 'success',
  }
}

const getOpenApiErrorDetails = async (
  response: Response,
): Promise<Pick<GetOpenApiAssistantTextErrorResult, 'errorCode' | 'errorMessage' | 'errorType'>> => {
  let parsed: unknown
  try {
    parsed = (await response.json()) as unknown
  } catch {
    return {}
  }

  if (!parsed || typeof parsed !== 'object') {
    return {}
  }

  const error = Reflect.get(parsed, 'error')
  if (!error || typeof error !== 'object') {
    return {}
  }

  const errorCode = Reflect.get(error, 'code')
  const errorMessage = Reflect.get(error, 'message')
  const errorType = Reflect.get(error, 'type')

  return {
    errorCode: typeof errorCode === 'string' ? errorCode : undefined,
    errorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
    errorType: typeof errorType === 'string' ? errorType : undefined,
  }
}

export const getOpenApiAssistantText = async (
  messages: readonly ChatMessage[],
  modelId: string,
  openApiApiKey: string,
  openApiApiBaseUrl: string,
  assetDir: string,
  platform: number,
  options?: GetOpenApiAssistantTextOptions,
): Promise<GetOpenApiAssistantTextResult> => {
  const { includeObfuscation = false, onDataEvent, onEventStreamFinished, onTextChunk, onToolCallsChunk, stream } = options ?? { stream: false }
  const completionMessages: any[] = messages.map((message) => ({
    content: message.text,
    role: message.role,
  }))
  const tools = getBasicChatTools()
  const maxToolIterations = 4
  for (let i = 0; i <= maxToolIterations; i++) {
    let response: Response
    try {
      response = await fetch(getOpenApiApiEndpoint(openApiApiBaseUrl, stream), {
        body: JSON.stringify(getOpenAiParams(completionMessages, modelId, stream, includeObfuscation, tools)),
        headers: {
          Authorization: `Bearer ${openApiApiKey}`,
          'Content-Type': 'application/json',
          ...getClientRequestIdHeader(),
        },
        method: 'POST',
      })
    } catch {
      return {
        details: 'request-failed',
        type: 'error',
      }
    }

    if (!response.ok) {
      const { errorCode, errorMessage, errorType } = await getOpenApiErrorDetails(response)
      return {
        details: 'http-error',
        errorCode,
        errorMessage,
        errorType,
        statusCode: response.status,
        type: 'error',
      }
    }

    if (stream) {
      return parseOpenApiStream(response, onTextChunk, onToolCallsChunk, onDataEvent, onEventStreamFinished)
    }

    let parsed: unknown
    try {
      parsed = (await response.json()) as unknown
    } catch {
      return {
        details: 'request-failed',
        type: 'error',
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        text: '',
        type: 'success',
      }
    }

    const choices = Reflect.get(parsed, 'choices')
    if (!Array.isArray(choices)) {
      return {
        text: '',
        type: 'success',
      }
    }

    const firstChoice = choices[0]
    if (!firstChoice || typeof firstChoice !== 'object') {
      return {
        text: '',
        type: 'success',
      }
    }

    const message = Reflect.get(firstChoice, 'message')
    if (!message || typeof message !== 'object') {
      return {
        text: '',
        type: 'success',
      }
    }

    const toolCalls = Reflect.get(message, 'tool_calls')
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      completionMessages.push(message)
      for (const toolCall of toolCalls) {
        if (!toolCall || typeof toolCall !== 'object') {
          continue
        }
        const id = Reflect.get(toolCall, 'id')
        const toolFunction = Reflect.get(toolCall, 'function')
        if (typeof id !== 'string' || !toolFunction || typeof toolFunction !== 'object') {
          continue
        }
        const name = Reflect.get(toolFunction, 'name')
        const rawArguments = Reflect.get(toolFunction, 'arguments')
        const content = typeof name === 'string' ? await executeChatTool(name, rawArguments, { assetDir, platform }) : '{}'
        completionMessages.push({
          content,
          role: 'tool',
          tool_call_id: id,
        })
      }
      continue
    }

    const content = Reflect.get(message, 'content')
    return {
      text: getTextContent(content),
      type: 'success',
    }
  }

  return {
    details: 'request-failed',
    type: 'error',
  }
}
