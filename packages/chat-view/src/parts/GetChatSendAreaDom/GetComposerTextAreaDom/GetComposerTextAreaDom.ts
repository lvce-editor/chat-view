import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'

export const getComposerTextAreaDom = (): VirtualDomNode => {
  return {
    childCount: 0,
    className: mergeClassNames(ClassNames.MultiLineInputBox, ClassNames.ChatInputBox),
    name: InputName.Composer,
    onBlur: DomEventListenerFunctions.HandleBlur,
    onContextMenu: DomEventListenerFunctions.HandleChatInputContextMenu,
    onFocus: DomEventListenerFunctions.HandleFocus,
    onInput: DomEventListenerFunctions.HandleInput,
    onSelectionChange: DomEventListenerFunctions.HandleComposerSelectionChange,
    placeholder: Strings.composePlaceholder(),
    spellcheck: false,
    type: VirtualDomElements.TextArea,
  }
}
