import { type GetOpenRouterAssistantTextErrorResult, type GetOpenRouterAssistantTextSuccessResult } from './GetOpenRouterAssistantText.ts'
import { normalizeLimitInfo } from './NormalizeLimitInfo.ts'

export const normalizeMockResult = (value: unknown): GetOpenRouterAssistantTextSuccessResult | GetOpenRouterAssistantTextErrorResult => {
  if (typeof value === 'string') {
    return {
      text: value,
      type: 'success',
    }
  }
  if (!value || typeof value !== 'object') {
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  const type = Reflect.get(value, 'type')
  if (type === 'success') {
    const text = Reflect.get(value, 'text')
    if (typeof text === 'string') {
      return {
        text,
        type: 'success',
      }
    }
    return {
      details: 'request-failed',
      type: 'error',
    }
  }
  if (type === 'error') {
    const details = Reflect.get(value, 'details')
    if (details === 'request-failed' || details === 'too-many-requests' || details === 'http-error') {
      const rawMessage = Reflect.get(value, 'rawMessage')
      const statusCode = Reflect.get(value, 'statusCode')
      return {
        details,
        limitInfo: normalizeLimitInfo(Reflect.get(value, 'limitInfo')),
        rawMessage: typeof rawMessage === 'string' ? rawMessage : undefined,
        statusCode: typeof statusCode === 'number' ? statusCode : undefined,
        type: 'error',
      }
    }
  }
  const text = Reflect.get(value, 'text')
  if (typeof text === 'string') {
    return {
      text,
      type: 'success',
    }
  }
  return {
    details: 'request-failed',
    type: 'error',
  }
}
