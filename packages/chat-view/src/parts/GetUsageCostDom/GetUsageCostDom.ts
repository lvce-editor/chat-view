import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getUsageCostDom = (detail: string): readonly VirtualDomNode[] => {
  if (detail === '') {
    return []
  }
  return [
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerItemUsageCost,
      type: VirtualDomElements.Span,
    },
    text(detail),
  ]
}
