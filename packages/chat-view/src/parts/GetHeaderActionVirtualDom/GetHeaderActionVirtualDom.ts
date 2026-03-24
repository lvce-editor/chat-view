import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { InputName } from '../InputName/InputName.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const getHeaderActionClassName = (disabled?: boolean): string => {
  return mergeClassNames(ClassNames.IconButton, disabled ? ClassNames.IconButtonDisabled : '')
}

export const getHeaderActionVirtualDom = (item: {
  readonly icon: string
  readonly title: string
  readonly name: InputName
  readonly onClick: number
  readonly disabled?: boolean
}): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: getHeaderActionClassName(item.disabled),
      disabled: item.disabled,
      name: item.name,
      onClick: item.onClick,
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
