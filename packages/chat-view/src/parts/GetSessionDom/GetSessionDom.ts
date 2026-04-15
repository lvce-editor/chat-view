import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { getChatListActionsDom } from '../GetChatListActionsDom/GetChatListActionsDom.ts'
import { getSessionClassName } from '../GetSessionClassName/GetSessionClassName.ts'
import { getSessionContentDom } from '../GetSessionContentDom/GetSessionContentDom.ts'
import { getSessionStatusDom } from '../GetSessionStatusDom/GetSessionStatusDom.ts'

export const getSessionDom = (
  session: ChatSession,
  focused = false,
  showChatListTime = true,
  showFocusOutline = false,
  sessionPinningEnabled = true,
): readonly VirtualDomNode[] => {
  const sessionClassName = getSessionClassName(focused, showFocusOutline)
  return [
    {
      childCount: 2,
      className: sessionClassName,
      'data-pinned': session.pinned ? 'true' : 'false',
      type: VirtualDomElements.Li,
    },
    ...getSessionStatusDom(session),
    ...getSessionContentDom(session, showChatListTime),
    ...getChatListActionsDom(session, sessionPinningEnabled),
  ]
}
