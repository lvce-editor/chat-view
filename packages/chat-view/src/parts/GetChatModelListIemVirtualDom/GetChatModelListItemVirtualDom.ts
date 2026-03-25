import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModelListItemVirtualDom = (model: ChatModel, selectedModelId: string): readonly VirtualDomNode[] => {
  return getCustomSelectOptionVirtualDom(
    InputName.getModelPickerItemInputName(model.id),
    getModelLabel(model),
    model.id === selectedModelId,
    getUsageCostLabel(model),
  )
}
