import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetOpenApiAssistantTextOptions, GetOpenApiAssistantTextResult } from './GetOpenApiAssistantTextTypes/GetOpenApiAssistantTextTypes.ts'
import { executeChatTool, getBasicChatTools } from '../ChatTools/ChatTools.ts'
import { getClientRequestIdHeader } from '../GetClientRequestIdHeader/GetClientRequestIdHeader.ts'
import { getOpenApiApiEndpoint } from '../GetOpenApiApiEndpoint/GetOpenApiApiEndpoint.ts'
import { getTextContent } from '../GetTextContent/GetTextContent.ts'
<<<<<<< HEAD
import { getOpenAiParams } from './GetOpenAiParams/GetOpenAiParams.ts'
import { getOpenApiErrorDetails } from './GetOpenApiErrorDetails/GetOpenApiErrorDetails.ts'
import { getResponseFunctionCalls } from './GetResponseFunctionCalls/GetResponseFunctionCalls.ts'
import { getResponseOutputText } from './GetResponseOutputText/GetResponseOutputText.ts'
import { parseOpenApiStream } from './ParseOpenApiStream/ParseOpenApiStream.ts'
export type {
  GetOpenApiAssistantTextErrorResult,
  GetOpenApiAssistantTextOptions,
  GetOpenApiAssistantTextResult,
  GetOpenApiAssistantTextSuccessResult,
  StreamingToolCall,
} from './GetOpenApiAssistantTextTypes/GetOpenApiAssistantTextTypes.ts'
=======

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

const getOpenAiTools = (tools: readonly unknown[]): readonly unknown[] => {
  return tools.map((tool) => {
    if (!tool || typeof tool !== 'object') {
      return tool
    }
    const type = Reflect.get(tool, 'type')
    const toolFunction = Reflect.get(tool, 'function')
    if (type !== 'function' || !toolFunction || typeof toolFunction !== 'object') {
      return tool
    }
    const name = Reflect.get(toolFunction, 'name')
    const description = Reflect.get(toolFunction, 'description')
    const parameters = Reflect.get(toolFunction, 'parameters')
    return {
      ...(typeof description === 'string'
        ? {
            description,
          }
        : {}),
      ...(typeof name === 'string'
        ? {
            name,
          }
        : {}),
      ...(parameters && typeof parameters === 'object'
        ? {
            parameters,
          }
        : {}),
      type: 'function',
    }
  })
}

