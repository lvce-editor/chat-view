import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getChatModelPickerToggleVirtualDom } from '../GetChatModelPickerToggleVirtualDom/GetChatModelPickerToggleVirtualDom.ts'

export const getChatModelPickerVirtualDom = (
  models: readonly ChatModel[],
  visibleModels: readonly ChatModel[],
  selectedModelId: string,
  modelPickerOpen: boolean,
  modelPickerSearchValue: string,
  renderSelectChevrons: boolean,
): readonly VirtualDomNode[] => {
  return [
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen, renderSelectChevrons),
    ...(modelPickerOpen ? getChatModelPickerPopOverVirtualDom(visibleModels, selectedModelId, modelPickerSearchValue) : []),
  ]
}
