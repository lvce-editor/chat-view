import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Project } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const getProjectItemDom = (project: Project, selectedProjectId: string): readonly VirtualDomNode[] => {
  const className = mergeClassNames(
    ClassNames.ProjectListItem,
    project.id === selectedProjectId ? ClassNames.ProjectListItemSelected : ClassNames.Empty,
  )
  return [
    {
      childCount: 1,
      className,
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
  ]
}

export const getProjectListDom = (
  projects: readonly Project[],
  selectedProjectId: string,
  projectListScrollTop: number,
): readonly VirtualDomNode[] => {
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
    ...projects.flatMap((project) => getProjectItemDom(project, selectedProjectId)),
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
