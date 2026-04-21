import type { Project } from '../ViewModel/ViewModel.ts'

export const ensureBlankProject = (projects: readonly Project[], fallbackBlankProject: Project): readonly Project[] => {
  if (projects.some((project) => project.name === '_blank')) {
    return projects
  }
  return [fallbackBlankProject, ...projects]
}
