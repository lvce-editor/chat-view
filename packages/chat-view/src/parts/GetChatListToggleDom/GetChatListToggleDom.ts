import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatListToggleDom = (expanded: boolean, hiddenCount: number): readonly VirtualDomNode[] => {
  const label = expanded ? 'Show Less' : `Show ${hiddenCount} More`
  return [
    {
      childCount: 1,
      className: ClassNames.ChatListMoreToggle,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 2,
      className: ClassNames.ChatListMoreToggleButton,
      name: InputName.ChatListShowMore,
      onClick: DomEventListenerFunctions.HandleClick,
      onFocus: DomEventListenerFunctions.HandleFocus,
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames(
        ClassNames.ChatListMoreToggleChevron,
        ClassNames.MaskIcon,
        expanded ? ClassNames.MaskIconChevronDown : ClassNames.MaskIconChevronRight,
      ),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListMoreToggleLabel,
      type: VirtualDomElements.Div,
    },
    text(label),
  ]
}
