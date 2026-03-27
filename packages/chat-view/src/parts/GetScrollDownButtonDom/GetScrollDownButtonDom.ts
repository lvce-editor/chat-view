import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getScrollDownButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      inputType: 'button',
      name: InputName.ScrollDown,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.scrollDown(),
      type: VirtualDomElements.Button,
    },
    {
      text: Strings.scrollDown(),
      type: VirtualDomElements.Text,
    },
  ]
}
