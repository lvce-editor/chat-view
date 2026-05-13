import type { ComposerAttachment } from '../../ComposerAttachment/ComposerAttachment.ts'
import type { PrototypeState } from '../../PrototypeState/PrototypeState.ts'

export const getComposerAttachments = (state: Readonly<PrototypeState>): readonly ComposerAttachment[] => {
  const { composerAttachments } = state
  return Array.isArray(composerAttachments) ? composerAttachments : []
}