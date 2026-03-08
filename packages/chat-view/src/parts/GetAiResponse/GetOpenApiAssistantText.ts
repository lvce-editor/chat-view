import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import { makeApiRequest, makeStreamingApiRequest, type NetworkApiRequestErrorResult } from './ChatNetworkRequest.ts'
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

interface GetOpenApiAssistantTextOptions {
  readonly includeObfuscation?: boolean
  readonly onTextChunk?: (chunk: string) => Promise<void>
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

const parseOpenApiStream = async (
  events: readonly unknown[],
  onTextChunk?: (chunk: string) => Promise<void>,
): Promise<GetOpenApiAssistantTextResult> => {
  let text = ''

  for (const event of events) {
    if (event === '[DONE]') {
      continue
    }
    if (!event || typeof event !== 'object') {
      continue
    }
    const choices = Reflect.get(event, 'choices')
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

  return {
    text,
    type: 'success',
  }
}

const getOpenApiErrorDetails = (
  errorResult: Readonly<NetworkApiRequestErrorResult>,
): Pick<GetOpenApiAssistantTextErrorResult, 'errorCode' | 'errorMessage' | 'errorType'> => {
  let parsed: unknown
  try {
    parsed = JSON.parse(errorResult.response) as unknown
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
  const { includeObfuscation = false, onTextChunk, stream } = options ?? { stream: false }
  const completionMessages: any[] = messages.map((message) => ({
    content: message.text,
    role: message.role,
  }))
  const tools = getBasicChatTools()
  const maxToolIterations = 4
  for (let i = 0; i <= maxToolIterations; i++) {
    if (stream) {
      let result
      try {
        result = await makeStreamingApiRequest({
          headers: {
            Authorization: `Bearer ${openApiApiKey}`,
            'Content-Type': 'application/json',
            ...getClientRequestIdHeader(),
          },
          method: 'POST',
          postBody: getOpenAiParams(completionMessages, modelId, stream, includeObfuscation, tools),
          url: getOpenApiApiEndpoint(openApiApiBaseUrl, stream),
        })
      } catch {
        return {
          details: 'request-failed',
          type: 'error',
        }
      }

      if (result.type === 'error') {
        const { errorCode, errorMessage, errorType } = getOpenApiErrorDetails(result)
        return {
          details: 'http-error',
          errorCode,
          errorMessage,
          errorType,
          statusCode: result.statusCode,
          type: 'error',
        }
      }

      return parseOpenApiStream(result.body, onTextChunk)
    }

    let result
    try {
      result = await makeApiRequest({
        headers: {
          Authorization: `Bearer ${openApiApiKey}`,
          'Content-Type': 'application/json',
          ...getClientRequestIdHeader(),
        },
        method: 'POST',
        postBody: getOpenAiParams(completionMessages, modelId, stream, includeObfuscation, tools),
        url: getOpenApiApiEndpoint(openApiApiBaseUrl, stream),
      })
    } catch {
      return {
        details: 'request-failed',
        type: 'error',
      }
    }

    if (result.type === 'error') {
      const { errorCode, errorMessage, errorType } = getOpenApiErrorDetails(result)
      return {
        details: 'http-error',
        errorCode,
        errorMessage,
        errorType,
        statusCode: result.statusCode,
        type: 'error',
      }
    }

    const parsed = result.body

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
