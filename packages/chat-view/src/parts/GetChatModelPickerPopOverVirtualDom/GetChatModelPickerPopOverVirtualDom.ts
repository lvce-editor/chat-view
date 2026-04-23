import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelListVirtualDom } from '../GetChatModelListVirtualDom/GetChatModelListVirtualDom.ts'
import { getModelPickerHeaderDom } from '../GetModelPickerHeaderDom/GetModelPickerHeaderDom.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'

export const getChatModelPickerPopOverVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerSearchValue: string,
): readonly VirtualDomNode[] => {
  const visibleModels = getVisibleModels(models, modelPickerSearchValue)
  return [
    {
      childCount: 2,
      className: ClassNames.ChatModelPickerContainer,
      onClick: DomEventListenerFunctions.HandleClickModelPickerContainer,
      onContextMenu: DomEventListenerFunctions.HandleContextMenuChatSendAreaBottom,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.ChatModelPicker,
      type: VirtualDomElements.Div,
    },
    ...getModelPickerHeaderDom(modelPickerSearchValue),
    ...getChatModelListVirtualDom(visibleModels, selectedModelId),
  ]
}
