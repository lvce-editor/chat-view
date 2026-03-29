import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ChatStrings from '../ChatStrings/ChatStrings.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectPickerToggleVirtualDom } from '../GetCustomSelectPickerToggleVirtualDom/GetCustomSelectPickerToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModelPickerToggleVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerOpen: boolean,
): readonly VirtualDomNode[] => {
  const selectedModel = models.find((model) => model.id === selectedModelId)
  const selectedModelLabel = selectedModel ? selectedModel.name : selectedModelId
  const pickModelLabel = ChatStrings.pickModel(selectedModelLabel)
  return getCustomSelectPickerToggleVirtualDom(
    selectedModelLabel,
    InputName.ModelPickerToggle,
    modelPickerOpen,
    DomEventListenerFunctions.HandleClickModelPickerToggle,
    pickModelLabel,
    pickModelLabel,
  )
}
