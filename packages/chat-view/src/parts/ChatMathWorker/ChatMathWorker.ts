import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { ChatMathWorker, RendererWorker } from '@lvce-editor/rpc-registry'

let initialized = false
const renderCache = new Map<string, string>()
const pendingRenders = new Set<string>()

const getCacheKey = (value: string, displayMode: boolean): string => {
  return `${displayMode ? '1' : '0'}:${value}`
}

const sendMessagePortToChatMathWorker = async (port: MessagePort): Promise<void> => {
  try {
    await RendererWorker.invoke('sendMessagePortToChatMathWorker', port)
  } catch {
    await RendererWorker.invoke('SendMessagePortToChatMathWorker.sendMessagePortToChatMathWorker', port)
  }
}

const createRpc = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatMathWorker,
  })
}

export const initialize = async (): Promise<void> => {
  if (initialized) {
    return
  }
  const rpc = await createRpc()
  ChatMathWorker.set(rpc)
  initialized = true
}

export const invoke = async <T>(method: string, ...params: readonly unknown[]): Promise<T> => {
  await initialize()
  return ChatMathWorker.invoke(method, ...params) as T
}

const renderViaRpc = async (value: string, displayMode: boolean): Promise<string> => {
  const methods = ['renderToString', 'RenderToString.renderToString', 'RenderMath.renderMath', 'Math.renderToString']
  for (const method of methods) {
    try {
      const result = await invoke<string>(method, value, {
        displayMode,
        throwOnError: true,
      })
      if (typeof result === 'string') {
        return result
      }
    } catch {
      // Try next known method signature.
    }
    try {
      const result = await invoke<string>(method, value, displayMode)
      if (typeof result === 'string') {
        return result
      }
    } catch {
      // Try next known method signature.
    }
  }
  throw new Error('ChatMathWorker did not provide renderToString')
}

const startRender = (cacheKey: string, value: string, displayMode: boolean): void => {
  if (pendingRenders.has(cacheKey)) {
    return
  }
  pendingRenders.add(cacheKey)
  void (async (): Promise<void> => {
    try {
      const html = await renderViaRpc(value, displayMode)
      renderCache.set(cacheKey, html)
    } catch {
      // Keep cache empty so caller can continue to show fallback text.
    } finally {
      pendingRenders.delete(cacheKey)
    }
  })()
}

export const tryRenderToString = (value: string, displayMode: boolean): string | undefined => {
  const cacheKey = getCacheKey(value, displayMode)
  const cached = renderCache.get(cacheKey)
  if (cached) {
    return cached
  }
  startRender(cacheKey, value, displayMode)
  return undefined
}

export const renderToString = async (value: string, displayMode: boolean): Promise<string | undefined> => {
  const cacheKey = getCacheKey(value, displayMode)
  const cached = renderCache.get(cacheKey)
  if (cached) {
    return cached
  }
  try {
    const html = await renderViaRpc(value, displayMode)
    renderCache.set(cacheKey, html)
    return html
  } catch {
    return undefined
  }
}
