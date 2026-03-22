import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
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

export const getChatModelPickerPopOverVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerSearchValue: string,
): readonly VirtualDomNode[] => {
  const normalizedSearch = modelPickerSearchValue.trim().toLowerCase()
  const visibleModels = normalizedSearch ? models.filter((model) => getModelLabel(model).toLowerCase().includes(normalizedSearch)) : models
  return [
    {
      childCount: 2,
      className: ClassNames.ChatModelPickerContainer,
      style: 'position:absolute;',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 3 + visibleModels.length,
      className: ClassNames.ChatModelPicker,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.ChatModelPickerHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.InputBox,
      inputType: 'search',
      name: InputName.ModelPickerSearch,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: 'Search models',
      type: VirtualDomElements.Input,
      value: modelPickerSearchValue,
    },
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: InputName.ModelPickerSettings,
      onClick: DomEventListenerFunctions.HandleClick,
      title: 'Settings',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconSettingsGear',
      type: VirtualDomElements.Div,
    },
    {
      childCount: visibleModels.length,
      className: ClassNames.ChatModelPickerList,
      type: VirtualDomElements.Ul,
    },
    ...visibleModels.flatMap((model) => [
      {
        childCount: 1,
        className: `${ClassNames.ChatModelPickerItem}${model.id === selectedModelId ? ` ${ClassNames.ChatModelPickerItemSelected}` : ''}`,
        name: InputName.getModelPickerItemInputName(model.id),
        onClick: DomEventListenerFunctions.HandleClick,
        type: VirtualDomElements.Li,
      },
      text(getModelLabel(model)),
    ]),
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
