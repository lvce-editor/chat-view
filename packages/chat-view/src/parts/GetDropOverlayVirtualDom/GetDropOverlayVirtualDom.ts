import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const dropOverlayNode: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.ChatViewDropOverlay, ClassNames.ChatViewDropOverlayActive),
  name: InputName.ComposerDropTarget,
  onDragLeave: DomEventListenerFunctions.HandleDragLeave,
  onDragOver: DomEventListenerFunctions.HandleDragOver,
  onDrop: DomEventListenerFunctions.HandleDrop,
  type: VirtualDomElements.Div,
}

export const getDropOverlayVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    dropOverlayNode,
    {
      text: Strings.attachImageAsContext(),
      type: VirtualDomElements.Text,
    },
  ]
}
