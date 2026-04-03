import { getBackendAuthUrl } from '../GetBackendAuthUrl/GetBackendAuthUrl.ts'

const getRedirectUri = (): string => {
  if (!globalThis.location || typeof globalThis.location.href !== 'string' || !globalThis.location.href) {
    return ''
  }
  return globalThis.location.href
}

export const getBackendLoginUrl = (backendUrl: string): string => {
  const loginUrl = new URL(getBackendAuthUrl(backendUrl, '/auth/login'))
  const redirectUri = getRedirectUri()
  if (redirectUri) {
    loginUrl.searchParams.set('redirect_uri', redirectUri)
  }
  return loginUrl.toString()
}
