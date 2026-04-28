import { MenuItemFlags } from '@lvce-editor/constants'
import type { ComposerPrimaryControl } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { getPrimaryControlCommand } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'

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

export const getMenuEntriesPrimaryControlsOverflow = (
  hiddenPrimaryControls: readonly ComposerPrimaryControl[] = [],
  agentModeLabel = '',
  modelLabel = '',
  reasoningEffortLabel = '',
  runModeLabel = '',
): readonly MenuEntry[] => {
  return hiddenPrimaryControls.map((control) => ({
    command: getPrimaryControlCommand(control),
    flags: MenuItemFlags.None,
    id: control,
    label: getLabel(control, agentModeLabel, modelLabel, reasoningEffortLabel, runModeLabel),
  }))
}
