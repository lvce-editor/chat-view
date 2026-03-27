import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'

export const getCustomSelectPickerToggleVirtualDom = (
  label: string,
  name: string,
  open: boolean,
  onClick: number,
  title = label,
  containerChildCount = 1,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: containerChildCount,
      className: ClassNames.CustomSelectContainer,
      type: VirtualDomElements.Div,
    },
    ...getCustomSelectToggleVirtualDom(label, name, open, onClick, title),
  ]
}
