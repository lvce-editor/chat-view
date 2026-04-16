import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'

export const getCustomSelectPickerToggleVirtualDom = (
  label: string,
  name: string,
  open: boolean,
  onClick: number,
  renderSelectChevrons: boolean,
  title = label,
  ariaLabel = title,
  ariaControls = '',
  selectChevronEnabled = true,
): readonly VirtualDomNode[] => {
<<<<<<< HEAD
  return getCustomSelectToggleVirtualDom(label, name, open, onClick, renderSelectChevrons, title, ariaLabel, ariaControls)
=======
  return getCustomSelectToggleVirtualDom(label, name, open, onClick, title, ariaLabel, ariaControls, selectChevronEnabled)
>>>>>>> origin/main
}
