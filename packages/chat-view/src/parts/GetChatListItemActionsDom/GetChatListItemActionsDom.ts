import { AriaRoles, type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatListItemActionsDom = (session: ChatSession): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatActions,
      role: AriaRoles.ToolBar,
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
      className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconArchive),
      'data-id': session.id,
      type: VirtualDomElements.Div,
    },
  ]
}
