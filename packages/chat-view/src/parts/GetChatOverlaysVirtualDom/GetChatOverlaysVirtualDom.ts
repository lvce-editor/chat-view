import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getAgentModePickerPopOverVirtualDom } from '../GetAgentModePickerPopOverVirtualDom/GetAgentModePickerPopOverVirtualDom.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getComposerAttachmentPreviewOverlayVirtualDom } from '../GetComposerAttachmentPreviewOverlayVirtualDom/GetComposerAttachmentPreviewOverlayVirtualDom.ts'
import { getDropOverlayVirtualDom } from '../GetDropOverlayVirtualDom/GetDropOverlayVirtualDom.ts'
import { getRunModePickerPopOverVirtualDom } from '../GetRunModePickerPopOverVirtualDom/GetRunModePickerPopOverVirtualDom.ts'

export interface GetChatOverlaysVirtualDomOptions {
  readonly agentMode: AgentMode
  readonly agentModePickerVisible: boolean
  readonly composerAttachmentPreviewOverlayAttachmentId: string
  readonly composerAttachmentPreviewOverlayError: boolean
  readonly composerAttachmentPreviewOverlayVisible: boolean
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly dropOverlayVisible: boolean
  readonly modelPickerSearchValue: string
  readonly modelPickerVisible: boolean
  readonly runMode: RunMode
  readonly runModePickerVisible: boolean
  readonly selectedModelId: string
  readonly showModelUsageMultiplier?: boolean
  readonly visibleModels: readonly ChatModel[]
}

export const getChatOverlaysVirtualDom = ({
  agentMode,
  agentModePickerVisible,
  composerAttachmentPreviewOverlayAttachmentId,
  composerAttachmentPreviewOverlayError,
  composerAttachmentPreviewOverlayVisible,
  composerAttachments,
  dropOverlayVisible,
  modelPickerSearchValue,
  modelPickerVisible,
  runMode,
  runModePickerVisible,
  selectedModelId,
  showModelUsageMultiplier = true,
  visibleModels,
}: GetChatOverlaysVirtualDomOptions): readonly VirtualDomNode[] => {
  const overlayChildCount =
    (dropOverlayVisible ? 1 : 0) +
    (composerAttachmentPreviewOverlayVisible ? 1 : 0) +
    (agentModePickerVisible ? 1 : 0) +
    (modelPickerVisible ? 1 : 0) +
    (runModePickerVisible ? 1 : 0)
  if (!overlayChildCount) {
    return []
  }
  return [
    {
      childCount: overlayChildCount,
      className: ClassNames.ChatOverlays,
      type: VirtualDomElements.Div,
    },
    ...(dropOverlayVisible ? getDropOverlayVirtualDom() : []),
    ...getComposerAttachmentPreviewOverlayVirtualDom(
      composerAttachments,
      composerAttachmentPreviewOverlayAttachmentId,
      composerAttachmentPreviewOverlayError,
    ),
    ...(agentModePickerVisible ? getAgentModePickerPopOverVirtualDom(agentMode) : []),
    ...(modelPickerVisible
      ? getChatModelPickerPopOverVirtualDom(visibleModels, selectedModelId, modelPickerSearchValue, showModelUsageMultiplier)
      : []),
    ...(runModePickerVisible ? getRunModePickerPopOverVirtualDom(runMode) : []),
  ]
}
