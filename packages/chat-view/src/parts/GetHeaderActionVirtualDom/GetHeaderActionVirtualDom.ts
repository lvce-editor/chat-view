import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { InputName } from '../InputName/InputName.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getHeaderActionVirtualDom = (item: {
  readonly icon: string
  readonly title: string
  readonly name: InputName
  readonly onClick: number
}): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: item.name,
      onClick: item.onClick,
      role: AriaRoles.Button,
      title: item.title,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: item.icon,
      type: VirtualDomElements.Div,
    },
  ]
}
