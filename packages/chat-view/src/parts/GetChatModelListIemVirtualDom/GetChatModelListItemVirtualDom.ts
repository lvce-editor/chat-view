import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostDom } from '../GetUsageCostDom/GetUsageCostDom.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'

export const getChatModelListItemVirtualDom = (
  model: ChatModel,
  selectedModelId: string,
  showModelUsageMultiplier = true,
): readonly VirtualDomNode[] => {
  const detail = showModelUsageMultiplier ? getUsageCostLabel(model) : ''
  const hasDetail = detail !== ''
  const usageCostDom = getUsageCostDom(detail)
  const selected = model.id === selectedModelId
  const className = mergeClassNames(ClassNames.ChatModelPickerItem, selected ? ClassNames.ChatModelPickerItemSelected : '')
  return [
    {
      'aria-selected': selected ? 'true' : 'false',
      childCount: hasDetail ? 2 : 1,
      className,
      'data-id': model.id,
      role: AriaRoles.Option,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerItemLabel,
      type: VirtualDomElements.Span,
    },
    text(getModelLabel(model)),
    ...usageCostDom,
  ]
}
