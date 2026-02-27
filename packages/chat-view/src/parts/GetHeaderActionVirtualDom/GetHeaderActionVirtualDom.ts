import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getHeaderActionVirtualDom = (item: {
  readonly icon: string
  readonly title: string
  readonly name?: string
  readonly onClick?: number
}): readonly VirtualDomNode[] => {
  const name = 'name' in item ? item.name : undefined
  const onClick = 'onClick' in item ? item.onClick : undefined
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      ...(name ? { name } : {}),
      ...(onClick ? { onClick } : {}),
      role: AriaRoles.Button,
      tabIndex: 0,
      title: item.title,
      type: VirtualDomElements.Button,
    },
    text(item.icon),
  ]
}
