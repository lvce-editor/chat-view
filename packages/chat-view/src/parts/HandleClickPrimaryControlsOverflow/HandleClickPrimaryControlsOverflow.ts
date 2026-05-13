import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getPrimaryControlLabel } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import { MenuChatPrimaryControlsOverflow } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const handleClickPrimaryControlsOverflow = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  await RendererWorker.showContextMenu2(state.uid, MenuChatPrimaryControlsOverflow, eventX, eventY, {
    agentModeLabel: getPrimaryControlLabel(
      'agent-mode-picker-toggle',
      state.agentMode,
      state.models,
      state.selectedModelId,
      state.reasoningEffort,
      state.runMode,
    ),
    hiddenPrimaryControls: state.hiddenPrimaryControls,
    menuId: MenuChatPrimaryControlsOverflow,
    modelLabel: getPrimaryControlLabel(
      'model-picker-toggle',
      state.agentMode,
      state.models,
      state.selectedModelId,
      state.reasoningEffort,
      state.runMode,
    ),
    reasoningEffortLabel: getPrimaryControlLabel(
      'reasoning-effort-picker-toggle',
      state.agentMode,
      state.models,
      state.selectedModelId,
      state.reasoningEffort,
      state.runMode,
    ),
    runModeLabel: getPrimaryControlLabel(
      'run-mode-picker-toggle',
      state.agentMode,
      state.models,
      state.selectedModelId,
      state.reasoningEffort,
      state.runMode,
    ),
  })
  return state
}
