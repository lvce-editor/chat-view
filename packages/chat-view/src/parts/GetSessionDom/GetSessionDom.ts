import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import * as InputName from '../InputName/InputName.ts'

const getSessionStatusClassName = (session: ChatSession): string => {
  const hasInProgressAssistantMessage = session.messages.some((message) => message.role === 'assistant' && message.inProgress)
  if (hasInProgressAssistantMessage) {
    return ClassNames.ChatListItemStatusInProgress
  }
  const hasAssistantMessage = session.messages.some((message) => message.role === 'assistant')
  if (hasAssistantMessage) {
    return ClassNames.ChatListItemStatusFinished
  }
  return ClassNames.ChatListItemStatusStopped
}

export const getSessionDom = (session: ChatSession): readonly VirtualDomNode[] => {
  const sessionClassName = ClassNames.ChatListItem
  const sessionStatusClassName = getSessionStatusClassName(session)
  return [
    {
      childCount: 3,
      className: sessionClassName,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListItemStatusRow,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: `${ClassNames.ChatListItemStatusIcon} codicon codicon-circle-filled ${sessionStatusClassName}`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListItemLabel,
      name: InputName.getSessionInputName(session.id),
      type: VirtualDomElements.Div,
    },
    text(session.title),
    {
      childCount: 1,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.IconButton, ClassNames.SessionArchiveButton),
      'data-id': session.id,
      name: InputName.SessionDelete,
      onClick: DomEventListenerFunctions.HandleClickDelete,
      tabIndex: 0,
      title: Strings.deleteChatSession(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconTrash',
      type: VirtualDomElements.Div,
    },
  ]
}
