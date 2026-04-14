import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const getCustomSelectOptionVirtualDom = (name: string, label: string, selected: boolean, detail = ''): readonly VirtualDomNode[] => {
  const className = mergeClassNames(ClassNames.ChatModelPickerItem, selected ? ClassNames.ChatModelPickerItemSelected : '')
  const hasDetail = detail !== ''
  return [
    {
      childCount: 1,
      className,
      type: VirtualDomElements.Li,
    },
    {
      childCount: hasDetail ? 2 : 1,
      className,
      inputType: 'button',
      name,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerItemLabel,
      name,
      type: VirtualDomElements.Span,
    },
    text(label),
    ...(hasDetail
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerItemUsageCost,
            name,
            type: VirtualDomElements.Span,
          },
          text(detail),
        ]
      : []),
  ]
}
