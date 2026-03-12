import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession, Project } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
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
  selectedProjectId: string,
  selectedSessionId: string,
): readonly VirtualDomNode[] => {
  const projectClassName = mergeClassNames(
    ClassNames.ProjectListItem,
    project.id === selectedProjectId ? ClassNames.ProjectListItemSelected : ClassNames.Empty,
  )
  return [
    {
      childCount: 1 + sessions.length,
      className: ClassNames.ProjectListGroup,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: projectClassName,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ProjectListItemLabel,
      name: InputName.getProjectInputName(project.id),
      onClick: DomEventListenerFunctions.HandleClick,
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    text(project.name),
    ...sessions.flatMap((session) => getProjectSessionDom(session, selectedSessionId)),
  ]
}

export const getProjectListDom = (
  projects: readonly Project[],
  sessions: readonly ChatSession[],
  selectedProjectId: string,
  selectedSessionId: string,
  projectListScrollTop: number,
): readonly VirtualDomNode[] => {
  const blankProjectId = projects.find((project) => project.name === '_blank')?.id || projects[0]?.id || ''
  const projectGroups = projects.map((project) => {
    const projectSessions = sessions.filter((session) => {
      const sessionProjectId = session.projectId || blankProjectId
      return sessionProjectId === project.id
    })
    return getProjectGroupDom(project, projectSessions, selectedProjectId, selectedSessionId)
  })

  return [
    {
      childCount: 2,
      className: ClassNames.ProjectSidebar,
      type: VirtualDomElements.Div,
    },
    {
      childCount: projects.length,
      className: ClassNames.ProjectList,
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
  ]
}