const getOpenAiParams = (
  input: readonly unknown[],
  modelId: string,
  stream: boolean,
  includeObfuscation: boolean,
  tools: readonly unknown[],
  previousResponseId?: string,
): object => {
  return {
    input,
    model: modelId,
    ...(stream
      ? {
          stream: true,
          ...(includeObfuscation
            ? {}
            : {
                stream_options: {
                  include_obfuscation: false,
                },
              }),
        }
      : {}),
    ...(previousResponseId
      ? {
          previous_response_id: previousResponseId,
        }
      : {}),
    tool_choice: 'auto',
    tools: getOpenAiTools(tools),
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

interface ResponseFunctionCall {
  readonly arguments: string
  readonly callId: string
  readonly name: string
}

const getResponseOutputText = (parsed: unknown): string => {
  if (!parsed || typeof parsed !== 'object') {
    return ''
  }

  const outputText = Reflect.get(parsed, 'output_text')
  if (typeof outputText === 'string') {
    return outputText
  }

  const output = Reflect.get(parsed, 'output')
  if (!Array.isArray(output)) {
    return ''
  }

  const chunks: string[] = []
  for (const outputItem of output) {
    if (!outputItem || typeof outputItem !== 'object') {
      continue
    }
    const itemType = Reflect.get(outputItem, 'type')
    if (itemType !== 'message') {
      continue
    }
    const content = Reflect.get(outputItem, 'content')
    if (!Array.isArray(content)) {
      continue
    }
    for (const part of content) {
      if (!part || typeof part !== 'object') {
        continue
      }
      const partType = Reflect.get(part, 'type')
      const text = Reflect.get(part, 'text')
      if ((partType === 'output_text' || partType === 'text') && typeof text === 'string') {
        chunks.push(text)
      }
    }
  }
  return chunks.join('')
}

const getResponseFunctionCalls = (parsed: unknown): readonly ResponseFunctionCall[] => {
  if (!parsed || typeof parsed !== 'object') {
    return []
  }
  const output = Reflect.get(parsed, 'output')
  if (!Array.isArray(output)) {
    return []
  }
  const calls: ResponseFunctionCall[] = []
  for (const outputItem of output) {
    if (!outputItem || typeof outputItem !== 'object') {
      continue
    }
    const itemType = Reflect.get(outputItem, 'type')
    if (itemType !== 'function_call') {
      continue
    }
    const callId = Reflect.get(outputItem, 'call_id')
    const name = Reflect.get(outputItem, 'name')
    const rawArguments = Reflect.get(outputItem, 'arguments')
    if (typeof callId !== 'string' || typeof name !== 'string') {
      continue
    }
    calls.push({
      arguments: typeof rawArguments === 'string' ? rawArguments : '',
      callId,
      name,
    })
  }
  return calls
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
  accumulator: Readonly<Record<number, StreamingToolCall>>,
  chunk: readonly unknown[],
):
  | {
      readonly nextAccumulator: Readonly<Record<number, StreamingToolCall>>
      readonly toolCalls: readonly StreamingToolCall[]
    }
  | undefined => {
  let changed = false
  const nextAccumulator: Record<number, StreamingToolCall> = { ...accumulator }
  for (const item of chunk) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const index = Reflect.get(item, 'index')
    if (typeof index !== 'number') {
      continue
    }
    const current = nextAccumulator[index] || { arguments: '', name: '' }
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
      ...(typeof id === 'string'
        ? {
            id,
          }
        : current.id
          ? {
              id: current.id,
            }
          : {}),
      name,
    }
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      nextAccumulator[index] = next
      changed = true
    }
  }
  if (!changed) {
    return undefined
  }
  const toolCalls = Object.entries(nextAccumulator)
    .toSorted((a: readonly [string, StreamingToolCall], b: readonly [string, StreamingToolCall]) => Number(a[0]) - Number(b[0]))
    .map((entry: readonly [string, StreamingToolCall]) => entry[1])
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
    ...(typeof errorCode === 'string'
      ? {
          errorCode,
        }
      : {}),
    ...(typeof errorMessage === 'string'
      ? {
          errorMessage,
        }
      : {}),
    ...(typeof errorType === 'string'
      ? {
          errorType,
        }
      : {}),
  }
}
>>>>>>> origin/main

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
  const openAiInput: any[] = messages.map((message) => ({
    content: message.text,
    role: message.role,
  }))
  const tools = getBasicChatTools()
  const maxToolIterations = 4
  let previousResponseId: string | undefined
  for (let i = 0; i <= maxToolIterations; i++) {
    let response: Response
    try {
      response = await fetch(getOpenApiApiEndpoint(openApiApiBaseUrl), {
        body: JSON.stringify(getOpenAiParams(openAiInput, modelId, stream, includeObfuscation, tools, previousResponseId)),
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
        ...(errorCode
          ? {
              errorCode,
            }
          : {}),
        ...(errorMessage
          ? {
              errorMessage,
            }
          : {}),
        ...(errorType
          ? {
              errorType,
            }
          : {}),
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

    const parsedResponseId = Reflect.get(parsed, 'id')
    if (typeof parsedResponseId === 'string' && parsedResponseId) {
      previousResponseId = parsedResponseId
    }

    const responseFunctionCalls = getResponseFunctionCalls(parsed)
    if (responseFunctionCalls.length > 0) {
      openAiInput.length = 0
      for (const toolCall of responseFunctionCalls) {
        const content = await executeChatTool(toolCall.name, toolCall.arguments, { assetDir, platform })
        openAiInput.push({
          call_id: toolCall.callId,
          output: content,
          type: 'function_call_output',
        })
      }
      continue
    }

    const outputText = getResponseOutputText(parsed)
    if (outputText) {
      return {
        text: outputText,
        type: 'success',
      }
    }

    const choices = Reflect.get(parsed, 'choices')
    if (Array.isArray(choices)) {
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
        openAiInput.length = 0
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
          openAiInput.push({
            call_id: id,
            output: content,
            type: 'function_call_output',
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
      text: '',
      type: 'success',
    }
  }

  return {
    details: 'request-failed',
    type: 'error',
  }
}
