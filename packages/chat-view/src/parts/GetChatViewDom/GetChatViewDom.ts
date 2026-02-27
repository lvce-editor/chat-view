import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModeDetailVirtualDom, getChatModeListVirtualDom } from '../GetChatModeVirtualDom/GetChatModeVirtualDom.ts'
import { getChatHeaderActionsDom } from './GetChatHeaderActionsDom.ts'
import { getChatHeaderDom } from './GetChatHeaderDom.ts'
import * as Strings from './GetChatViewDomStrings.ts'

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle
  const showBackButton = viewMode === 'detail'
  const contentNodes =
    viewMode === 'detail'
      ? getChatModeDetailVirtualDom(sessions, selectedSessionId, composerValue)
      : getChatModeListVirtualDom(sessions, selectedSessionId)
  const dom: VirtualDomNode[] = [
    {
      childCount: 2,
      className: ClassNames.Viewlet + ' Chat',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDom(showBackButton, selectedSessionTitle),
    ...getChatHeaderActionsDom(),
    ...contentNodes,
  ]
  return dom
}
