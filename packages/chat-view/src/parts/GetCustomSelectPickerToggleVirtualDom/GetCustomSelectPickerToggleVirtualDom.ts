import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'

export const getCustomSelectPickerToggleVirtualDom = (
  label: string,
  name: string,
  open: boolean,
  onClick: number,
  title = label,
  ariaLabel = title,
): readonly VirtualDomNode[] => {
  return getCustomSelectToggleVirtualDom(label, name, open, onClick, title, ariaLabel)
}
