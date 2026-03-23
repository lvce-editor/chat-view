import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelListItemVirtualDom } from '../GetChatModelListIemVirtualDom/GetChatModelListItemVirtualDom.ts'

const getNoMatchingModelsFoundVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'Message',
      type: VirtualDomElements.P,
    },
    text(Strings.noMatchingModelsFound()),
  ]
}

export const getChatModelListVirtualDom = (visibleModels: readonly ChatModel[], selectedModelId: string): readonly VirtualDomNode[] => {
  if (visibleModels.length === 0) {
    return getNoMatchingModelsFoundVirtualDom()
  }
  return [
    {
      childCount: visibleModels.length,
      className: ClassNames.ChatModelPickerList,
      onClick: DomEventListenerFunctions.HandleClickModelPickerList,
      type: VirtualDomElements.Ul,
    },

    ...visibleModels.flatMap((model) => getChatModelListItemVirtualDom(model, selectedModelId)),
  ]
}
