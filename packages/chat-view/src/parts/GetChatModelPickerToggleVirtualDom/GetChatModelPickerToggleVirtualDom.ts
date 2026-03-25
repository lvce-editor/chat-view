import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

 
export const getChatModelPickerToggleVirtualDom = (
  models: readonly ChatModel[],
  selectedModelId: string,
  modelPickerOpen: boolean,
): readonly VirtualDomNode[] => {
  const selectedModel = models.find((model) => model.id === selectedModelId)
  const selectedModelLabel = selectedModel ? selectedModel.name : selectedModelId
  return [
    {
      'aria-expanded': modelPickerOpen ? 'true' : 'false',
      'aria-haspopup': 'true',
      childCount: 2,
      className: ClassNames.Select,
      name: InputName.ModelPickerToggle,
      onClick: DomEventListenerFunctions.HandleClickModelPickerToggle,
      title: selectedModelLabel,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 1,
      className: ClassNames.SelectLabel,
      role: AriaRoles.None,
      type: VirtualDomElements.Span,
    },
    text(selectedModelLabel),
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, modelPickerOpen ? ClassNames.MaskIconChevronUp : ClassNames.MaskIconChevronDown),
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ]
}
