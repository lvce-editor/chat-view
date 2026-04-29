import type { ComposerPrimaryControl } from '../../ComposerPrimaryControls/ComposerPrimaryControls.ts'

export interface ContextMenuProps {
  readonly menuId: number
  readonly attachmentId?: string
  readonly previewSrc?: string
  readonly sessionId?: string
  readonly hiddenPrimaryControls?: readonly ComposerPrimaryControl[]
  readonly agentModeLabel?: string
  readonly modelLabel?: string
  readonly reasoningEffortLabel?: string
  readonly runModeLabel?: string
  readonly projectId?: string
  readonly canRemoveProject?: boolean
  readonly [key: string]: any
}
