import type { Project } from '../Project/Project.ts'

export const ensureBlankProject = (projects: readonly Project[], fallbackBlankProject: Project): readonly Project[] => {
  if (projects.some((project) => project.name === '_blank')) {
    return projects
  }
  return [fallbackBlankProject, ...projects]
}
