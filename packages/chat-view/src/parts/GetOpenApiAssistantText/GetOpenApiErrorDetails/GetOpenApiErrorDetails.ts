import type { GetOpenApiAssistantTextErrorResult } from '../GetOpenApiAssistantTextTypes/GetOpenApiAssistantTextTypes.ts'

export const getOpenApiErrorDetails = async (
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
