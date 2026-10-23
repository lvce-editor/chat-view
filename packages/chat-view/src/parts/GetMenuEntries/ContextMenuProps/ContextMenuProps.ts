import type { ComposerPrimaryControl } from '../../ComposerPrimaryControls/ComposerPrimaryControls.ts'

export interface ContextMenuProps {
  readonly agentModeLabel?: string
  readonly attachmentId?: string
  readonly canRemoveProject?: boolean
  readonly hiddenPrimaryControls?: readonly ComposerPrimaryControl[]
  readonly menuId: number
  readonly modelLabel?: string
  readonly previewSrc?: string
  readonly projectId?: string
  readonly reasoningEffortLabel?: string
  readonly [key: string]: any
  readonly runModeLabel?: string
  readonly sessionId?: string
}
