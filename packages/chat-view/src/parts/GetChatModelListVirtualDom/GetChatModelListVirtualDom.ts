import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelListItemVirtualDom } from '../GetChatModelListIemVirtualDom/GetChatModelListItemVirtualDom.ts'
import { getNoMatchingModelsFoundVirtualDom } from '../GetNoMatchingModelsFoundVirtualDom/GetNoMatchingModelsFoundVirtualDom.ts'

export const getChatModelListVirtualDom = (visibleModels: readonly ChatModel[], selectedModelId: string): readonly VirtualDomNode[] => {
  if (visibleModels.length === 0) {
    return getNoMatchingModelsFoundVirtualDom()
  }
  return [
    {
      childCount: visibleModels.length,
      className: ClassNames.ChatModelPickerList,
      onScroll: DomEventListenerFunctions.HandleModelPickerListScroll,
      type: VirtualDomElements.Ul,
    },

    ...visibleModels.flatMap((model) => getChatModelListItemVirtualDom(model, selectedModelId)),
  ]
}
