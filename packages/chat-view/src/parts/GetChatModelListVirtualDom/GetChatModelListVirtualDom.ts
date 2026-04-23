import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelListItemVirtualDom } from '../GetChatModelListIemVirtualDom/GetChatModelListItemVirtualDom.ts'
import { getNoMatchingModelsFoundVirtualDom } from '../GetNoMatchingModelsFoundVirtualDom/GetNoMatchingModelsFoundVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModelListVirtualDom = (
  visibleModels: readonly ChatModel[],
  selectedModelId: string,
  showModelUsageMultiplier = true,
): readonly VirtualDomNode[] => {
  if (visibleModels.length === 0) {
    return getNoMatchingModelsFoundVirtualDom()
  }
  return [
    {
      childCount: visibleModels.length,
      className: ClassNames.ChatModelPickerList,
      id: InputName.ModelPickerList,
      onClick: DomEventListenerFunctions.HandleClickModelPickerList,
      onPointerDown: DomEventListenerFunctions.HandlePointerDownModelPickerList,
      onPointerUp: DomEventListenerFunctions.HandlePointerUpModelPickerList,
      onScroll: DomEventListenerFunctions.HandleModelPickerListScroll,
      role: AriaRoles.ListBox,
      type: VirtualDomElements.Ul,
    },

    ...visibleModels.flatMap((model) => getChatModelListItemVirtualDom(model, selectedModelId, showModelUsageMultiplier)),
  ]
}
