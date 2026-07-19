import { type VirtualDomNode, AriaRoles, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { primaryControlsOverflowLabel } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const chatSelectNode: VirtualDomNode = {
  'aria-haspopup': 'true',
  'aria-label': 'More controls',
  childCount: 1,
  className: ClassNames.ChatSelect,
  inputType: 'button',
  name: InputName.PrimaryControlsOverflow,
  onClick: DomEventListenerFunctions.HandleClick,
  title: 'More controls',
  type: VirtualDomElements.Button,
}

const selectLabelNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.SelectLabel,
  name: InputName.PrimaryControlsOverflow,
  role: AriaRoles.None,
  type: VirtualDomElements.Span,
}

export const getPrimaryControlsOverflowButtonDom = (): readonly VirtualDomNode[] => {
  return [chatSelectNode, selectLabelNode, text(primaryControlsOverflowLabel)]
}
