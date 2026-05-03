import type {
  GetOpenRouterAssistantTextErrorResult,
  GetOpenRouterAssistantTextSuccessResult,
} from '../GetOpenRouterAssistantText/GetOpenRouterAssistantText.ts'
import { normalizeLimitInfo } from '../NormalizeLimitInfo/NormalizeLimitInfo.ts'

const requestFailedResult: GetOpenRouterAssistantTextErrorResult = {
  details: 'request-failed',
  type: 'error',
}

const getSuccessResult = (text: string): GetOpenRouterAssistantTextSuccessResult => {
  return {
    text,
    type: 'success',
  }
}

const getErrorResult = (value: object, details: GetOpenRouterAssistantTextErrorResult['details']): GetOpenRouterAssistantTextErrorResult => {
  const rawMessage = Reflect.get(value, 'rawMessage')
  const statusCode = Reflect.get(value, 'statusCode')
  const limitInfo = normalizeLimitInfo(Reflect.get(value, 'limitInfo'))
  return {
    details,
    ...(limitInfo
      ? {
          limitInfo,
        }
      : {}),
    ...(typeof rawMessage === 'string'
      ? {
          rawMessage,
        }
      : {}),
    ...(typeof statusCode === 'number'
      ? {
          statusCode,
        }
      : {}),
    type: 'error',
  }
}

export const normalizeMockResult = (value: unknown): GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult => {
  if (typeof value === 'string') {
    return getSuccessResult(value)
  }
  if (!value || typeof value !== 'object') {
    return requestFailedResult
  }
  const type = Reflect.get(value, 'type')
  if (type === 'success') {
    const text = Reflect.get(value, 'text')
    if (typeof text === 'string') {
      return getSuccessResult(text)
    }
    return requestFailedResult
  }
  if (type === 'error') {
    const details = Reflect.get(value, 'details')
    if (details === 'request-failed' || details === 'too-many-requests' || details === 'http-error') {
      return getErrorResult(value, details)
    }
  }
  const text = Reflect.get(value, 'text')
  if (typeof text === 'string') {
    return getSuccessResult(text)
  }
  return requestFailedResult
}
