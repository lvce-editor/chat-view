import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getBackendAuthUrl } from '../GetBackendAuthUrl/GetBackendAuthUrl.ts'

const getCurrentHref = async (): Promise<string> => {
  try {
    return await RendererWorker.invoke('Layout.getHref')
  } catch {
    // ignore
  }
  if (!globalThis.location || typeof globalThis.location.href !== 'string' || !globalThis.location.href) {
    return ''
  }
  return globalThis.location.href
}

export const getBackendLoginUrl = async (backendUrl: string): Promise<string> => {
  const loginUrl = new URL(getBackendAuthUrl(backendUrl, '/login'))
  const redirectUri = await getCurrentHref()
  if (redirectUri) {
    loginUrl.searchParams.set('redirect_uri', redirectUri)
  }
  return loginUrl.toString()
}
