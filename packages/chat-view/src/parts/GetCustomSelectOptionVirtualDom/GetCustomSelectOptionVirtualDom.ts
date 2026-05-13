import { AriaRoles, type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const getCustomSelectOptionVirtualDom = (name: string, label: string, selected: boolean, detail = ''): readonly VirtualDomNode[] => {
  const className = mergeClassNames(ClassNames.ChatModelPickerItem, selected ? ClassNames.ChatModelPickerItemSelected : '')
  const hasDetail = detail !== ''
  return [
    {
      'aria-selected': selected ? 'true' : 'false',
      childCount: hasDetail ? 2 : 1,
      className,
      name,
      onClick: DomEventListenerFunctions.HandleClick,
      role: AriaRoles.Option,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerItemLabel,
      type: VirtualDomElements.Span,
    },
    text(label),
    ...(hasDetail
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerItemUsageCost,
            type: VirtualDomElements.Span,
          },
          text(detail),
        ]
      : []),
  ]
}
