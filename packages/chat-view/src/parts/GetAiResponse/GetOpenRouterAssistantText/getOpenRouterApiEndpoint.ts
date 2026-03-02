const defaultOpenRouterApiBaseUrl = 'https://openrouter.ai/api/v1'

export const getOpenRouterApiEndpoint = (openRouterApiBaseUrl: string): string => {
  const trimmedBaseUrl = (openRouterApiBaseUrl || defaultOpenRouterApiBaseUrl).replace(/\/+$/, '')
  return `${trimmedBaseUrl}/chat/completions`
}
