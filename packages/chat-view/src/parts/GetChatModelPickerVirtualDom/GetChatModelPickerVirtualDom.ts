import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getChatModelPickerToggleVirtualDom } from '../GetChatModelPickerToggleVirtualDom/GetChatModelPickerToggleVirtualDom.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getChatModelPickerVirtualDom = (
  models: readonly ChatModel[],
  visibleModels: readonly ChatModel[],
  selectedModelId: string,
  modelPickerOpen: boolean,
  modelPickerSearchValue: string,
): readonly VirtualDomNode[] => {
  return [
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen),
    ...(modelPickerOpen ? getChatModelPickerPopOverVirtualDom(visibleModels, selectedModelId, modelPickerSearchValue) : []),
  ]
}
