import { AriaRoles, type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const chatModelPickerItemLabelNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatModelPickerItemLabel,
  type: VirtualDomElements.Span,
}

const chatModelPickerItemUsageCostNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatModelPickerItemUsageCost,
  type: VirtualDomElements.Span,
}

export const getCustomSelectOptionVirtualDom = (name: string, label: string, selected: boolean, detail = ''): readonly VirtualDomNode[] => {
  const className = mergeClassNames(ClassNames.ChatModelPickerItem, selected ? ClassNames.ChatModelPickerItemSelected : '')
  const hasDetail = detail !== ''
  const detailDom = hasDetail ? [chatModelPickerItemUsageCostNode, text(detail)] : []
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
    chatModelPickerItemLabelNode,
    text(label),
    ...detailDom,
  ]
}
