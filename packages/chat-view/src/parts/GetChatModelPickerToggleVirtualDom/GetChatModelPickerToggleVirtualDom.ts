import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModelPickerToggleVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerOpen: boolean,
): readonly VirtualDomNode[] => {
  const selectedModel = models.find((model) => model.id === selectedModelId)
  const selectedModelLabel = selectedModel ? selectedModel.name : selectedModelId
  return [
    {
      childCount: 1,
      className: ClassNames.CustomSelectContainer,
      type: VirtualDomElements.Div,
    },
    ...getCustomSelectToggleVirtualDom(
      selectedModelLabel,
      InputName.ModelPickerToggle,
      modelPickerOpen,
      DomEventListenerFunctions.HandleClickModelPickerToggle,
    ),
  ]
}
