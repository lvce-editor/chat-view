import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../../ChatModel/ChatModel.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

export const getModelOptionDOm = (model: ChatModel, selectedModelId: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.Option,
      selected: model.id === selectedModelId,
      type: VirtualDomElements.Option,
      value: model.id,
    },
    text(model.name),
  ]
}