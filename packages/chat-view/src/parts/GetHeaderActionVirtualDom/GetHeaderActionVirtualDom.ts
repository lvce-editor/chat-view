import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getHeaderActionVirtualDom = (item: {
  readonly icon: string
  readonly title: string
  readonly name: string
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
    text(item.icon),
  ]
}
