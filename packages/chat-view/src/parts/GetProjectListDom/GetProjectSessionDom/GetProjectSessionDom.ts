import { AriaRoles, type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../../ChatSession/ChatSession.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'
import * as TabIndex from '../../TabIndex/TabIndex.ts'

export const getProjectSessionDom = (session: ChatSession, selectedSessionId: string): readonly VirtualDomNode[] => {
  const className = mergeClassNames(
    ClassNames.ProjectSessionItem,
    session.id === selectedSessionId ? ClassNames.ProjectSessionItemSelected : ClassNames.Empty,
  )
  return [
    {
      childCount: 1,
      className,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ProjectSessionItemLabel,
      name: InputName.getSessionInputName(session.id),
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleProjectListContextMenu,
      role: AriaRoles.Button,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    text(session.title),
  ]
}
