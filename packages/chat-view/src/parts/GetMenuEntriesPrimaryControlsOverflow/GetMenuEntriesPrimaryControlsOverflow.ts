import { MenuItemFlags } from '@lvce-editor/constants'
import type { ComposerPrimaryControl } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { getPrimaryControlCommand } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'

interface Props {
  readonly hiddenPrimaryControls?: readonly ComposerPrimaryControl[]
  readonly agentModeLabel?: string
  readonly modelLabel?: string
  readonly reasoningEffortLabel?: string
  readonly runModeLabel?: string
}

const getLabel = (
  control: ComposerPrimaryControl,
  agentModeLabel: string,
  modelLabel: string,
  reasoningEffortLabel: string,
  runModeLabel: string,
): string => {
  switch (control) {
    case 'agent-mode-picker-toggle':
      return agentModeLabel
    case 'model-picker-toggle':
      return modelLabel
    case 'reasoning-effort-picker-toggle':
      return reasoningEffortLabel
    case 'run-mode-picker-toggle':
      return runModeLabel
    default:
      return ''
  }
}

export const getMenuEntriesPrimaryControlsOverflow = ({
  hiddenPrimaryControls = [],
  agentModeLabel = '',
  modelLabel = '',
  reasoningEffortLabel = '',
  runModeLabel = '',
}: Props = {}): readonly MenuEntry[] => {
  return hiddenPrimaryControls.map((control) => ({
    command: getPrimaryControlCommand(control),
    flags: MenuItemFlags.None,
    id: control,
    label: getLabel(control, agentModeLabel, modelLabel, reasoningEffortLabel, runModeLabel),
  }))
}
