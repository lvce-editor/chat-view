import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelListVirtualDom } from '../GetChatModelListVirtualDom/GetChatModelListVirtualDom.ts'
import { getModelPickerHeaderDom } from '../GetModelPickerHeaderDom/GetModelPickerHeaderDom.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'

const chatModelPickerContainerNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatModelPickerContainer,
  onClick: DomEventListenerFunctions.HandleModelInputBlur,
  onContextMenu: DomEventListenerFunctions.HandleContextMenuChatSendAreaBottom,
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

export const getChatModelPickerPopOverVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerSearchValue: string,
  showModelUsageMultiplier = true,
): readonly VirtualDomNode[] => {
  const visibleModels = getVisibleModels(models, modelPickerSearchValue)
  return [
    chatModelPickerContainerNode,
    {
      childCount: 2 + visibleModels.length,
      className: ClassNames.ChatModelPicker,
      type: VirtualDomElements.Div,
    },
    ...getModelPickerHeaderDom(modelPickerSearchValue),
    ...getChatModelListVirtualDom(visibleModels, selectedModelId, showModelUsageMultiplier),
  ]
}
