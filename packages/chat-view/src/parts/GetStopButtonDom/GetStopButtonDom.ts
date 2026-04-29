import { type VirtualDomNode, AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const stopButtonIcon: VirtualDomNode = {
  childCount: 0,
  className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconStopCircle),
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

export const getStopButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      'aria-label': Strings.stop(),
      buttonType: 'button',
      childCount: 1,
      className: ClassNames.IconButton,
      name: InputName.Stop,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    stopButtonIcon,
  ]
}
