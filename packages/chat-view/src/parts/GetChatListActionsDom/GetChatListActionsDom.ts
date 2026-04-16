import { AriaRoles, type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

<<<<<<< HEAD
export const getChatListActionsDom = (session: ChatSession, sessionPinningEnabled = true): readonly VirtualDomNode[] => {
=======
export const getChatListActionsDom = (session: ChatSession, sessionPinningEnabled = false): readonly VirtualDomNode[] => {
>>>>>>> origin/main
  return [
    {
      childCount: sessionPinningEnabled ? 2 : 1,
      className: ClassNames.ChatActions,
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
<<<<<<< HEAD
    ...(sessionPinningEnabled
      ? [
          {
            childCount: 1,
            className: mergeClassNames(
              ClassNames.IconButton,
              ClassNames.SessionPinButton,
              session.pinned ? ClassNames.ChatListItemPinned : ClassNames.Empty,
            ),
            'data-id': session.id,
            name: InputName.SessionPin,
            onClick: DomEventListenerFunctions.HandleClickPin,
            tabIndex: 0,
            title: session.pinned ? Strings.unpinChatSession() : Strings.pinChatSession(),
            type: VirtualDomElements.Button,
          },
          {
            childCount: 0,
            className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconPinned),
            type: VirtualDomElements.Div,
          },
        ]
      : []),
=======
>>>>>>> origin/main
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
      className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconArchive),
      type: VirtualDomElements.Div,
    },
  ]
}
