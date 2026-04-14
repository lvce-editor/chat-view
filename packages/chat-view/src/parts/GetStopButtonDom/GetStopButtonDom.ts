import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getStopButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      buttonType: 'button',
      childCount: 1,
      className: ClassNames.Button,
      name: InputName.Stop,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.stop(),
      type: VirtualDomElements.Button,
    },
    text(Strings.stop()),
  ]
}
