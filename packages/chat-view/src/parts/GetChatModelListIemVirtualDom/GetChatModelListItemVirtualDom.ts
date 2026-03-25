import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModelListItemVirtualDom = (model: ChatModel, selectedModelId: string): readonly VirtualDomNode[] => {
<<<<<<< HEAD
  return getCustomSelectOptionVirtualDom(
    InputName.getModelPickerItemInputName(model.id),
    getModelLabel(model),
    model.id === selectedModelId,
    getUsageCostLabel(model),
  )
=======
  const className = mergeClassNames(ClassNames.ChatModelPickerItem, model.id === selectedModelId ? ClassNames.ChatModelPickerItemSelected : '')

  return [
    {
      childCount: 2,
      className,
      name: InputName.getModelPickerItemInputName(model.id),
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
>>>>>>> origin/main
}
