import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession, Project } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackToChatsButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import * as InputName from '../InputName/InputName.ts'

const getProjectSessionDom = (session: ChatSession, selectedSessionId: string): readonly VirtualDomNode[] => {
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
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    text(session.title),
  ]
}

const getProjectGroupDom = (
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
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ProjectListChevron,
      type: VirtualDomElements.Span,
    },
    text(expanded ? '▾' : '▸'),
    {
      childCount: 0,
      className: 'MaskIcon MaskIconFolder',
      type: VirtualDomElements.Div,
    },
    text(project.name),
    {
      childCount: 1,
      className: ClassNames.ProjectListItemActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ProjectListItemAddChatButton,
      name: InputName.getCreateSessionInProjectInputName(project.id),
      onClick: DomEventListenerFunctions.HandleClick,
      tabIndex: 0,
      title: 'New chat in this project',
      type: VirtualDomElements.Button,
    },
    text('+'),
    ...(expanded ? sessions.flatMap((session) => getProjectSessionDom(session, selectedSessionId)) : []),
  ]
}

export const getProjectListDom = (
  projects: readonly Project[],
  sessions: readonly ChatSession[],
  projectExpandedIds: readonly string[],
  selectedProjectId: string,
  selectedSessionId: string,
  projectListScrollTop: number,
  showBackToChatsButton = false,
): readonly VirtualDomNode[] => {
  const blankProjectId = projects.find((project) => project.name === '_blank')?.id || projects[0]?.id || ''
  const projectGroups = projects.map((project) => {
    const projectSessions = sessions.filter((session) => {
      const sessionProjectId = session.projectId || blankProjectId
      return sessionProjectId === project.id
    })
    return getProjectGroupDom(project, projectSessions, projectExpandedIds, selectedProjectId, selectedSessionId)
  })

  return [
    {
      childCount: 2 + (showBackToChatsButton ? 1 : 0),
      className: ClassNames.ProjectSidebar,
      type: VirtualDomElements.Div,
    },
    {
      childCount: projects.length,
      className: ClassNames.ProjectList,
      onContextMenu: DomEventListenerFunctions.HandleProjectListContextMenu,
      onScroll: DomEventListenerFunctions.HandleProjectListScroll,
      scrollTop: projectListScrollTop,
      type: VirtualDomElements.Div,
    },
    ...projectGroups.flat(),
    {
      childCount: 1,
      className: ClassNames.ProjectAddButton,
      name: InputName.CreateProject,
      onClick: DomEventListenerFunctions.HandleClick,
      tabIndex: 0,
      type: VirtualDomElements.Button,
    },
    text('+ Add Project'),
    ...(showBackToChatsButton ? getBackToChatsButtonDom() : []),
  ]
}
