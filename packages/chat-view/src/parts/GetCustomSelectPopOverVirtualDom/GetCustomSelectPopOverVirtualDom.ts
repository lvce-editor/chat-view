import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getCustomSelectPopOverVirtualDom = (
  optionCount: number,
  height: number,
  optionNodes: readonly VirtualDomNode[],
  containerClassName = '',
  popOverClassName = '',
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatModelPickerContainer, containerClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatModelPicker, popOverClassName),
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
