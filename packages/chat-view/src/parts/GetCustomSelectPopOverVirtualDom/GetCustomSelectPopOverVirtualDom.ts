import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getCustomSelectPopOverVirtualDom = (
  optionCount: number,
  height: number,
  optionNodes: readonly VirtualDomNode[],
  containerClassName = '',
  popOverClassName = '',
  useInlineHeight = true,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatModelPickerContainer, containerClassName),
      onClick: DomEventListenerFunctions.HandleClickCustomSelectOverlay,
      type: VirtualDomElements.Div,
    },
    useInlineHeight
      ? {
          childCount: 1,
          className: mergeClassNames(ClassNames.ChatModelPicker, popOverClassName),
          style: `height: ${height}px;`,
          type: VirtualDomElements.Div,
        }
      : {
          childCount: 1,
          className: mergeClassNames(ClassNames.ChatModelPicker, popOverClassName),
          type: VirtualDomElements.Div,
        },
    {
      childCount: optionCount,
      className: ClassNames.ChatModelPickerList,
      name: InputName.PickerList,
      tabIndex: -1,
      type: VirtualDomElements.Ul,
    },
    ...optionNodes,
  ]
}
