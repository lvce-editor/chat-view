import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { Project } from '../Project/Project.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackToChatsButtonDom } from '../GetBackToChatsButtonDom/GetBackToChatsButtonDom.ts'
import * as InputName from '../InputName/InputName.ts'
import { getProjectGroupDom } from './GetProjectGroupDom/GetProjectGroupDom.ts'

export const getProjectListDom = (
  projects: readonly Project[],
  sessions: readonly ChatSession[],
  projectExpandedIds: readonly string[],
  selectedProjectId: string,
  selectedSessionId: string,
  projectListScrollTop: number,
  showBackToChatsButton = false,
  style = '',
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
      style,
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
      onContextMenu: DomEventListenerFunctions.HandleProjectAddButtonContextMenu,
      tabIndex: 0,
      type: VirtualDomElements.Button,
    },
    text('+ Add Project'),
    ...(showBackToChatsButton ? getBackToChatsButtonDom() : []),
  ]
}
