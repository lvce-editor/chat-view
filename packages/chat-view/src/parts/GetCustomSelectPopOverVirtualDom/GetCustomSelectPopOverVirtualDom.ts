import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getCustomSelectPopOverVirtualDom = (
  optionCount: number,
  height: number,
  optionNodes: readonly VirtualDomNode[],
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerContainer,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPicker,
      style: `height: ${height}px;`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: optionCount,
      className: ClassNames.ChatModelPickerList,
      type: VirtualDomElements.Ul,
    },
    ...optionNodes,
  ]
}
