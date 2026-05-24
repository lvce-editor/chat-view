import type { GetOpenRouterAssistantTextErrorResult } from '../GetOpenRouterAssistantText/GetOpenRouterAssistantText.ts'
import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

export const normalizeLimitInfo = (value: unknown): GetOpenRouterAssistantTextErrorResult['limitInfo'] | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const limitRemaining = getObjectProperty(value, 'limitRemaining')
  const limitReset = getObjectProperty(value, 'limitReset')
  const retryAfter = getObjectProperty(value, 'retryAfter')
  const usage = getObjectProperty(value, 'usage')
  const usageDaily = getObjectProperty(value, 'usageDaily')
  const normalized: GetOpenRouterAssistantTextErrorResult['limitInfo'] = {
    ...(typeof limitRemaining === 'number' || limitRemaining === null
      ? {
          limitRemaining,
        }
      : {}),
    ...(typeof limitReset === 'string' || limitReset === null
      ? {
          limitReset,
        }
      : {}),
    ...(typeof retryAfter === 'string' || retryAfter === null
      ? {
          retryAfter,
        }
      : {}),
    ...(typeof usage === 'number'
      ? {
          usage,
        }
      : {}),
    ...(typeof usageDaily === 'number'
      ? {
          usageDaily,
        }
      : {}),
  }
  const hasDetails =
    typeof limitRemaining === 'number' ||
    limitRemaining === null ||
    typeof limitReset === 'string' ||
    limitReset === null ||
    typeof retryAfter === 'string' ||
    retryAfter === null ||
    typeof usage === 'number' ||
    typeof usageDaily === 'number'
  return hasDetails ? normalized : undefined
}
