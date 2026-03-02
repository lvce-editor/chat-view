import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import { getOpenApiApiEndpoint } from './GetOpenApiAssistantText/getOpenApiApiEndpoint.ts'
import { getTextContent } from './GetTextContent.ts'

export interface GetOpenApiAssistantTextSuccessResult {
  readonly text: string
  readonly type: 'success'
}

export interface GetOpenApiAssistantTextErrorResult {
  readonly details: 'request-failed' | 'http-error'
  readonly statusCode?: number
  readonly type: 'error'
}

export type GetOpenApiAssistantTextResult = GetOpenApiAssistantTextSuccessResult | GetOpenApiAssistantTextErrorResult

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
    return {
      details: 'http-error',
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
