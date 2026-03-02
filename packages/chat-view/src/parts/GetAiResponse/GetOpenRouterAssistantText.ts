import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import { getOpenRouterApiEndpoint } from './GetOpenRouterAssistantText/getOpenRouterApiEndpoint.ts'
import { getOpenRouterKeyEndpoint } from './GetOpenRouterAssistantText/getOpenRouterKeyEndpoint.ts'
import { getTextContent } from './GetTextContent.ts'

export interface GetOpenRouterAssistantTextSuccessResult {
  readonly text: string
  readonly type: 'success'
}

export interface GetOpenRouterAssistantTextErrorResult {
  readonly details: 'request-failed' | 'too-many-requests' | 'http-error'
  readonly limitInfo?: {
    readonly limitRemaining?: number | null
    readonly limitReset?: string | null
    readonly retryAfter?: string | null
    readonly usage?: number
    readonly usageDaily?: number
  }
  readonly rawMessage?: string
  readonly statusCode?: number
  readonly type: 'error'
}

export type GetOpenRouterAssistantTextResult = GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult

const getOpenRouterRaw429Message = async (response: Response): Promise<string | undefined> => {
  let parsed: unknown
  try {
    parsed = (await response.json()) as unknown
  } catch {
    return undefined
  }

  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }

  const error = Reflect.get(parsed, 'error')
  if (!error || typeof error !== 'object') {
    return undefined
  }

  const metadata = Reflect.get(error, 'metadata')
  if (!metadata || typeof metadata !== 'object') {
    return undefined
  }

  const raw = Reflect.get(metadata, 'raw')
  if (typeof raw !== 'string' || !raw) {
    return undefined
  }

  return raw
}

const getOpenRouterLimitInfo = async (
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
): Promise<GetOpenRouterAssistantTextErrorResult['limitInfo'] | undefined> => {
  let response: Response
  try {
    response = await fetch(getOpenRouterKeyEndpoint(openRouterApiBaseUrl), {
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
      },
      method: 'GET',
    })
  } catch {
    return undefined
  }

  if (!response.ok) {
    return undefined
  }

  let parsed: unknown
  try {
    parsed = (await response.json()) as unknown
  } catch {
    return undefined
  }

  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }

  const data = Reflect.get(parsed, 'data')
  if (!data || typeof data !== 'object') {
    return undefined
  }

  const limitRemaining = Reflect.get(data, 'limit_remaining')
  const limitReset = Reflect.get(data, 'limit_reset')
  const usage = Reflect.get(data, 'usage')
  const usageDaily = Reflect.get(data, 'usage_daily')
  const normalizedLimitInfo: GetOpenRouterAssistantTextErrorResult['limitInfo'] = {
    limitRemaining: typeof limitRemaining === 'number' || limitRemaining === null ? limitRemaining : undefined,
    limitReset: typeof limitReset === 'string' || limitReset === null ? limitReset : undefined,
    usage: typeof usage === 'number' ? usage : undefined,
    usageDaily: typeof usageDaily === 'number' ? usageDaily : undefined,
  }

  const hasLimitInfo =
    normalizedLimitInfo.limitRemaining !== undefined ||
    normalizedLimitInfo.limitReset !== undefined ||
    normalizedLimitInfo.usage !== undefined ||
    normalizedLimitInfo.usageDaily !== undefined

  if (!hasLimitInfo) {
    return undefined
  }

  return normalizedLimitInfo
}

export const getOpenRouterAssistantText = async (
  messages: readonly ChatMessage[],
  modelId: string,
  openRouterApiKey: string,
  openRouterApiBaseUrl: string,
): Promise<GetOpenRouterAssistantTextResult> => {
  let response: Response
  try {
    response = await fetch(getOpenRouterApiEndpoint(openRouterApiBaseUrl), {
      body: JSON.stringify({
        messages: messages.map((message) => ({
          content: message.text,
          role: message.role,
        })),
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
      const retryAfter = response.headers?.get?.('retry-after') ?? null
      const rawMessage = await getOpenRouterRaw429Message(response)
      const limitInfo = await getOpenRouterLimitInfo(openRouterApiKey, openRouterApiBaseUrl)
      return {
        details: 'too-many-requests',
        limitInfo:
          limitInfo || retryAfter
            ? {
                ...limitInfo,
                retryAfter,
              }
            : undefined,
        rawMessage,
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
