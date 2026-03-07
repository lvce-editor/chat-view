import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const getScrollDom = (state: ChatState): readonly VirtualDomNode[] => {
  if (state.viewMode === 'list') {
    if (state.sessions.length === 0) {
      return []
    }
    return [
      {
        childCount: state.sessions.length,
        className: ClassNames.ChatList,
        scrollTop: state.chatListScrollTop,
        type: VirtualDomElements.Div,
      },
    ]
  }
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  const messages = selectedSession ? selectedSession.messages : []
  if (messages.length === 0) {
    return []
  }
  return [
    {
      childCount: messages.length,
      className: 'ChatMessages',
      scrollTop: state.messagesScrollTop,
      type: VirtualDomElements.Div,
    },
  ]
}

export const renderScrollTop = (oldState: ChatState, newState: ChatState): any => {
  const oldDom = getScrollDom(oldState)
  const newDom = getScrollDom(newState)
  const patches = diffTree(oldDom, newDom)
  if (patches.length === 0) {
    return []
  }
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
