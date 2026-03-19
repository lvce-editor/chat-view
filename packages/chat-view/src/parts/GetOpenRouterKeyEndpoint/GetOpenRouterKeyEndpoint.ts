const trailingSlashesRegex = /\/+$/

export const getOpenRouterKeyEndpoint = (openRouterApiBaseUrl: string): string => {
  const trimmedBaseUrl = openRouterApiBaseUrl.replace(trailingSlashesRegex, '')
  return `${trimmedBaseUrl}/auth/key`
}
