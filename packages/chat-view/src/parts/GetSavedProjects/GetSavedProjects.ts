import type { Project } from '../Project/Project.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import { isObject } from '../IsObject/IsObject.ts'

export const getSavedProjects = (savedState: unknown): readonly Project[] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projects } = savedState as Partial<SavedState>
  if (!Array.isArray(projects)) {
    return undefined
  }
  const validProjects = projects.filter((project): project is Project => {
    if (!isObject(project)) {
      return false
    }
    return typeof project.id === 'string' && typeof project.name === 'string' && typeof project.uri === 'string'
  })
  if (validProjects.length === 0) {
    return undefined
  }
  return validProjects
}
