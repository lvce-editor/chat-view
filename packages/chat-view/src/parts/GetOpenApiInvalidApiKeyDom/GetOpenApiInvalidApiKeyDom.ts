import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { OpenOpenApiApiKeySettings } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

const actionsNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Actions,
  type: VirtualDomElements.Div,
}

const settingsButtonNode: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
  name: OpenOpenApiApiKeySettings,
  onClick: DomEventListenerFunctions.HandleClick,
  type: VirtualDomElements.Button,
}

export const getOpenApiInvalidApiKeyDom = (): readonly VirtualDomNode[] => {
  return [actionsNode, settingsButtonNode, text('Settings')]
}
