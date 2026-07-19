import { AriaRoles, type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../../ChatSession/ChatSession.ts'
import type { Project } from '../../Project/Project.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'
import * as TabIndex from '../../TabIndex/TabIndex.ts'
import { getProjectSessionDom } from '../GetProjectSessionDom/GetProjectSessionDom.ts'

const projectListItemActionsNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ProjectListItemActions,
  type: VirtualDomElements.Div,
}

export const getProjectGroupDom = (
  project: Project,
  sessions: readonly ChatSession[],
  projectExpandedIds: readonly string[],
  selectedProjectId: string,
  selectedSessionId: string,
): readonly VirtualDomNode[] => {
  const expanded = projectExpandedIds.includes(project.id)
  const projectClassName = mergeClassNames(
    ClassNames.ProjectListItem,
    project.id === selectedProjectId ? ClassNames.ProjectListItemSelected : ClassNames.Empty,
  )
  return [
    {
      childCount: 1 + (expanded ? sessions.length : 0),
      className: ClassNames.ProjectListGroup,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: projectClassName,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 3,
      className: ClassNames.ProjectListItemLabel,
      name: InputName.getProjectInputName(project.id),
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleProjectListContextMenu,
      role: AriaRoles.Button,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames(
        ClassNames.ProjectListChevron,
        ClassNames.MaskIcon,
        expanded ? ClassNames.MaskIconChevronDown : ClassNames.MaskIconChevronRight,
      ),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconFolder),
      type: VirtualDomElements.Div,
    },
    text(project.name),
    projectListItemActionsNode,
    {
      childCount: 1,
      className: ClassNames.ProjectListItemAddChatButton,
      name: InputName.getCreateSessionInProjectInputName(project.id),
      onClick: DomEventListenerFunctions.HandleClick,
      tabIndex: TabIndex.Focusable,
      title: 'New chat in this project',
      type: VirtualDomElements.Button,
    },
    text('+'),
    ...(expanded ? sessions.flatMap((session) => getProjectSessionDom(session, selectedSessionId)) : []),
  ]
}
