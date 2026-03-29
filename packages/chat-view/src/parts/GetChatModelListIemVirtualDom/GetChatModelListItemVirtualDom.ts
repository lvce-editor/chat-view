import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'

export const getChatModelListItemVirtualDom = (model: ChatModel, selectedModelId: string): readonly VirtualDomNode[] => {
  const detail = getUsageCostLabel(model)
  const hasDetail = detail !== ''
  const className = mergeClassNames(ClassNames.ChatModelPickerItem, model.id === selectedModelId ? ClassNames.ChatModelPickerItemSelected : '')
  return [
    {
      childCount: hasDetail ? 2 : 1,
      className,
      'data-id': model.id,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerItemLabel,
      type: VirtualDomElements.Span,
    },
    text(getModelLabel(model)),
    ...(hasDetail
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerItemUsageCost,
            type: VirtualDomElements.Span,
          },
          text(detail),
        ]
      : []),
  ]
}
