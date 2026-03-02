const defaultOpenRouterApiBaseUrl = 'https://openrouter.ai/api/v1'

export const getOpenRouterKeyEndpoint = (openRouterApiBaseUrl: string): string => {
  const trimmedBaseUrl = (openRouterApiBaseUrl || defaultOpenRouterApiBaseUrl).replace(/\/+$/, '')
  return `${trimmedBaseUrl}/auth/key`
}
