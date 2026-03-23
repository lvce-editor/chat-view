import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'
import { getUsageCostLabel } from '../GetUsageCostLabel/GetUsageCostLabel.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModelListVirtualDom = (visibleModels: readonly ChatModel[], selectedModelId: string): readonly VirtualDomNode[] => {
  return [
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
