import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
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
): Promise<GetOpenApiAssistantTextResult> => {
  let response: Response
  try {
    response = await fetch(getOpenApiApiEndpoint(openApiApiBaseUrl), {
      body: JSON.stringify({
        messages: messages.map((message) => ({
          content: message.text,
          role: message.role,
        })),
        model: modelId,
      }),
      headers: {
        Authorization: `Bearer ${openApiApiKey}`,
        'Content-Type': 'application/json',
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

  const content = Reflect.get(message, 'content')
  return {
    text: getTextContent(content),
    type: 'success',
  }
}
