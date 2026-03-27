import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getAgentModePickerPopOverVirtualDom } from '../GetAgentModePickerPopOverVirtualDom/GetAgentModePickerPopOverVirtualDom.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getRunModePickerPopOverVirtualDom } from '../GetRunModePickerPopOverVirtualDom/GetRunModePickerPopOverVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export interface GetChatOverlaysVirtualDomOptions {
  readonly agentMode: AgentMode
  readonly agentModePickerVisible: boolean
  readonly dropOverlayVisible: boolean
  readonly modelPickerSearchValue: string
  readonly modelPickerVisible: boolean
  readonly runMode: RunMode
  readonly runModePickerVisible: boolean
  readonly selectedModelId: string
  readonly visibleModels: readonly ChatModel[]
}

const getDropOverlayVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatViewDropOverlay, ClassNames.ChatViewDropOverlayActive),
      name: InputName.ComposerDropTarget,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      type: VirtualDomElements.Div,
    },
    {
      text: Strings.attachImageAsContext(),
      type: VirtualDomElements.Text,
    },
  ]
}

export const getChatOverlaysVirtualDom = ({
  agentMode,
  agentModePickerVisible,
  dropOverlayVisible,
  modelPickerSearchValue,
  modelPickerVisible,
  runMode,
  runModePickerVisible,
  selectedModelId,
  visibleModels,
}: GetChatOverlaysVirtualDomOptions): readonly VirtualDomNode[] => {
  const overlayChildCount =
    (dropOverlayVisible ? 1 : 0) + (agentModePickerVisible ? 1 : 0) + (modelPickerVisible ? 1 : 0) + (runModePickerVisible ? 1 : 0)
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
    ...(agentModePickerVisible ? getAgentModePickerPopOverVirtualDom(agentMode) : []),
    ...(modelPickerVisible ? getChatModelPickerPopOverVirtualDom(visibleModels, selectedModelId, modelPickerSearchValue) : []),
    ...(runModePickerVisible ? getRunModePickerPopOverVirtualDom(runMode) : []),
  ]
}
