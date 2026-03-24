import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as InputName from '../InputName/InputName.ts'

export const getAddContextButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: InputName.AddContext,
      title: Strings.addContext(),
      type: VirtualDomElements.Button,
    },
    {
      text: Strings.addContext(),
      type: VirtualDomElements.Text,
    },
  ]
}
