import { getOpenRouterApiEndpoint } from './GetOpenRouterAssistantText/getOpenRouterApiEndpoint.ts'
import { getTextContent } from './GetTextContent.ts'

export interface GetOpenRouterAssistantTextSuccessResult {
  readonly type: 'success'
  readonly text: string
}

export interface GetOpenRouterAssistantTextErrorResult {
  readonly type: 'error'
  readonly details: 'request-failed' | 'too-many-requests' | 'http-error'
  readonly statusCode?: number
}

export type GetOpenRouterAssistantTextResult = GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult

export const getOpenRouterAssistantText = async (
  userText: string,
  modelId: string,
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
): Promise<GetOpenRouterAssistantTextResult> => {
  let response: Response
  try {
    response = await fetch(getOpenRouterApiEndpoint(openRouterApiBaseUrl), {
      body: JSON.stringify({
        messages: [{ content: userText, role: 'user' }],
        model: modelId,
      }),
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
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
    if (response.status === 429) {
      return {
        details: 'too-many-requests',
        statusCode: 429,
        type: 'error',
      }
    }
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
