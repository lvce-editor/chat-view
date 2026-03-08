import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetOpenApiAssistantTextOptions, GetOpenApiAssistantTextResult } from './GetOpenApiAssistantTextTypes/GetOpenApiAssistantTextTypes.ts'
import { executeChatTool, getBasicChatTools } from '../ChatTools/ChatTools.ts'
import { getClientRequestIdHeader } from '../GetClientRequestIdHeader/GetClientRequestIdHeader.ts'
import { getOpenApiApiEndpoint } from '../GetOpenApiApiEndpoint/GetOpenApiApiEndpoint.ts'
import { getTextContent } from '../GetTextContent/GetTextContent.ts'
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
