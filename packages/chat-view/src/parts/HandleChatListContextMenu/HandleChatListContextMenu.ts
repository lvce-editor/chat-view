import { RendererWorker } from '@lvce-editor/rpc-registry'

const SESSION_PREFIX = 'session:'
const CHAT_LIST_ITEM_CONTEXT_MENU = 'ChatListItemContextMenu'

export const handleChatListContextMenu = async (name: string, x: number, y: number): Promise<void> => {
  if (!name || !name.startsWith(SESSION_PREFIX)) {
    return
  }
  const sessionId = name.slice(SESSION_PREFIX.length)
  // @ts-ignore
  await RendererWorker.invoke('ContextMenu.show', x, y, CHAT_LIST_ITEM_CONTEXT_MENU, sessionId)
}
