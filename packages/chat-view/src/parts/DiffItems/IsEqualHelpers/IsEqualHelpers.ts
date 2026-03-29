import type { ChatState } from '../../ChatState/ChatState.ts'

export const isEqualComposerAttachments = (a: ChatState['composerAttachments'], b: ChatState['composerAttachments']): boolean => {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].attachmentId !== b[i].attachmentId ||
      a[i].displayType !== b[i].displayType ||
      a[i].mimeType !== b[i].mimeType ||
      a[i].name !== b[i].name ||
      a[i].previewSrc !== b[i].previewSrc ||
      a[i].size !== b[i].size
    ) {
      return false
    }
  }
  return true
}

export const isEqualGitBranches = (a: ChatState['gitBranches'], b: ChatState['gitBranches']): boolean => {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].current !== b[i].current || a[i].name !== b[i].name) {
      return false
    }
  }
  return true
}

export const isEqualProjectExpandedIds = (a: readonly string[], b: readonly string[]): boolean => {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export const isEqualProjects = (a: ChatState['projects'], b: ChatState['projects']): boolean => {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].name !== b[i].name || a[i].uri !== b[i].uri) {
      return false
    }
  }
  return true
}

export const isEqualVisibleModels = (a: ChatState['visibleModels'], b: ChatState['visibleModels']): boolean => {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) {
      return false
    }
  }
  return true
}
