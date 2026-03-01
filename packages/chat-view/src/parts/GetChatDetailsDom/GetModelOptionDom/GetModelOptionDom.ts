import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../../ChatModel/ChatModel.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

const getModelLabel = (model: ChatModel): string => {
  if (model.provider === 'openRouter') {
    return `${model.name} (OpenRouter)`
  }
  return model.name
}

export const getModelOptionDOm = (model: ChatModel, selectedModelId: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.Option,
      selected: model.id === selectedModelId,
      type: VirtualDomElements.Option,
      value: model.id,
    },
    text(getModelLabel(model)),
  ]
}
