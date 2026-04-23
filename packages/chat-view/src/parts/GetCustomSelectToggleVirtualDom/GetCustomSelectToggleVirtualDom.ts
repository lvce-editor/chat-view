import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getCustomSelectToggleVirtualDom = (
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
  const getChevronDom = (expanded: boolean): VirtualDomNode => {
    return {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, expanded ? ClassNames.MaskIconChevronUp : ClassNames.MaskIconChevronDown),
      name,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    }
  }

  const showChevron = renderSelectChevrons && selectChevronEnabled

  return [
    {
      ...(ariaControls ? { 'aria-controls': ariaControls } : {}),
      'aria-expanded': open ? 'true' : 'false',
      'aria-haspopup': 'true',
      'aria-label': ariaLabel,
      ariaLabel,
      childCount: showChevron ? 2 : 1,
      className: ClassNames.ChatSelect,
      inputType: 'button',
      name,
      onClick,
      title,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 1,
      className: ClassNames.SelectLabel,
      name,
      role: AriaRoles.None,
      type: VirtualDomElements.Span,
    },
    text(label),
    ...(showChevron ? [getChevronDom(open)] : []),
  ]
}
