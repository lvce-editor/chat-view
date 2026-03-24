import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatModelListVirtualDom } from '../GetChatModelListVirtualDom/GetChatModelListVirtualDom.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import * as InputName from '../InputName/InputName.ts'

const getModelPickerHeaderDom = (modelPickerSearchValue: string): readonly VirtualDomNode[] => {
  return [
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
      placeholder: Strings.searchModels(),
      type: VirtualDomElements.Input,
      value: modelPickerSearchValue,
    },
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: InputName.ModelPickerSettings,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.settings(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconSettingsGear',
      type: VirtualDomElements.Div,
    },
  ]
}

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
    ...getModelPickerHeaderDom(modelPickerSearchValue),
    ...getChatModelListVirtualDom(visibleModels, selectedModelId),
  ]
}
