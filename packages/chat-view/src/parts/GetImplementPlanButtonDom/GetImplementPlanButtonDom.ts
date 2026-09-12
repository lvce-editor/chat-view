import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const buttonClassName = mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary)

export const getImplementPlanButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: buttonClassName,
      inputType: 'button',
      name: InputName.ImplementPlan,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.implement(),
      type: VirtualDomElements.Button,
    },
    {
      text: Strings.implement(),
      type: VirtualDomElements.Text,
    },
  ]
}
