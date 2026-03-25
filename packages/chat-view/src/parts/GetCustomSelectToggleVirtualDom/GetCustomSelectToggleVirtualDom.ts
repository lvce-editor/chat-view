import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getCustomSelectToggleVirtualDom = (
  label: string,
  name: string,
  open: boolean,
  onClick: number,
  title = label,
): readonly VirtualDomNode[] => {
  return [
    {
      'aria-expanded': open ? 'true' : 'false',
      'aria-haspopup': 'true',
      childCount: 2,
      className: ClassNames.Select,
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
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, open ? ClassNames.MaskIconChevronUp : ClassNames.MaskIconChevronDown),
      name,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ]
}
