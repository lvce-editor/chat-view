import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import * as InputName from '../InputName/InputName.ts'

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
      onContextMenu: DomEventListenerFunctions.HandleContextMenuChatSendAreaBottom,
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
      childCount: Math.max(visibleModels.length, 1),
      className: ClassNames.ChatModelPickerList,
      name: InputName.ModelPickerList,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Ul,
    },
    ...(visibleModels.length === 0
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerItem,
            type: VirtualDomElements.Li,
          },
          text(Strings.noMatchingModelsFound()),
        ]
      : visibleModels.flatMap((model) => [
          {
            childCount: 2,
            className: `${ClassNames.ChatModelPickerItem}${model.id === selectedModelId ? ` ${ClassNames.ChatModelPickerItemSelected}` : ''}`,
            type: VirtualDomElements.Li,
          },
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerItemLabel,
            type: VirtualDomElements.Span,
          },
          text(getModelLabel(model)),
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerItemUsageCost,
            type: VirtualDomElements.Span,
          },
          text(getUsageCostLabel(model)),
        ])),
  ]
}
