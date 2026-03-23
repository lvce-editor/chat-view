import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
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
      childCount: 2,
      className: ClassNames.Select,
      name: InputName.ModelPickerToggle,
      onClick: DomEventListenerFunctions.HandleClick,
      title: selectedModelLabel,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 1,
      className: ClassNames.SelectLabel,
      type: VirtualDomElements.Span,
    },
    text(selectedModelLabel),
    {
      childCount: 0,
      className: modelPickerOpen ? 'MaskIcon MaskIconChevronUp' : 'MaskIcon MaskIconChevronDown',
      role: 'none',
      type: VirtualDomElements.Div,
    },
  ]
}

export const getChatModelPickerVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerOpen: boolean,
  modelPickerSearchValue: string,
): readonly VirtualDomNode[] => {
  return [
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen),
    ...(modelPickerOpen ? getChatModelPickerPopOverVirtualDom(models, selectedModelId, modelPickerSearchValue) : []),
  ]
}
