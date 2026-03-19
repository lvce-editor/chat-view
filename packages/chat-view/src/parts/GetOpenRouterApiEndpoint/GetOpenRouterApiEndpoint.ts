const trailingSlashesRegex = /\/+$/

export const getOpenRouterApiEndpoint = (openRouterApiBaseUrl: string): string => {
  const trimmedBaseUrl = openRouterApiBaseUrl.replace(trailingSlashesRegex, '')
  return `${trimmedBaseUrl}/chat/completions`
}
