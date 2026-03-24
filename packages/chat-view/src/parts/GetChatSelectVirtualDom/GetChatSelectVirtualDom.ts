import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getModelOptionDom } from '../GetModelOptionDom/GetModelOptionDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatSelectVirtualDom = (models: readonly ChatModel[], selectedModelId: string): readonly VirtualDomNode[] => {
  const modelOptions = models.flatMap((model) => getModelOptionDom(model, selectedModelId))
  return [
    {
      childCount: models.length,
      className: ClassNames.Select,
      name: InputName.Model,
      onInput: DomEventListenerFunctions.HandleModelChange,
      type: VirtualDomElements.Select,
      value: selectedModelId,
    },
    ...modelOptions,
  ]
}
