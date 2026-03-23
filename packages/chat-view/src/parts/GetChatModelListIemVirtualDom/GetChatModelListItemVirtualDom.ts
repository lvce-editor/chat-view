import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'

export const getChatModelListItemVirtualDom = (model: ChatModel, selectedModelId: string): readonly VirtualDomNode[] => {
  return [
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
  ]
}
