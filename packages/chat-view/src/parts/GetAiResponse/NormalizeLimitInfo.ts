import type { GetOpenRouterAssistantTextErrorResult } from './GetOpenRouterAssistantText.ts'

export const normalizeLimitInfo = (value: unknown): GetOpenRouterAssistantTextErrorResult['limitInfo'] | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const limitRemaining = Reflect.get(value, 'limitRemaining')
  const limitReset = Reflect.get(value, 'limitReset')
  const retryAfter = Reflect.get(value, 'retryAfter')
  const usage = Reflect.get(value, 'usage')
  const usageDaily = Reflect.get(value, 'usageDaily')
  const normalized: GetOpenRouterAssistantTextErrorResult['limitInfo'] = {
    limitRemaining: typeof limitRemaining === 'number' || limitRemaining === null ? limitRemaining : undefined,
    limitReset: typeof limitReset === 'string' || limitReset === null ? limitReset : undefined,
    retryAfter: typeof retryAfter === 'string' || retryAfter === null ? retryAfter : undefined,
    usage: typeof usage === 'number' ? usage : undefined,
    usageDaily: typeof usageDaily === 'number' ? usageDaily : undefined,
  }
  const hasDetails =
    normalized.limitRemaining !== undefined ||
    normalized.limitReset !== undefined ||
    normalized.retryAfter !== undefined ||
    normalized.usage !== undefined ||
    normalized.usageDaily !== undefined
  return hasDetails ? normalized : undefined
}
