import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ComposerAttachment } from '../../ComposerAttachment/ComposerAttachment.ts'
import * as Strings from '../../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'

export const getComposerAttachmentRemoveButtonDom = (attachment: ComposerAttachment): readonly VirtualDomNode[] => {
  return [
    {
      'aria-label': Strings.removeAttachment(),
      buttonType: 'button',
      childCount: 1,
      className: ClassNames.ChatComposerAttachmentRemoveButton,
      name: InputName.getComposerAttachmentRemoveInputName(attachment.attachmentId),
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.removeAttachment(),
      type: VirtualDomElements.Button,
    },
    {
      text: 'x',
      type: VirtualDomElements.Text,
    },
  ]
}
