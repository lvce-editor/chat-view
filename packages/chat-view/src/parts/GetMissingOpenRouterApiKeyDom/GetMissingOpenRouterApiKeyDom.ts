import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { OpenRouterApiKeyInput, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const getMissingOpenRouterApiKeyDom = (openRouterApiKeyInput: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name: OpenRouterApiKeyInput,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: Strings.openRouterApiKeyPlaceholder(),
      rows: 2,
      type: VirtualDomElements.TextArea,
      value: openRouterApiKeyInput,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary),
      name: SaveOpenRouterApiKey,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(Strings.save()),
  ]
}
